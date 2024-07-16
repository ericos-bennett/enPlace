#!/bin/bash
set -e

# Install deterministic-zip
echo ">>> Installing deterministic-zip..."
bash <(curl -sS https://raw.githubusercontent.com/timo-reymann/deterministic-zip/main/installer)

echo ">>> Updating lambda code..."
cd ../../backend/get_recipe
npm install
deterministic-zip -q -r ../../infra/prod/get_recipe.zip .

cd ../get_recipes
npm install
deterministic-zip -q -r ../../infra/prod/get_recipes.zip .

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
