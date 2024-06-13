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