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
npm install
deterministic-zip -q -r ../../infra/prod/create_recipe.zip .
cd ../../infra
echo ">>> Lambda code updated"
