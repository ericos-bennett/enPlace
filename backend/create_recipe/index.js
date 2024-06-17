import AWS from 'aws-sdk'
import OpenAI from "openai"
import exampleRecipe from './exampleRecipe.json' assert { type: 'json' }

const SecretId = process.env.OPENAI_API_KEY_ID
const region = process.env.AWS_REGION
const secretsManagerEndpoint = process.env.LAMBDA_SECRETSMANAGER_ENDPOINT
const dynamoDbEndpoint = process.env.LAMBDA_DYNAMODB_ENDPOINT

export const handler = async (event) => {
  const userId = 123
  const headers = {
    'Access-Control-Allow-Origin': '*'
  }

  try {
    // Get OpenAI secret and start client
    const secretsManager = new AWS.SecretsManager({ region, endpoint: secretsManagerEndpoint })
    const secretData = await secretsManager.getSecretValue({ SecretId }).promise()
    const apiKey = secretData.SecretString
    const openai = new OpenAI({ apiKey })

    // Get recipe from OpenAI API
    const { recipeUrl } = JSON.parse(event.body)
    const prompt = `Return the recipe from: ${recipeUrl} as a VALID JSON following this format: ${JSON.stringify(exampleRecipe)}. Save numbers as decimals and don't add newlines.`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    })
    console.log(`OpenAI API Usage: ${JSON.stringify(completion.usage)}`)

    const recipeItem = JSON.parse(completion.choices[0].message.content)
    recipeItem.UserId = userId
    recipeItem.Timestamp = new Date().toISOString()
    console.log(recipeItem)

    // // Save to DynamoDB
    const params = {
      TableName: 'Recipes',
      Item: recipeItem
    }
    const dynamodb = new AWS.DynamoDB.DocumentClient({ region, endpoint: dynamoDbEndpoint })
    await dynamodb.put(params).promise()

    // Return response to client
    return {
      statusCode: 201,
      body: recipeItem,
      headers
    }

  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers
    }
  }
}
