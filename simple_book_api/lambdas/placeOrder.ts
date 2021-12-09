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

  ///////
  ///////
  ///////
  ///////
  ///////
  try {
    console.log(item);
    return {
      statusCode: 200,
      body: `{ "status": "OK from place Order" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
}
