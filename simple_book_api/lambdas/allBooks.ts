import * as AWS from "aws-sdk";

const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any, context: any): Promise<any> => {
  const params = {
    TableName: TABLE_NAME_ALL,
  };
  try {
    const response = await db.scan(params).promise();

    // When there is limit in the query
    if (
      event.queryStringParameters &&
      event.queryStringParameters.limit &&
      !event.queryStringParameters.type
    ) {
      if (!parseInt(event.queryStringParameters.limit)) {
        return {
          statusCode: 200,
          body: `{ "message": "Enter Limit in numeric form" }`,
        };
      }
      if (parseInt(event.queryStringParameters.limit)) {
        if (!response.Items) {
          return {
            statusCode: 200,
            body: `{ "message": "No Books currently available" }`,
          };
        } else {
          const result = response.Items.slice(
            0,
            Math.abs(event.queryStringParameters.limit)
          );
          return { statusCode: 200, body: JSON.stringify(result) };
        }
      }
    }
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
