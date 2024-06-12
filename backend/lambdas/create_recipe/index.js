const testJson = {
  'UserId': 123,
  'Timestamp': 1623064800,
  "name": "Sausage Pasta",
  "description": "A family favorite full of healthy ingredients",
  "author": "Eric Bennett",
  "servings": 4,
  "prepTime": 15,
  "cookingTime": 45,
  "steps": [
    {
      "ingredients": [
        {
          "ingredient": "Olive Oil",
          "preparation": null,
          "amount": 2,
          "units": "Tbsp"
        }
      ],
      "instructions": "Heat oil in a large pan"
    },
    {
      "ingredients": [
        {
          "ingredient": "Tomatoes",
          "preparation": "Diced",
          "amount": 4,
          "units": null
        },
        {
          "ingredient": "Basil",
          "preparation": "Sliced",
          "amount": 10,
          "units": "Leaves"
        }
      ],
      "instructions": "Combine tomatoes and basil"
    }
  ]
}


const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localstack:4566',
  region: 'us-east-1'
});


exports.handler = async (event) => {
  const params = {
    TableName: 'Recipes',
    Item: testJson
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify('Item added to Recipes table!'),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
