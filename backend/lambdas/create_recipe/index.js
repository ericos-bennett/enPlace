const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localstack:4566',
  region: 'us-east-1'
});

exports.handler = async (event) => {
  const params = {
    TableName: 'Recipes',
    Item: {
      'UserId': 123,
      'Timestamp': 1623064800,
      'Author': 'Lolo'
    }
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify('Item added to Recipes table!')
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
