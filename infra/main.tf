provider "aws" {
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
  region                      = "us-east-1"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    iam        = "http://localhost:4566"
    apigateway = "http://localhost:4566"
    lambda     = "http://localhost:4566"
    dynamodb   = "http://localhost:4566"
  }
}


resource "aws_api_gateway_rest_api" "menu_api" {
  name        = "MenuAPI"
  description = "API for the Menu app"
}

resource "aws_api_gateway_resource" "recipes_resource" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  parent_id   = aws_api_gateway_rest_api.menu_api.root_resource_id
  path_part   = "recipes"
}

resource "aws_api_gateway_method" "get_recipes_method" {
  rest_api_id   = aws_api_gateway_rest_api.menu_api.id
  resource_id   = aws_api_gateway_resource.recipes_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_recipes_integration" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.get_recipes_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_recipes.invoke_arn
}

resource "aws_api_gateway_method" "create_recipe_method" {
  rest_api_id   = aws_api_gateway_rest_api.menu_api.id
  resource_id   = aws_api_gateway_resource.recipes_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "create_recipe_integration" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.create_recipe_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_recipe.invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.get_recipes_integration,
    aws_api_gateway_integration.create_recipe_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  stage_name  = "local"
}

resource "aws_lambda_permission" "get_recipes_permission" {
  statement_id  = "AllowAPIGatewayInvokeGetRecipes"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_recipes.arn
  principal     = "apigateway.amazonaws.com"
}

resource "aws_lambda_permission" "create_recipe_permission" {
  statement_id  = "AllowAPIGatewayInvokeCreateRecipe"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_recipe.arn
  principal     = "apigateway.amazonaws.com"
}


resource "aws_lambda_function" "get_recipes" {
  filename         = "${path.module}/localstack/get_recipes.zip"
  function_name    = "GetRecipes"
  role             = aws_iam_role.get_recipes_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/localstack/get_recipes.zip")
  runtime          = "nodejs14.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION = "us-east-1"
    }
  }
}

resource "aws_iam_role" "get_recipes_role" {
  name = "get_recipes_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "get_recipes_policy" {
  name = "get_recipes_policy"
  role = aws_iam_role.get_recipes_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_recipes_role_policy_attach" {
  role       = aws_iam_role.get_recipes_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_lambda_function" "create_recipe" {
  filename         = "${path.module}/localstack/create_recipe.zip"
  function_name    = "CreateRecipe"
  role             = aws_iam_role.create_recipe_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/localstack/create_recipe.zip")
  runtime          = "nodejs14.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION = "us-east-1"
    }
  }
}

resource "aws_iam_role" "create_recipe_role" {
  name = "create_recipe_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "create_recipe_policy" {
  name = "create_recipe_policy"
  role = aws_iam_role.create_recipe_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "create_recipe_role_policy_attach" {
  role       = aws_iam_role.create_recipe_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_dynamodb_table" "recipes" {
  name         = "Recipes"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "UserId"
  range_key = "Timestamp"

  attribute {
    name = "UserId"
    type = "N"
  }

  attribute {
    name = "Timestamp"
    type = "N"
  }
}
