import * as AWS from "aws-sdk";

const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any, context: any): Promise<any> => {
  const params = {
    TableName: TABLE_NAME_ALL,
  };
  try {
    const response = await db.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
