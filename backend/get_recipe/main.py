import os
import json
import boto3

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