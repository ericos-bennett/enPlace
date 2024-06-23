#!/bin/bash
set -e

export AWS_ACCESS_KEY_ID="mock_access_key"
export AWS_SECRET_ACCESS_KEY="mock_secret_key"
ENDPOINT_URL="http://localhost:4566"
REGION="us-east-1"
TABLE_NAME="Recipes"
OUTPUT_FILE="sampleRecipesData.json"

echo ">>> Exporting data from $TABLE_NAME..."
awslocal dynamodb scan \
    --endpoint-url $ENDPOINT_URL \
    --region $REGION \
    --table-name $TABLE_NAME \
    --output json \
    > $OUTPUT_FILE

echo ">>> Data exported successfully to $OUTPUT_FILE."
