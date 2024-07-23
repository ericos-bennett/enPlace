#!/bin/bash
set -e

# Package lambda code
echo ">>> Updating get_recipe lambda"
cd ../../backend/get_recipe
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
mv get_recipe.zip ../../infra/prod

echo ">>> Updating get_recipes lambda"
cd ../get_recipes
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
mv get_recipes.zip ../../infra/prod

echo ">>> Updating create_recipe lambda"
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
mv create_recipe.zip ../../infra/prod

echo ">>> Lambda code updated"
