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

echo ">>> Updating recipes lambda"
cd recipes
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
cd package && zip -q -r ../recipes.zip .
cd .. && zip recipes.zip main.py
mv recipes.zip ../../infra/$ENV

echo ">>> Lambda code updated"
