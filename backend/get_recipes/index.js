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
  const userId = 123;
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const params = {
      TableName: "Recipes",
      IndexName: "UserIdIndex",
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region,
      endpoint: dynamoDbEndpoint,
    });
    const result = await dynamodb.query(params).promise();

    // Sort items by descending creation time
    result.Items.sort((a, b) => {
      return new Date(b.CreatedAt) - new Date(a.CreatedAt);
    });
    return clientResponse(200, JSON.stringify(result.Items));
  } catch (error) {
    console.log(error);
    return clientResponse(500, { errorMessage: error.message });
  }
};
