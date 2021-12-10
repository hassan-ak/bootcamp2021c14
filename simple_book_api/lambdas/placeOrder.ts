import * as AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";

export async function handler(event: any) {
  if (!event.headers.Authorization) {
    return {
      statusCode: 400,
      body: `{ "Error": "Provide Authentication token" }`,
    };
  }
  if (!event.body) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing the parameter body. Give parameters in the following format.\n {
          "bookID": "ID of Book to order", 
          "noOfBooks": "No. of Books to Order"
        }`,
    };
  }
  if (Object.keys(JSON.parse(event.body)).length >= 3) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are giving too much in parameter body. Give parameters in the following format.\n {
        "bookID": "ID of Book to order", 
        "noOfBooks": "No. of Books to Order"
      }`,
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  if (!item.bookID || !item.noOfBooks || isNaN(item.noOfBooks)) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing some parameters in body. Give missing parameters.\n {
              "bookID": ${item.bookID || "Missing"}, 
              "noOfBooks": ${
                isNaN(item.noOfBooks)
                  ? "Not a Number or Missing"
                  : item.noOfBooks
              }
            }`,
    };
  }
  if (!event.headers.Authorization.split(" ")[1]) {
    return {
      statusCode: 400,
      body: `{ "Error": "Provide Correct Authentication token" }`,
    };
  }
  item["user_ID"] = event.headers.Authorization.split(" ")[1];

  const params1 = {
    TableName: TABLE_NAME_USER,
  };
  try {
    const response = await db.scan(params1).promise();
    if (response.Count === 0) {
      return {
        statusCode: 400,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    } else {
      if (response.Items) {
        if (
          response.Items.filter(
            (userItem) => userItem.user_ID === item["user_ID"]
          ).length === 0
        ) {
          return {
            statusCode: 400,
            body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
          };
        } else {
          const userResponse = response.Items.filter(
            (userItem) => userItem.user_ID === item["user_ID"]
          );
          item["userName"] = userResponse[0].userName;
          item["userEmail"] = userResponse[0].userEmail;
          console.log(item);
          return {
            statusCode: 200,
            body: `{ "status": "OK from place Order" }`,
          };
        }
      } else {
        return {
          statusCode: 400,
          body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
        };
      }
    }
  } catch (error) {
    console.log("Error = ", error);
    return {
      statusCode: 500,
      body: error,
    };
  }
}
