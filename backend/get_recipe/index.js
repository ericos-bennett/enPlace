import AWS from 'aws-sdk'

const region = process.env.AWS_REGION
const dynamoDbEndpoint = process.env.LAMBDA_DYNAMODB_ENDPOINT

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*'
  }

  try {
    const { recipeId } = JSON.parse(event.body)
    const params = {
      TableName: 'Recipes',
      KeyConditionExpression: 'Id = :id',
      ExpressionAttributeValues: {
        ':id': recipeId
      }
    }

    const dynamodb = new AWS.DynamoDB.DocumentClient({ region, endpoint: dynamoDbEndpoint })
    const result = await dynamodb.query(params).promise()
    if (result.length == 0) {
      return {
        statusCode: 404,
        headers
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items[0]),
      headers
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers
    }
  }
}
