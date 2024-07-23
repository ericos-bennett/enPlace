import os
import sys
import traceback
import logging
import json
import uuid
import re
import boto3
import jwt
from openai import OpenAI
from recipe_scrapers import scrape_me
from datetime import datetime
from decimal import Decimal
from urllib.parse import urlparse

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def client_response(status_code, body_json):
    response = {
        'statusCode': status_code,
        'body': json.dumps(body_json, default=str),
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': True,
        },
    }
    logger.info(f'Response: {response}')
    return response

def log_exception():
    exception_type, exception_value, exception_traceback = sys.exc_info()
    error_message = json.dumps({
        "errorType": exception_type.__name__,
        "errorMessage": str(exception_value),
        "stackTrace": traceback.format_exception(exception_type, exception_value, exception_traceback)
    })
    logger.error(error_message)

def handler(event, context):
    try:
        logger.info(f"Event: {event}")
        auth_token = event['headers']['Authorization']
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        sub = decoded_token['sub']

        body = json.loads(event['body'])
        recipe_url = body['recipeUrl']

        # Validate URL input
        result = urlparse(recipe_url)
        if not all([result.scheme, result.netloc]):
            return client_response(400, {'errorMessage': "Not a valid URL"})
        
        # Get date from website
        scraper = scrape_me(recipe_url, wild_mode=True)
        recipe_name = scraper.title()
        recipe_description = scraper.description()
        recipe_servings = re.sub(r'\D', '', scraper.yields())
        recipe_total_time = scraper.total_time()
        recipe_image_url = scraper.image()
        ingredients = scraper.ingredients()
        instructions = scraper.instructions_list()
        logger.info(f"Recipe data retrieved from: {recipe_url}")

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

        # Use OpenAI to format recipe steps
        completion = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content":  f"You are a recipe formatter which matches a recipe's ingredients with their relevant steps and returns only a valid JSON matching exactly this format: {json.dumps(example_recipe)}"},
                {"role": "user", "content": f"Only mention each ingredient once, when it is first used in the recipe"},
                {"role": "user", "content": f"Here are the ingredients: {ingredients}"},
                {"role": "user", "content": f"Here are the instructions: {instructions}"}
            ],
            response_format={ "type": "json_object" },
            temperature=0
        )
        openai_response = completion.choices[0].message.content
        logger.info(f"OpenAI Response: {json.dumps(openai_response, default=str)}")
        logger.info(f"OpenAI API Usage: {completion.usage}")

        # Build the recipe object
        recipe = json.loads(openai_response, parse_float=Decimal)
        recipe['Id'] = str(uuid.uuid4())
        recipe['UserId'] = sub
        recipe['CreatedAt'] = datetime.utcnow().isoformat()
        recipe['SourceUrl'] = recipe_url
        recipe['name'] = recipe_name
        recipe['description'] = recipe_description
        recipe['servings'] = recipe_servings
        recipe['totalTime'] = recipe_total_time
        recipe['imageUrl'] = recipe_image_url

        # Save to DynamoDB
        table.put_item(Item=recipe)
        logger.info(f"Recipe saved with ID: {recipe['Id']}")

        return client_response(201, {'recipeId': recipe['Id']})
    except:
        log_exception()
        return client_response(500, {'errorMessage':"Internal Server Error"})