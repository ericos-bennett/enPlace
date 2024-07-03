provider "aws" {
  access_key                  = var.aws_access_key
  secret_key                  = var.aws_secret_key
  region                      = var.aws_region
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    iam            = var.iam_endpoint
    apigateway     = var.apigateway_endpoint
    secretsmanager = var.secretsmanager_endpoint
    lambda         = var.lambda_endpoint
    dynamodb       = var.dynamodb_endpoint
  }
}
