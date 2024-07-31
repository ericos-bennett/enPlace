#!/bin/bash
set -e

# Check if env variable is passed
if [ -z "$1" ]; then
  echo "Environment variable not provided. Usage: $0 <env>"
  exit 1
fi
ENV=$1

# Package lambda code
echo ">>> Packaging lambdas"
cd ../backend

echo ">>> Updating get_recipe lambda"
cd get_recipe
pip install \
  --upgrade \
  --quiet \
  --python-version 3.12 \
  --platform manylinux2014_aarch64 \
  --implementation cp \
  --only-binary=:all: \
  --no-deps \
  --target package \
  -r requirements.txt
cd package && zip -q -r ../get_recipe.zip .
cd .. && zip get_recipe.zip main.py
mv get_recipe.zip ../../infra/$ENV
cd ..

echo ">>> Updating get_recipes lambda"
cd get_recipes
pip install \
  --upgrade \
  --quiet \
  --python-version 3.12 \
  --platform manylinux2014_aarch64 \
  --implementation cp \
  --only-binary=:all: \
  --no-deps \
  --target package \
  -r requirements.txt
cd package && zip -q -r ../get_recipes.zip .
cd .. && zip get_recipes.zip main.py
mv get_recipes.zip ../../infra/$ENV
cd ..

echo ">>> Updating delete_recipe lambda"
cd delete_recipe
pip install \
  --upgrade \
  --quiet \
  --python-version 3.12 \
  --platform manylinux2014_aarch64 \
  --implementation cp \
  --only-binary=:all: \
  --no-deps \
  --target package \
  -r requirements.txt
cd package && zip -q -r ../delete_recipe.zip .
cd .. && zip delete_recipe.zip main.py
mv delete_recipe.zip ../../infra/$ENV
cd ..

echo ">>> Updating create_recipe lambda"
cd create_recipe
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
mv create_recipe.zip ../../infra/$ENV
cd ..

echo ">>> Updating metrics_report lambda"
cd metrics_report
pip install \
  --upgrade \
  --quiet \
  --python-version 3.12 \
  --platform manylinux2014_aarch64 \
  --implementation cp \
  --only-binary=:all: \
  --no-deps \
  --target package \
  -r requirements.txt
cd package && zip -q -r ../metrics_report.zip .
cd .. && zip metrics_report.zip main.py
mv metrics_report.zip ../../infra/$ENV

echo ">>> Lambda code updated"
