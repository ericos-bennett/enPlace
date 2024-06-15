#!/bin/bash
set -e

# Package lambda code
echo ">>> Updating lambda code..."
cd ../backend/create_recipe
zip -r ../../infra/create_recipe.zip .
cd ../get_recipes
zip -r ../../infra/get_recipes.zip .
cd ../../infra
echo ">>> Lambda code updated"

# Apply terraform
echo ">>> Applying terraform locally..."
terraform apply -auto-approve -var-file="local.tfvars"
echo ">>> Terraform applied"

# Configure frontend to connect to API
echo ">>> Creating frontend .env.local file"
OUTPUTS=$(terraform output -json)
API_ID=$(echo "$OUTPUTS" | jq -r '.api_id.value')
STAGE_NAME=$(echo "$OUTPUTS" | jq -r '.stage_name.value')
echo "VITE_API_URL=https://${API_ID}.execute-api.localhost.localstack.cloud" > .env.local
echo "VITE_API_PORT=4566" >> .env.local
echo "VITE_API_STAGE=$STAGE_NAME" >> .env.local
mv .env.local ../frontend/
echo ">>> .env.local created and moved to frontend folder"