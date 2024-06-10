const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localstack:4566',
  region: 'us-east-1'
});

exports.handler = async (event) => {
  const userId = 123;

  const params = {
    TableName: 'Recipes',
    KeyConditionExpression: 'UserId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
