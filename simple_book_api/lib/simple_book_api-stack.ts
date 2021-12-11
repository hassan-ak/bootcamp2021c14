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
    // Users Table
    const usersTable = new aws_dynamodb.Table(this, "UsersTable", {
      tableName: "Simple_Book_Api_Users",
      partitionKey: {
        name: "userEmail",
        type: aws_dynamodb.AttributeType.STRING,
      },
    });
    // All Orders Table
    const allOrdersTable = new aws_dynamodb.Table(this, "AllOrdersTable", {
      tableName: "Simple_Book_Api_All_Orders",
      partitionKey: {
        name: "orderID",
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
    // Get one book
    const oneBookFunction = new aws_lambda.Function(this, "oneBookFunction", {
      functionName: "One-Book-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "oneBook.handler",
      memorySize: 1024,
      environment: {
        PRIMARY_KEY_ALL: "bookID",
        TABLE_NAME_ALL: allBooksTable.tableName,
      },
    });
    // User auth
    const userAuthFunction = new aws_lambda.Function(this, "userAuthFunction", {
      functionName: "User-Auth-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "userAuth.handler",
      memorySize: 1024,
      environment: {
        PRIMARY_KEY_USER: "userEmail",
        TABLE_NAME_USER: usersTable.tableName,
      },
    });
    // Place Order
    const placeOrderFunction = new aws_lambda.Function(
      this,
      "placeOrderFunction",
      {
        functionName: "Place-Order-Function-Simple-Book-Api",
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        code: aws_lambda.Code.fromAsset("lambdas"),
        handler: "placeOrder.handler",
        memorySize: 1024,
        environment: {
          TABLE_NAME_USER: usersTable.tableName,
          PRIMARY_KEY_ALL: "bookID",
          TABLE_NAME_ALL: allBooksTable.tableName,
          PRIMARY_KEY_ORDER: "orderID",
          TABLE_NAME_ORDER: allOrdersTable.tableName,
        },
      }
    );
    // All Orders Function
    const allOrdersFunction = new aws_lambda.Function(
      this,
      "allOrdersFunction",
      {
        functionName: "All-Orders-Function-Simple-Book-Api",
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        code: aws_lambda.Code.fromAsset("lambdas"),
        handler: "allOrders.handler",
        memorySize: 1024,
        environment: {
          TABLE_NAME_USER: usersTable.tableName,
          TABLE_NAME_ORDER: allOrdersTable.tableName,
        },
      }
    );
    // Get one Order
    const oneOrderFunction = new aws_lambda.Function(this, "oneOrderFunction", {
      functionName: "One-Order-Function-Simple-Book-Api",
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambdas"),
      handler: "oneOrder.handler",
      memorySize: 1024,
      environment: {
        TABLE_NAME_USER: usersTable.tableName,
        TABLE_NAME_ORDER: allOrdersTable.tableName,
        PRIMARY_KEY_ORDER: "orderID",
      },
    });
    // Delete one Order
    const deleteOneOrderFunction = new aws_lambda.Function(
      this,
      "deleteOneOrderFunction",
      {
        functionName: "Delete-One-Order-Function-Simple-Book-Api",
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        code: aws_lambda.Code.fromAsset("lambdas"),
        handler: "deleteOneOrder.handler",
        memorySize: 1024,
        environment: {
          TABLE_NAME_USER: usersTable.tableName,
          TABLE_NAME_ORDER: allOrdersTable.tableName,
          PRIMARY_KEY_ORDER: "orderID",
        },
      }
    );
    // Delete one Order
    const updateOneOrderFunction = new aws_lambda.Function(
      this,
      "updateOneOrderFunction",
      {
        functionName: "Update-One-Order-Function-Simple-Book-Api",
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        code: aws_lambda.Code.fromAsset("lambdas"),
        handler: "updateOneOrder.handler",
        memorySize: 1024,
        environment: {
          TABLE_NAME_USER: usersTable.tableName,
          TABLE_NAME_ORDER: allOrdersTable.tableName,
          PRIMARY_KEY_ORDER: "orderID",
        },
      }
    );

    // Grant the Lambda function read access to the DynamoDB table
    allBooksTable.grantReadWriteData(addBooksFunction);
    allBooksTable.grantReadWriteData(allBooksFunction);
    allBooksTable.grantReadWriteData(oneBookFunction);
    usersTable.grantReadWriteData(userAuthFunction);
    usersTable.grantReadWriteData(placeOrderFunction);
    allBooksTable.grantReadWriteData(placeOrderFunction);
    allOrdersTable.grantReadWriteData(placeOrderFunction);
    usersTable.grantReadWriteData(allOrdersFunction);
    allOrdersTable.grantReadWriteData(allOrdersFunction);
    usersTable.grantReadWriteData(oneOrderFunction);
    allOrdersTable.grantReadWriteData(oneOrderFunction);
    usersTable.grantReadWriteData(deleteOneOrderFunction);
    allOrdersTable.grantReadWriteData(deleteOneOrderFunction);
    usersTable.grantReadWriteData(updateOneOrderFunction);
    allOrdersTable.grantReadWriteData(updateOneOrderFunction);

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
    // GEt all books
    const allBooksFunctionIntegration = new aws_apigateway.LambdaIntegration(
      allBooksFunction
    );
    // Get One Book
    const oneBookFunctionIntegration = new aws_apigateway.LambdaIntegration(
      oneBookFunction
    );
    // User Auth
    const userAuthFunctionIntegration = new aws_apigateway.LambdaIntegration(
      userAuthFunction
    );
    // Place Order
    const placeOrderFunctionIntegration = new aws_apigateway.LambdaIntegration(
      placeOrderFunction
    );
    // all Order
    const allOrdersFunctionIntegration = new aws_apigateway.LambdaIntegration(
      allOrdersFunction
    );
    // One Order
    const oneOrderFunctionIntegration = new aws_apigateway.LambdaIntegration(
      oneOrderFunction
    );
    // Delete Order
    const deleteOneOrderFunctionIntegration =
      new aws_apigateway.LambdaIntegration(deleteOneOrderFunction);
    // Update Order
    const updateOneOrderFunctionIntegration =
      new aws_apigateway.LambdaIntegration(updateOneOrderFunction);

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
    // for listing single book
    const oneBook = allBooks.addResource("{id}");
    oneBook.addMethod("GET", oneBookFunctionIntegration);
    addCorsOptions(oneBook);
    // User Auth
    const userAuth = api.root.addResource("api-clients");
    userAuth.addMethod("POST", userAuthFunctionIntegration);
    addCorsOptions(userAuth);
    // Place Order - all Orders
    const placeOrder = api.root.addResource("orders");
    placeOrder.addMethod("POST", placeOrderFunctionIntegration);
    placeOrder.addMethod("GET", allOrdersFunctionIntegration);
    placeOrder.addMethod("DELETE", deleteOneOrderFunctionIntegration);
    placeOrder.addMethod("PATCH", updateOneOrderFunctionIntegration);
    addCorsOptions(placeOrder);
    const oneOrder = placeOrder.addResource("{id}");
    oneOrder.addMethod("GET", oneOrderFunctionIntegration);
    oneOrder.addMethod("DELETE", deleteOneOrderFunctionIntegration);
    oneOrder.addMethod("PATCH", updateOneOrderFunctionIntegration);
    addCorsOptions(oneOrder);
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
