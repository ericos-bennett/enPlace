#!/bin/bash
set -e

# Package lambda code
echo ">>> Updating lambda code"
cd ../../backend/get_recipe
npm install
deterministic-zip -q -r ../../infra/local/get_recipe.zip .
cd ../get_recipes
npm install
deterministic-zip -q -r ../../infra/local/get_recipes.zip .

cd ../create_recipe
pip install \
  --upgrade \
  --quiet \
  --python-version 3.12 \
  --platform manylinux2014_aarch64 \
  --implementation cp \
  --only-binary=:all: \
  --no-deps \
  --target package \
  -r requirements_binary.txt
# We have to install these manually, because there are no wheels with the correct version on PyPI
pip install \
  --upgrade \
  --quiet \
  --target package \
  -r requirements_source.txt
cd package && zip -q -r ../create_recipe.zip .
cd .. && zip create_recipe.zip main.py && zip create_recipe.zip exampleRecipe.json
mv create_recipe.zip ../../infra/local

cd ../../infra/local
echo ">>> Lambda code updated"

# Copy terraform files that we want to use for the local deployment
echo ">>> Copying terraform resource files to local directory"
cp ../prod/iam.tf .
cp ../prod/secretsmanager.tf .
cp ../prod/lambda.tf .
cp ../prod/dynamodb.tf .

# Apply terraform
echo ">>> Applying terraform locally"
terraform apply -auto-approve -var-file="local.tfvars"
echo ">>> Terraform applied"

# Remove the copied terraform files once the deployment is complete
echo ">>> Removing terraform resource files from local directory"
rm iam.tf
rm secretsmanager.tf
rm lambda.tf
rm dynamodb.tf