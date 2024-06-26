import AWS from "aws-sdk";

const region = process.env.AWS_REGION;
const dynamoDbEndpoint = process.env.LAMBDA_DYNAMODB_ENDPOINT;

const clientResponse = (statusCode, body) => {
  return {
    statusCode,
    body,
    headers: { "Access-Control-Allow-Origin": "*" },
  };
};

export const handler = async (event) => {
  try {
    const userId = 123;
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region,
      endpoint: dynamoDbEndpoint,
    });

    const params = {
      TableName: "Recipes",
      IndexName: "UserIdIndex",
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const { Items } = await dynamodb.query(params).promise();
    return clientResponse(200, JSON.stringify(Items));
  } catch (error) {
    console.log(error);
    return clientResponse(500, { errorMessage: error.message });
  }
};
