import AWS from "aws-sdk";

const clientResponse = (statusCode, body) => {
  return {
    statusCode,
    body,
    headers: { "Access-Control-Allow-Origin": "*" },
  };
};

export const handler = async (event) => {
  try {
    const { recipeId } = event.pathParameters;
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName: "Recipes",
      KeyConditionExpression: "Id = :id",
      ExpressionAttributeValues: {
        ":id": recipeId,
      },
    };

    const { Items } = await dynamodb.query(params).promise();
    if (Items.length == 0) {
      return clientResponse(404, {
        errorMessage: "No recipe with the specified ID",
      });
    }
    return clientResponse(200, JSON.stringify(Items[0]));
  } catch (error) {
    console.log(error);
    return clientResponse(500, { errorMessage: error.message });
  }
};
