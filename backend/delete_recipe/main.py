import os
import sys
import traceback
import logging
import json
import boto3
import jwt
from datetime import datetime

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
        auth_token = event['headers']['Authorization']
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        user_id = decoded_token['sub']

        dynamodb = boto3.resource('dynamodb', endpoint_url=os.getenv('DYNAMODB_ENDPOINT'))
        table = dynamodb.Table('Recipes')
        response = table.get_item(
            Key={'Id': recipe_id}
        )

        if 'Item' not in response:
            return client_response(404, {'errorMessage': 'Recipe not found'})
        
        item = response['Item']

        if item['UserId'] != user_id:
            return client_response(403, {'errorMessage': 'Forbidden'})
        
        if 'DeletedAt' in item:
          return client_response(200, {'message': 'Recipe already deleted'})
        
        table.update_item(
            Key={'Id': recipe_id},
            UpdateExpression='SET DeletedAt = :deletedAt',
            ExpressionAttributeValues={
                ':deletedAt': datetime.utcnow().isoformat()
            }
        )

        return client_response(200, {'message': 'Recipe deleted successfully'})
    except:
        log_exception()
        return client_response(500, {'errorMessage':"Internal Server Error"})