import * as AWS from "aws-sdk";

const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any, context: any): Promise<any> => {
  const params = {
    TableName: TABLE_NAME_ALL,
  };
  try {
    const response = await db.scan(params).promise();

    // In case there is no book in data base
    if (response.Count === 0) {
      return {
        statusCode: 200,
        body: `{ "message": "No Books currently available" }`,
      };
    }

    // When there is limit in the query
    if (
      event.queryStringParameters &&
      event.queryStringParameters.limit &&
      !event.queryStringParameters.type
    ) {
      if (!parseInt(event.queryStringParameters.limit)) {
        return {
          statusCode: 200,
          body: `{ "message": "Enter Limit in numeric form or greater than 0" }`,
        };
      } else {
        if (response.Items) {
          return {
            statusCode: 200,
            body: JSON.stringify(
              response.Items.slice(
                0,
                Math.abs(event.queryStringParameters.limit)
              )
            ),
          };
        }
      }
    }

    // When there is type in query
    if (
      event.queryStringParameters &&
      !event.queryStringParameters.limit &&
      event.queryStringParameters.type
    ) {
      if (
        event.queryStringParameters.type.toLowerCase() !== "fiction" &&
        event.queryStringParameters.type.toLowerCase() !== "non-fiction"
      ) {
        return {
          statusCode: 200,
          body: `{ "message": "Type should be 'fiction' or 'non-fiction'" }`,
        };
      } else {
        if (response.Items) {
          if (
            response.Items.filter(
              (item) =>
                item.type === event.queryStringParameters.type.toLowerCase()
            ).length === 0
          ) {
            return {
              statusCode: 200,
              body: `{ "message": "There is no book of type ${event.queryStringParameters.type.toLowerCase()}" }`,
            };
          }
          return {
            statusCode: 200,
            body: JSON.stringify(
              response.Items.filter(
                (item) =>
                  item.type === event.queryStringParameters.type.toLowerCase()
              )
            ),
          };
        }
      }
    }

    // When there is both limits in the query
    if (
      event.queryStringParameters &&
      event.queryStringParameters.limit &&
      event.queryStringParameters.type
    ) {
      if (
        event.queryStringParameters.type.toLowerCase() !== "fiction" &&
        event.queryStringParameters.type.toLowerCase() !== "non-fiction"
      ) {
        return {
          statusCode: 200,
          body: `{ "message": "Type should be 'fiction' or 'non-fiction'" }`,
        };
      } else {
        if (response.Items) {
          if (
            response.Items.filter(
              (item) =>
                item.type === event.queryStringParameters.type.toLowerCase()
            ).length === 0
          ) {
            return {
              statusCode: 200,
              body: `{ "message": "There is no book of type ${event.queryStringParameters.type.toLowerCase()}" }`,
            };
          } else {
            const results = response.Items.filter(
              (item) =>
                item.type === event.queryStringParameters.type.toLowerCase()
            );
            console.log(results);
            if (!parseInt(event.queryStringParameters.limit)) {
              return {
                statusCode: 200,
                body: `{ "message": "Enter Limit in numeric form or greater than 0" }`,
              };
            } else {
              if (results) {
                return {
                  statusCode: 200,
                  body: JSON.stringify(
                    results.slice(
                      0,
                      Math.abs(event.queryStringParameters.limit)
                    )
                  ),
                };
              }
            }
          }
        }
      }
    }

    // No queries
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
