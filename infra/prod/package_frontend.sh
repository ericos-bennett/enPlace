#!/bin/bash
set -e

VITE_API_URL=https://api.enplace.xyz
VITE_API_STAGE=prod

echo ">>> Updating frontend code..."
cd ../../frontend
npm install
npm run build
cp -r dist ../infra/prod/frontend
echo ">>> Frontend code updated"