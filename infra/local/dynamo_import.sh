#!/bin/bash
set -e

export AWS_ACCESS_KEY_ID="mock_access_key"
export AWS_SECRET_ACCESS_KEY="mock_secret_key"
ENDPOINT_URL="http://localhost:4566"
REGION="us-east-1"
TABLE_NAME="Recipes"
INPUT_FILE="sampleRecipesData.json"

echo ">>> Formatting $INPUT_FILE"
ITEMS_JSON=$(jq -c '.Items | map({"PutRequest": {"Item": .}})' $INPUT_FILE)
BATCH_JSON=$(jq -n --argjson items "$ITEMS_JSON" '{"'$TABLE_NAME'": $items}')

echo ">>> Importing data to $TABLE_NAME"
aws dynamodb batch-write-item \
    --region $REGION \
    --endpoint-url $ENDPOINT_URL \
    --request-items "$BATCH_JSON"

echo ">>> Data bootstrapped successfully to $TABLE_NAME table"
