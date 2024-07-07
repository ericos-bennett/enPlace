import AWS from "aws-sdk";

const endpoint =
  process.env.NODE_ENV === "production" ? undefined : "http://localstack:4566";
const clientResponse = (statusCode, body) => {
  return {
    statusCode,
    body,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

export const handler = async (event) => {
  try {
    const userId = 123;
    const dynamodb = new AWS.DynamoDB.DocumentClient({ endpoint });

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
