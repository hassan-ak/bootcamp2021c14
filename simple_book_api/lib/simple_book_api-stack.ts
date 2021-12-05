import { Stack, StackProps, aws_lambda, aws_apigateway } from "aws-cdk-lib";
import { Construct } from "constructs";

export class SimpleBookApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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

    // Lambda function integrations for the api gateway
    const welcomeFunctionIntegration = new aws_apigateway.LambdaIntegration(
      welcomeFunction
    );
    const statusFunctionIntegration = new aws_apigateway.LambdaIntegration(
      statusFunction
    );

    // New Api gateway for all the functions
    const api = new aws_apigateway.RestApi(this, "simpleBookApi", {
      restApiName: "Simple Book Api",
    });

    // add root resources and methods to the api
    api.root.addMethod("GET", welcomeFunctionIntegration);

    const status = api.root.addResource("status");
    status.addMethod("GET", statusFunctionIntegration);
    addCorsOptions(status);
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
