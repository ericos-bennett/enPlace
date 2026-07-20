#!/bin/bash
set -e

# Runs the backend/recipes E2E test suite against a real Terraform deploy
# (lambda + API Gateway + DynamoDB) inside a throwaway LocalStack container.
# Usage: ./e2e_test.sh

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

cleanup() {
  echo ">>> Tearing down localstack container"
  # Also sweep up LocalStack's own per-lambda execution containers, which
  # aren't stopped by removing the main container and would otherwise leak.
  docker rm -f $(docker ps -aq -f "name=^enplace-localstack") >/dev/null 2>&1 || true
}
trap cleanup EXIT

# create_recipe's OpenAI call is never reached by these tests (invalid URLs
# are rejected before the secret is used), so a placeholder key is enough.
export TF_VAR_openai_api_key="${TF_VAR_openai_api_key:-test-openai-key}"

echo ">>> Starting LocalStack"
./docker_localstack.sh

echo ">>> Waiting for LocalStack to be ready"
for i in $(seq 1 60); do
  if curl -sf http://localhost:4566/_localstack/health >/dev/null 2>&1; then
    echo ">>> LocalStack is ready"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo ">>> LocalStack did not become ready in time" >&2
    exit 1
  fi
  sleep 2
done

echo ">>> Initializing terraform"
terraform init -input=false

echo ">>> Deploying infra to LocalStack"
./deploy_infra.sh

echo ">>> Resolving API base URL"
OUTPUTS=$(terraform output -json)
API_ID=$(echo "$OUTPUTS" | jq -r '.api_gateway_id.value')
STAGE_NAME=$(echo "$OUTPUTS" | jq -r '.api_gateway_stage_name.value')
export API_BASE_URL="https://${API_ID}.execute-api.localhost.localstack.cloud:4566/${STAGE_NAME}"

echo ">>> Running E2E tests against $API_BASE_URL"
cd "$SCRIPT_DIR/../../backend/recipes/tests"
pip install --quiet -r requirements.txt
pytest -v
