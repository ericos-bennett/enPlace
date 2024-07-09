#!/bin/bash
set -e

echo ">>> Updating frontend code..."
cd ../../frontend
npm install
VITE_SPA_URL=https://www.enplace.xyz VITE_API_URL=https://api.enplace.xyz npm run build
cp -r dist ../infra/prod/frontend
echo ">>> Frontend code updated"