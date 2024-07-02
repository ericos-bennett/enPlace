#!/bin/bash
set -e

# Configure frontend to connect to API
echo ">>> Creating frontend .env.local file"
cd ..
OUTPUTS=$(terraform output -json)
API_ID=$(echo "$OUTPUTS" | jq -r '.api_gateway_id.value')
STAGE_NAME=$(echo "$OUTPUTS" | jq -r '.api_gateway_stage_name.value')
echo "VITE_API_URL=https://${API_ID}.execute-api.localhost.localstack.cloud:4566/local" > .env.local
echo "VITE_API_STAGE=$STAGE_NAME" >> .env.local
mv .env.local ../frontend/
echo ">>> .env.local created and moved to frontend folder"