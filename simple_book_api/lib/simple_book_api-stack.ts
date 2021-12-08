import {
  Stack,
  StackProps,
  aws_lambda,
  aws_apigateway,
  aws_dynamodb,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class SimpleBookApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    // All Books Table
    const allBooksTable = new aws_dynamodb.Table(this, "AllBooksTable", {
      tableName: "Simple_Book_Api_All_Books",
      partitionKey: {
        name: "bookID",
        type: aws_dynamodb.AttributeType.STRING,
      },
    });

    // Lambda Functions
    // Welcome Function
    const welcomeFunction = new aws_lambda.Function(this, "welcomeFunction", {
      functionName: "Welcome-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "welcome.handler",
      memorySize: 1024,
    });
    // Status Function
    const statusFunction = new aws_lambda.Function(this, "statusFunction", {
      functionName: "Status-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "status.handler",
      memorySize: 1024,
    });
    // Add new Books Function
    const addBooksFunction = new aws_lambda.Function(this, "addBooksFunction", {
      functionName: "Add-Books-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "addBooks.handler",
      memorySize: 1024,
      environment: {
        PRIMARY_KEY_ALL: "bookID",
        TABLE_NAME_ALL: allBooksTable.tableName,
      },
    });
    // List all books
    const allBooksFunction = new aws_lambda.Function(this, "allBooksFunction", {
      functionName: "All-Books-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "allBooks.handler",
      memorySize: 1024,
      environment: {
        TABLE_NAME_ALL: allBooksTable.tableName,
      },
    });

    // Grant the Lambda function read access to the DynamoDB table
    allBooksTable.grantReadWriteData(addBooksFunction);
    allBooksTable.grantReadWriteData(allBooksFunction);

    // Lambda function integrations for the api gateway
    // Welcome message
    const welcomeFunctionIntegration = new aws_apigateway.LambdaIntegration(
      welcomeFunction
    );
    // Status of APi
    const statusFunctionIntegration = new aws_apigateway.LambdaIntegration(
      statusFunction
    );
    // Add New Books
    const addBooksFunctionIntegration = new aws_apigateway.LambdaIntegration(
      addBooksFunction
    );
    // Add New Books
    const allBooksFunctionIntegration = new aws_apigateway.LambdaIntegration(
      allBooksFunction
    );

    // API Gateway
    // New Api gateway for all the functions
    const api = new aws_apigateway.RestApi(this, "simpleBookApi", {
      restApiName: "Simple Book Api",
    });

    // add root resources and methods to the api
    // for base root ("/")
    api.root.addMethod("GET", welcomeFunctionIntegration);
    // for status ("/status")
    const status = api.root.addResource("status");
    status.addMethod("GET", statusFunctionIntegration);
    addCorsOptions(status);
    // for adding new book(/newbook)
    const addNewBook = api.root.addResource("newbook");
    addNewBook.addMethod("POST", addBooksFunctionIntegration);
    addCorsOptions(addNewBook);
    // for listing all book(/books)
    const allBooks = api.root.addResource("books");
    allBooks.addMethod("GET", allBooksFunctionIntegration, {
      requestParameters: {
        "method.request.querystring.book_type": false,
        "method.request.querystring.limit": false,
      },
    });
    addCorsOptions(allBooks);
  }
}

// Function for security purposes
export function addCorsOptions(apiResource: aws_apigateway.IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new aws_apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: aws_apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
