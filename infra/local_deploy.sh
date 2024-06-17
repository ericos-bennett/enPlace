#!/bin/bash
set -e

# Package lambda code
echo ">>> Updating lambda code..."
cd ../backend/get_recipe
npm install
zip -q -r ../../infra/get_recipe.zip .
cd ../get_recipes
npm install
zip -q -r ../../infra/get_recipes.zip .
cd ../create_recipe
npm install
zip -q -r ../../infra/create_recipe.zip .
cd ../../infra
echo ">>> Lambda code updated"

# Apply terraform
echo ">>> Applying terraform locally..."
terraform apply -auto-approve -var-file="local.tfvars"
echo ">>> Terraform applied"
