#!/bin/bash
set -e

# Package lambda code
cd ..
./package_lambdas.sh local
cd local

# Copy terraform files that we want to use for the local deployment
echo ">>> Copying terraform resource files to local directory"
cp ../prod/iam.tf .
cp ../prod/secretsmanager.tf .
cp ../prod/lambda.tf .
cp ../prod/dynamodb.tf .
cp ../prod/apigateway.tf .

# Remove auth from API gateway
sed -i '' 's/COGNITO_USER_POOLS/NONE/g' apigateway.tf
sed -i '' '/authorizer_id/d' apigateway.tf

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
rm apigateway.tf