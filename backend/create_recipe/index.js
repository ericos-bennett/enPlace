import AWS from "aws-sdk";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import exampleRecipe from "./exampleRecipe.json" assert { type: "json" };

const SecretId = process.env.OPENAI_API_KEY_ID;
const region = process.env.AWS_REGION;
const secretsManagerEndpoint = process.env.LAMBDA_SECRETSMANAGER_ENDPOINT;
const dynamoDbEndpoint = process.env.LAMBDA_DYNAMODB_ENDPOINT;

const clientResponse = (statusCode, body) => {
  return {
    statusCode,
    body,
    headers: { "Access-Control-Allow-Origin": "*" },
  };
};

export const handler = async (event) => {
  try {
    const userId = 123;
    const dynamodb = new AWS.DynamoDB.DocumentClient({
      region,
      endpoint: dynamoDbEndpoint,
    });
    const { recipeUrl } = JSON.parse(event.body);
    // Validate URL input
    try {
      new URL(recipeUrl); // This will throw a ERR_INVALID_URL error if the input string is invalid
      const urlPing = await fetch(recipeUrl); // This will throw a ENOTFOUND error if the DNS lookup fails
      if (!urlPing.ok) {
        throw new Error(`URL Validation: invalid response from ${recipeUrl}`);
      }
    } catch (error) {
      return clientResponse(400, "Invalid recipe URL");
    }

    // Check if URL already exists in DB
    const checkSourceUrlParams = {
      TableName: "Recipes",
      IndexName: "UserIdIndex",
      KeyConditionExpression: "UserId = :userId AND SourceUrl = :sourceUrl",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":sourceUrl": recipeUrl,
      },
    };
    const { Items } = await dynamodb.query(checkSourceUrlParams).promise();
    if (Items.length > 0) {
      return clientResponse(409, { recipeId: Items[0].Id });
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
    )}. Don't add newlines. Save all amounts as decimals. Create a separate step for each instruction in the recipe and do not duplicate ingredients.`;
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
    recipeItem.UserId = userId;
    recipeItem.SourceUrl = recipeUrl;
    recipeItem.CreatedAt = new Date().toISOString();

    // // Save to DynamoDB
    console.log(`Saving recipe with ID: ${recipeItem.Id}`);
    const saveRecipeParams = {
      TableName: "Recipes",
      Item: recipeItem,
    };
    await dynamodb.put(saveRecipeParams).promise();

    return clientResponse(201, { recipeId: recipeItem.Id });
  } catch (error) {
    console.log(error);
    return clientResponse(500, JSON.stringify(error));
  }
};
