import os
import sys
import traceback
import logging
import json
import jwt
import boto3
from boto3.dynamodb.conditions import Attr

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
        auth_token = event['headers']['Authorization']
        decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
        user_id = decoded_token['sub']
        logger.info(f"Event received with user_id: {user_id}")


        dynamodb = boto3.resource('dynamodb', endpoint_url=os.getenv('DYNAMODB_ENDPOINT'))
        table = dynamodb.Table('Recipes')
        response = table.query(
            IndexName='UserIdIndex',
            KeyConditionExpression="UserId = :userId",
            FilterExpression=Attr('DeletedAt').not_exists(),
            ExpressionAttributeValues={
                ':userId': user_id,
            }
        )

        items = response.get('Items', [])
        return client_response(200, items)
    except Exception:
        log_exception()
        return client_response(500, {'errorMessage':"Internal Server Error"})