#!/bin/bash
set -e

echo ">>> Updating frontend code..."
cd ../../frontend
npm install
npm run build
cp -r dist ../infra/prod/frontend
echo ">>> Frontend code updated"