import jwt
from boto3.dynamodb.conditions import Attr
import datetime

from common import client_response, log_exception, logger, table


def get_recipe(event, context):
    try:
        recipe_id = event["pathParameters"]["recipeId"]
        logger.info(f"Event received with recipe_id: {recipe_id}")

        response = table.get_item(Key={"Id": recipe_id})

        if "Item" not in response:
            return client_response(404, {"errorMessage": "Recipe not found"})

        return client_response(200, response["Item"])
    except:
        log_exception()
        return client_response(500, {"errorMessage": "Internal Server Error"})


def get_recipes(event, context):
    try:
        auth_token = event["headers"]["Authorization"]
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        user_id = decoded_token["sub"]
        logger.info(f"Event received with user_id: {user_id}")

        response = table.query(
            IndexName="UserIdIndex",
            KeyConditionExpression="UserId = :userId",
            FilterExpression=Attr("DeletedAt").not_exists(),
            ExpressionAttributeValues={
                ":userId": user_id,
            },
        )

        items = response.get("Items", [])
        return client_response(200, items)
    except Exception:
        log_exception()
        return client_response(500, {"errorMessage": "Internal Server Error"})


def delete_recipe(event, context):
    try:
        auth_token = event["headers"]["Authorization"]
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        user_id = decoded_token["sub"]
        recipe_id = event["pathParameters"]["recipeId"]
        logger.info(
            f"Event received with user_id: {user_id} and recipe_id: {recipe_id}"
        )

        try:
            # Single round trip on the common (successful) path.
            table.update_item(
                Key={"Id": recipe_id},
                UpdateExpression="SET DeletedAt = :deletedAt",
                ConditionExpression=(
                    "attribute_exists(Id) AND UserId = :userId "
                    "AND attribute_not_exists(DeletedAt)"
                ),
                ExpressionAttributeValues={
                    ":deletedAt": datetime.datetime.utcnow().isoformat(),
                    ":userId": user_id,
                },
            )
            return client_response(200, {"message": "Recipe deleted successfully"})
        except table.meta.client.exceptions.ConditionalCheckFailedException:
            # Fall back to a read only to determine which specific error to
            # return; this only runs on the non-happy path.
            response = table.get_item(Key={"Id": recipe_id})

            if "Item" not in response:
                return client_response(404, {"errorMessage": "Recipe not found"})

            item = response["Item"]

            if item["UserId"] != user_id:
                return client_response(403, {"errorMessage": "Forbidden"})

            return client_response(200, {"message": "Recipe already deleted"})
    except:
        log_exception()
        return client_response(500, {"errorMessage": "Internal Server Error"})


# Routes by (HTTP method, API Gateway resource path template)
ROUTES = {
    ("GET", "/recipes"): get_recipes,
    ("GET", "/recipes/{recipeId}"): get_recipe,
    ("DELETE", "/recipes/{recipeId}"): delete_recipe,
}


def handler(event, context):
    http_method = event.get("httpMethod")
    resource = event.get("resource")

    if (http_method, resource) == ("POST", "/recipes"):
        # Deferred so cold starts serving the other routes never pay for
        # create_recipe's heavy dependencies (openai, recipe_scrapers, pydantic).
        from create_recipe import create_recipe

        return create_recipe(event, context)

    route = ROUTES.get((http_method, resource))

    if route is None:
        logger.error(f"No route found for {http_method} {resource}")
        return client_response(404, {"errorMessage": "Not Found"})

    return route(event, context)
