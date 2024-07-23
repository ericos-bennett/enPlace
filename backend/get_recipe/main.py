import os
import sys
import traceback
import logging
import json
import boto3

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
        recipe_id = event['pathParameters']['recipeId']

        dynamodb = boto3.resource('dynamodb', endpoint_url=os.getenv('DYNAMODB_ENDPOINT'))
        table = dynamodb.Table('Recipes')
        response = table.query(
            KeyConditionExpression="Id = :id",
            ExpressionAttributeValues={
            ":id": recipe_id,
            },
        )
        items = response.get('Items', [])
        if not items:
            return client_response(404, {'errorMessage': "No recipe with the specified ID" })

        return client_response(200, items[0])
    except:
        log_exception()
        return client_response(500, {'errorMessage':"Internal Server Error"})