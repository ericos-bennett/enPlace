import os
import json
import boto3
import jwt

def client_response(status_code, body_json):
    return {
        'statusCode': status_code,
        'body': json.dumps(body_json, default=str),
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

    dynamodb = boto3.resource('dynamodb', endpoint_url=os.getenv('DYNAMODB_ENDPOINT'))
    table = dynamodb.Table('Recipes')
    response = table.query(
        IndexName='UserIdIndex',
        KeyConditionExpression="UserId = :userId",
        ExpressionAttributeValues={
          ":userId": sub,
        },
    )

    items = response.get('Items', [])
    return client_response(200, items)