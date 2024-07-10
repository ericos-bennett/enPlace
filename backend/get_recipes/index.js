import AWS from "aws-sdk";
import { jwtDecode } from "jwt-decode";

const clientResponse = (statusCode, bodyJson) => {
  return {
    statusCode,
    body: JSON.stringify(bodyJson),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Credentials": true,
    },
  };
};

export const handler = async (event) => {
  try {
    console.log({ event });
    const authToken = event.headers.Authorization;
    const { sub } = jwtDecode(authToken);

    const dynamodb = new AWS.DynamoDB.DocumentClient({
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });

    const params = {
      TableName: "Recipes",
      IndexName: "UserIdIndex",
      KeyConditionExpression: "UserId = :userId",
      ExpressionAttributeValues: {
        ":userId": sub,
      },
    };

    const { Items } = await dynamodb.query(params).promise();
    return clientResponse(200, Items);
  } catch (error) {
    console.log(error);
    return clientResponse(500, { errorMessage: "Internal server error" });
  }
};
