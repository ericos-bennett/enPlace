# Copy terraform files that we want to use for the local deployment
echo ">>> Copying terraform resource files to local directory"
cp ../prod/iam.tf .
cp ../prod/secretsmanager.tf .
cp ../prod/lambda.tf .
cp ../prod/dynamodb.tf .

# Destroy terraform
echo ">>> Destroying local terraform"
terraform destroy -auto-approve -var-file="local.tfvars"
echo ">>> Terraform destroyed"

# Remove the copied terraform files once the removal is complete
echo ">>> Removing terraform resource files from local directory"
rm iam.tf
rm secretsmanager.tf
rm lambda.tf
rm dynamodb.tf