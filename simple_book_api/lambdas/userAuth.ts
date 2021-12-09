import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";

const PRIMARY_KEY_USER = process.env.PRIMARY_KEY_USER || "";
const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing the parameter body. Give parameters in the following format.\n{
          "userName": "User's Name",
          "userEmail": "User's Email"
        }`,
    };
  }
  if (Object.keys(JSON.parse(event.body)).length >= 3) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are giving to much data in parameter body. Give parameters in the following format.\n{
          "userName": "User's Name",
          "userEmail": "User's Email"
        }`,
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  item["user_ID"] = randomBytes(32).toString("hex");
  if (
    !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(item.userEmail)
      ? true
      : false)
  ) {
    return {
      statusCode: 400,
      body: `{ "Error": "Enter Email in valid format" }`,
    };
  }
  const params = {
    TableName: TABLE_NAME_USER,
    Item: item,
  };
  if (!item.userEmail || !item.userName) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing some parameters in body. Give missing parameters.\n{
          "userName": ${item.userName || "Missing"}, 
          "userEmail": ${item.userEmail || "Missing"}
        }`,
    };
  }
  const params1 = {
    TableName: TABLE_NAME_USER,
    Key: {
      [PRIMARY_KEY_USER]: item.userEmail,
    },
  };

  try {
    const response = await db.get(params1).promise();
    if (response.Item) {
      console.log(response);
      return {
        statusCode: 400,
        body: `User already registered.\n${JSON.stringify(response.Item)}`,
      };
    }
    await db.put(params).promise();
    return {
      statusCode: 201,
      body: `Following user success-fully registered. Copy user_ID to be used for Auth. \n{
        "userName": ${item.userName || "Missing"}, 
        "userEmail": ${item.userEmail || "Missing"},
        "user_ID":${item.user_ID}
      }`,
    };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
