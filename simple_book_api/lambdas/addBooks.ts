import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";

const PRIMARY_KEY_ALL = process.env.PRIMARY_KEY_ALL || "";
const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing the parameter body. Give parameters in the following format.\n {
          "book": "Book Name", 
          "author": "Authos's Name", 
          "isbn": "Book isbn", 
          "book_type": "Book Type (fiction/non-fiction)",
          "price": Book Price, 
          "stock": Stock Capacity, 
          "available": true / false}`,
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  item[PRIMARY_KEY_ALL] = randomBytes(32).toString("hex");
  const params = {
    TableName: TABLE_NAME_ALL,
    Item: item,
  };
  if (
    !item.book ||
    !item.author ||
    !item.isbn ||
    !item.book_type ||
    !item.price ||
    !item.stock ||
    !item.available
  ) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing some parameters in body. Give missing parameters.\n {
          "book": ${item.book || "Missing"}, 
          "author": ${item.author || "Missing"}, 
          "isbn": ${item.isbn || "Missing"}, 
          "book_type": ${item.book_type || "Missing"},
          "price": ${item.price || "Missing"}, 
          "stock": ${item.stock || "Missing"}, 
          "available": ${item.available || "Missing"}
        }`,
    };
  }

  try {
    await db.put(params).promise();
    return {
      statusCode: 201,
      body: `Book with following detail success-fully added to the database.\n {
        "book": ${item.book}, 
        "author": ${item.author}, 
        "isbn": ${item.isbn}, 
        "book_type": ${item.book_type},
        "price": ${item.price}, 
        "stock": ${item.stock}, 
        "available": ${item.available}
      }`,
    };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
