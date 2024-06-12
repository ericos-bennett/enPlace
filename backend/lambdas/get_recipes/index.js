const AWS = require('aws-sdk');


exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localstack:4566',
    region: 'us-east-1'
  });

  headers = {
    'Access-Control-Allow-Origin': '*'
  }

  try {
    const userId = 123;
    const params = {
      TableName: 'Recipes',
      KeyConditionExpression: 'UserId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    const result = await dynamodb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
      headers
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers
    };
  }
};
