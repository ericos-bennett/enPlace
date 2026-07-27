resource "aws_lambda_function" "recipes" {
  filename         = "${path.module}/recipes.zip"
  function_name    = "Recipes"
  role             = aws_iam_role.recipes.arn
  handler          = "main.handler"
  source_code_hash = filebase64sha256("${path.module}/recipes.zip")
  runtime          = "python3.12"
  timeout          = 30
  memory_size      = 512
  architectures    = ["arm64"]
  environment {
    variables = {
      DYNAMODB_ENDPOINT       = var.dynamodb_endpoint,
      SECRETSMANAGER_ENDPOINT = var.secretsmanager_endpoint
      OPENAI_API_KEY_ID       = aws_secretsmanager_secret.openai_api_key.id
    }
  }
}

resource "aws_lambda_permission" "recipes" {
  statement_id  = "AllowAPIGatewayInvokeRecipes"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.recipes.arn
  principal     = "apigateway.amazonaws.com"
}
