import AWS from "aws-sdk";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import exampleRecipe from "./exampleRecipe.json" assert { type: "json" };

const SecretId = process.env.OPENAI_API_KEY_ID;
const region = process.env.AWS_REGION;
const secretsManagerEndpoint = process.env.LAMBDA_SECRETSMANAGER_ENDPOINT;
const dynamoDbEndpoint = process.env.LAMBDA_DYNAMODB_ENDPOINT;

export const handler = async (event) => {
  const userId = 123;
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Validate URL input
    const { recipeUrl } = JSON.parse(event.body);
    new URL(recipeUrl); // This will throw a ERR_INVALID_URL error if the input string is invalid
    const urlPing = await fetch(recipeUrl); // This will throw a ENOTFOUND error if the DNS lookup fails
    if (!urlPing.ok) {
      throw new Error(`URL Validation: invalid response from ${recipeUrl}`);
    }

    // Get OpenAI secret and start client
    const secretsManager = new AWS.SecretsManager({
      region,
      endpoint: secretsManagerEndpoint,
    });
    const secretData = await secretsManager
      .getSecretValue({ SecretId })
      .promise();
    const apiKey = secretData.SecretString;
    const openai = new OpenAI({ apiKey });

    // Get the recipe object from the OpenAI API
    const prompt = `Return the recipe from: ${recipeUrl} as a VALID JSON following this format: ${JSON.stringify(
      exampleRecipe
    )}. Save numbers as decimals and don't add newlines.`;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    console.log(`OpenAI API Usage: ${JSON.stringify(completion.usage)}`);
    const openAiResponse = completion.choices[0].message.content;
    console.log(openAiResponse);
    const recipeItem = JSON.parse(openAiResponse);

    // Add extra properties to the recipe
    recipeItem.Id = uuidv4();
    recipeItem.CreatedAt = new Date().toISOString();
    recipeItem.UserId = userId;

    // // Save to DynamoDB
    console.log(`Saving recipe with ID: ${recipeItem.Id}`);
    const params = {
      TableName: "Recipes",
      Item: recipeItem,
    };
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region,
      endpoint: dynamoDbEndpoint,
    });
    await dynamodb.put(params).promise();

    // Return response to client
    return {
      statusCode: 201,
      body: { recipeId: recipeItem.Id },
      headers,
    };
  } catch (error) {
    if (
      error.code == "ERR_INVALID_URL" ||
      error.code == "ENOTFOUND" ||
      error.message.includes("URL Validation")
    ) {
      return {
        statusCode: 400,
        body: "Invalid recipe URL",
        headers,
      };
    }
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers,
    };
  }
};
