import os
import sys
import traceback
import logging
import json
import uuid
import re
import datetime
import boto3
import jwt
from recipe_scrapers import scrape_me
from openai import OpenAI
from pydantic import BaseModel
from typing import Optional
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
            'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': True,
        },
    }
    logger.info(f'Returning {status_code}')
    return response

def log_exception():
    exception_type, exception_value, exception_traceback = sys.exc_info()
    error_message = json.dumps({
        "errorType": exception_type.__name__,
        "errorMessage": str(exception_value),
        "stackTrace": traceback.format_exception(exception_type, exception_value, exception_traceback)
    })
    logger.error(error_message)

# Define OpenAI output schema
class Ingredient(BaseModel):
    ingredient: str
    amount: Optional[str]
    units: Optional[str]
    preparation: Optional[str]

class Step(BaseModel):
    instructions: str
    ingredients: Optional[list[Ingredient]]

class RecipeSteps(BaseModel):
    steps: list[Step]

def handler(event, context):
    try:
        auth_token = event['headers']['Authorization']
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        user_id = decoded_token['sub']
        body = json.loads(event['body'])
        recipe_url = body['recipeUrl']
        logger.info(f"Event received with user_id: {user_id} and recipe_url: {recipe_url}")

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
                ':userId': user_id,
                ':sourceUrl': recipe_url,
            }
        )
        items = response.get('Items', [])
        if items:
            existing_recipe = items[0]
            existing_recipe_id = existing_recipe['Id']
            # If the recipe has been soft deleted, remove the deletion flag
            if 'DeletedAt' in existing_recipe:
                table.update_item(
                    Key={'Id': existing_recipe_id},
                    UpdateExpression='REMOVE DeletedAt'
                )
            return client_response(409, {'recipeId': existing_recipe_id})
        
        # Get data from website
        scraper = scrape_me(recipe_url, wild_mode=True)
        recipe_name = scraper.title()
        recipe_description = scraper.description()
        recipe_servings = re.sub(r'\D', '', scraper.yields())
        recipe_total_time = scraper.total_time()
        recipe_image_url = scraper.image()
        ingredients = scraper.ingredients()
        instructions = scraper.instructions_list()
        logger.info(f"Recipe data retrieved from: {recipe_url}")
        logger.info(f"Ingredients: {ingredients}")
        logger.info(f"Instructions: {instructions}")

        # Get OpenAI secret and start client
        secrets_manager = boto3.client('secretsmanager', endpoint_url=os.getenv('SECRETSMANAGER_ENDPOINT'))
        secret_data = secrets_manager.get_secret_value(SecretId=os.getenv('OPENAI_API_KEY_ID'))
        openai_client = OpenAI(api_key=secret_data['SecretString'])

        # Use OpenAI to format recipe steps
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content":  f"You are a recipe formatter which matches a recipe's ingredients with their relevant steps. Only mention each ingredient once, when it is first used in the recipe."},
                {"role": "user", "content": f"Here are the ingredients: {ingredients}"},
                {"role": "user", "content": f"Here are the instructions: {instructions}"}
            ],
            temperature=0,
            response_format=RecipeSteps,
        )
        recipe_steps = response.choices[0].message.content
        logger.info(f"OpenAI Response: {json.dumps(recipe_steps, default=str)}")
        logger.info(f"OpenAI API Usage: {response.usage}")

        # Build the recipe object
        recipe = json.loads(recipe_steps, parse_float=Decimal)
        recipe['Id'] = str(uuid.uuid4())
        recipe['UserId'] = user_id
        recipe['CreatedAt'] = datetime.datetime.utcnow().isoformat()
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