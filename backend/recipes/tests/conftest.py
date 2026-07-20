import os

import boto3
import jwt
import pytest

LOCALSTACK_ENDPOINT = "http://localhost:4566"

USER_ID = "e2e-test-user"
OTHER_USER_ID = "e2e-test-other-user"


def make_token(user_id):
    # The API gateway authorizer is disabled locally (see infra/local/deploy_infra.sh),
    # so the lambda decodes this without verifying the signature.
    return jwt.encode({"sub": user_id}, "unused-signing-key-padded-to-32-bytes", algorithm="HS256")


@pytest.fixture(scope="session")
def base_url():
    return os.environ["API_BASE_URL"].rstrip("/")


@pytest.fixture(scope="session")
def table():
    dynamodb = boto3.resource(
        "dynamodb",
        endpoint_url=LOCALSTACK_ENDPOINT,
        region_name="us-east-1",
        aws_access_key_id="mock_access_key",
        aws_secret_access_key="mock_secret_key",
    )
    return dynamodb.Table("Recipes")


@pytest.fixture(scope="session")
def seed_data(table):
    items = {
        "gettable": {
            "Id": "e2e-get-recipe",
            "UserId": USER_ID,
            "SourceUrl": "https://example.com/e2e-get-recipe",
            "name": "Gettable Recipe",
        },
        "soft_deleted": {
            "Id": "e2e-soft-deleted",
            "UserId": USER_ID,
            "SourceUrl": "https://example.com/e2e-soft-deleted",
            "name": "Deleted Recipe",
            "DeletedAt": "2026-01-01T00:00:00",
        },
        "deletable": {
            "Id": "e2e-delete-me",
            "UserId": USER_ID,
            "SourceUrl": "https://example.com/e2e-delete-me",
            "name": "Deletable Recipe",
        },
        "other_user": {
            "Id": "e2e-other-user-recipe",
            "UserId": OTHER_USER_ID,
            "SourceUrl": "https://example.com/e2e-other-user",
            "name": "Other User Recipe",
        },
    }
    for item in items.values():
        table.put_item(Item=item)

    yield items

    for item in items.values():
        table.delete_item(Key={"Id": item["Id"]})
