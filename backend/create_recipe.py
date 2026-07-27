import os
import re
import json
import uuid
import datetime
from decimal import Decimal
from typing import Optional
from urllib.parse import urlparse

import boto3
import jwt
from openai import OpenAI
from pydantic import BaseModel
from recipe_scrapers import scrape_me

from common import client_response, log_exception, logger, table

_openai_client = None


def get_openai_client():
    # Fetching the secret and constructing the client is cached at module
    # scope so warm invocations skip the Secrets Manager round trip.
    global _openai_client
    if _openai_client is None:
        secrets_manager = boto3.client(
            "secretsmanager", endpoint_url=os.getenv("SECRETSMANAGER_ENDPOINT")
        )
        secret_data = secrets_manager.get_secret_value(
            SecretId=os.getenv("OPENAI_API_KEY_ID")
        )
        _openai_client = OpenAI(api_key=secret_data["SecretString"])
    return _openai_client


def replace_units(text):
    replacements = {
        "tablespoons": "Tbsp",
        "tablespoon": "Tbsp",
        "teaspoons": "tsp",
        "teaspoon": "tsp",
        "pound": "lb",
        "pounds": "lbs",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


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


def create_recipe(event, context):
    try:
        auth_token = event["headers"]["Authorization"]
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        user_id = decoded_token["sub"]
        body = json.loads(event["body"])
        recipe_url = body["recipeUrl"]
        logger.info(
            f"Event received with user_id: {user_id} and recipe_url: {recipe_url}"
        )

        # Validate URL input
        result = urlparse(recipe_url)
        if not all([result.scheme, result.netloc]):
            return client_response(400, {"errorMessage": "Not a valid URL"})

        # Check if URL already exists in DB
        response = table.query(
            IndexName="UserIdIndex",
            KeyConditionExpression="UserId = :userId AND SourceUrl = :sourceUrl",
            ExpressionAttributeValues={
                ":userId": user_id,
                ":sourceUrl": recipe_url,
            },
        )
        items = response.get("Items", [])
        if items:
            existing_recipe = items[0]
            existing_recipe_id = existing_recipe["Id"]
            # If the recipe has been soft deleted, remove the deletion flag
            if "DeletedAt" in existing_recipe:
                table.update_item(
                    Key={"Id": existing_recipe_id}, UpdateExpression="REMOVE DeletedAt"
                )
            return client_response(409, {"recipeId": existing_recipe_id})

        # Get data from website
        scraper = scrape_me(recipe_url, wild_mode=True)
        recipe_name = scraper.title()
        recipe_description = scraper.description()
        recipe_servings = re.sub(r"\D", "", scraper.yields())
        recipe_total_time = scraper.total_time()
        recipe_image_url = scraper.image()
        ingredients = [
            replace_units(ingredient) for ingredient in scraper.ingredients()
        ]
        instructions = [
            replace_units(instruction) for instruction in scraper.instructions_list()
        ]
        logger.info(f"Recipe data retrieved from: {recipe_url}")

        # Use OpenAI to format recipe steps
        openai_client = get_openai_client()
        response = openai_client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a recipe formatter which matches a recipe's ingredients with their relevant steps. Only mention each ingredient once, when it is first used in the recipe. If an optional field is empty, return the non-string null instead of 'null' or 'none'.",
                },
                {"role": "user", "content": f"Ingredients: {ingredients}"},
                {"role": "user", "content": f"Instructions: {instructions}"},
            ],
            temperature=0,
            response_format=RecipeSteps,
        )
        recipe_steps = response.choices[0].message.content
        logger.info(f"OpenAI Response: {json.dumps(recipe_steps, default=str)}")
        logger.info(f"OpenAI API Usage: {response.usage}")

        # Build the recipe object
        recipe = json.loads(recipe_steps, parse_float=Decimal)
        recipe["Id"] = str(uuid.uuid4())
        recipe["UserId"] = user_id
        recipe["CreatedAt"] = datetime.datetime.utcnow().isoformat()
        recipe["SourceUrl"] = recipe_url
        recipe["name"] = recipe_name
        recipe["description"] = recipe_description
        recipe["servings"] = recipe_servings
        recipe["totalTime"] = recipe_total_time
        recipe["imageUrl"] = recipe_image_url

        # Save to DynamoDB
        table.put_item(Item=recipe)
        logger.info(f"Recipe saved with ID: {recipe['Id']}")

        return client_response(201, {"recipeId": recipe["Id"]})
    except:
        log_exception()
        return client_response(500, {"errorMessage": "Internal Server Error"})
