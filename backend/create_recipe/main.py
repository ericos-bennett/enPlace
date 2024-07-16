import os
import json
import boto3
import uuid
import jwt
from openai import OpenAI
from datetime import datetime
from urllib.parse import urlparse

def client_response(status_code, body_json):
    return {
        'statusCode': status_code,
        'body': json.dumps(body_json),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': True,
        },
    }

def handler(event, context):
    print(event)
    auth_token = event['headers']['Authorization']
    decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
    sub = decoded_token['sub']

    body = json.loads(event['body'])
    recipe_url = body['recipeUrl']

    # Validate URL input
    result = urlparse(recipe_url)
    if not all([result.scheme, result.netloc]):
        return client_response(400, {'errorMessage': "Not a valid URL"})

    # Check if URL already exists in DB
    dynamodb = boto3.resource('dynamodb', endpoint_url=os.getenv('DYNAMODB_ENDPOINT'))
    table = dynamodb.Table('Recipes')
    response = table.query(
        IndexName='UserIdIndex',
        KeyConditionExpression='UserId = :userId AND SourceUrl = :sourceUrl',
        ExpressionAttributeValues={
            ':userId': sub,
            ':sourceUrl': recipe_url,
        }
    )
    items = response.get('Items', [])
    if items:
        return client_response(409, {'recipeId': items[0]['Id']})

    # Get OpenAI secret and start client
    secrets_manager = boto3.client('secretsmanager', endpoint_url=os.getenv('SECRETSMANAGER_ENDPOINT'))
    secret_data = secrets_manager.get_secret_value(SecretId=os.getenv('OPENAI_API_KEY_ID'))
    openai_client = OpenAI(api_key=secret_data['SecretString'])

    # Load example recipe JSON
    with open('exampleRecipe.json', 'r') as f:
        example_recipe = json.load(f)
    prompt_instructions = [
        f"Return the exact recipe from: {recipe_url} as a VALID JSON following this format: {json.dumps(example_recipe)}",
        "Create a separate step for each instruction in the recipe and do not duplicate ingredients.",
    ]

    completion = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": " ".join(prompt_instructions)}],
        response_format={ "type": "json_object" },
        temperature=0
    )
    print(f"OpenAI API Usage: {completion.usage}")
    openai_response = completion.choices[0].message.content
    print(openai_response)

    # Add extra properties to the recipe
    recipe_item = json.loads(openai_response)
    recipe_item['Id'] = str(uuid.uuid4())
    recipe_item['UserId'] = sub
    recipe_item['SourceUrl'] = recipe_url
    recipe_item['CreatedAt'] = datetime.utcnow().isoformat()

    # Save to DynamoDB
    print(f"Saving recipe with ID: {recipe_item['Id']}")
    table.put_item(Item=recipe_item)

    return client_response(201, {'recipeId': recipe_item['Id']})