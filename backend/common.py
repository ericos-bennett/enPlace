import os
import sys
import traceback
import logging
import json

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Created once per execution environment and reused across warm invocations.
dynamodb = boto3.resource("dynamodb", endpoint_url=os.getenv("DYNAMODB_ENDPOINT"))
table = dynamodb.Table("Recipes")


def client_response(status_code, body_json):
    response = {
        "statusCode": status_code,
        "body": json.dumps(body_json, default=str),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Credentials": True,
        },
    }
    logger.info(f"Returning {status_code}")
    return response


def log_exception():
    exception_type, exception_value, exception_traceback = sys.exc_info()
    error_message = json.dumps(
        {
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback.format_exception(
                exception_type, exception_value, exception_traceback
            ),
        }
    )
    logger.error(error_message)
