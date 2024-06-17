# Define the provider
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

# Define the API Gateway Menu REST API
resource "aws_api_gateway_rest_api" "menu_api" {
  name        = "MenuAPI"
  description = "API for the Menu app"
}

# Define the API Gateway Recipes resource
resource "aws_api_gateway_resource" "recipes_resource" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  parent_id   = aws_api_gateway_rest_api.menu_api.root_resource_id
  path_part   = "recipes"
}

# Define the OPTIONS method for CORS
resource "aws_api_gateway_method" "options_recipes_method" {
  rest_api_id   = aws_api_gateway_rest_api.menu_api.id
  resource_id   = aws_api_gateway_resource.recipes_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# Define the method response for OPTIONS
resource "aws_api_gateway_method_response" "options_recipes_method_response" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.options_recipes_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Headers" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

# Define the integration for OPTIONS
resource "aws_api_gateway_integration" "options_recipes_integration" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.options_recipes_method.http_method
  type        = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# Define the integration response for OPTIONS
resource "aws_api_gateway_integration_response" "options_recipes_integration_response" {
  depends_on = [
    aws_api_gateway_integration.options_recipes_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.options_recipes_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

# Define the GET Recipes method
resource "aws_api_gateway_method" "get_recipes_method" {
  rest_api_id   = aws_api_gateway_rest_api.menu_api.id
  resource_id   = aws_api_gateway_resource.recipes_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# Define the GET Recipes integration
resource "aws_api_gateway_integration" "get_recipes_integration" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.get_recipes_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_recipes.invoke_arn
}

# Define the POST Recipes method
resource "aws_api_gateway_method" "create_recipe_method" {
  rest_api_id   = aws_api_gateway_rest_api.menu_api.id
  resource_id   = aws_api_gateway_resource.recipes_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Define the POST Recipes integration
resource "aws_api_gateway_integration" "create_recipe_integration" {
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  resource_id = aws_api_gateway_resource.recipes_resource.id
  http_method = aws_api_gateway_method.create_recipe_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_recipe.invoke_arn
}

# Define the API Gateway Menu deployment
resource "aws_api_gateway_deployment" "menu_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.get_recipes_integration,
    aws_api_gateway_integration.create_recipe_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.menu_api.id
  stage_name  = var.apigateway_stage
}

# Define the GET Recipes Lambda permission
resource "aws_lambda_permission" "get_recipes_permission" {
  statement_id  = "AllowAPIGatewayInvokeGetRecipes"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_recipes.arn
  principal     = "apigateway.amazonaws.com"
}

# Define the POST Recipes Lambda permission
resource "aws_lambda_permission" "create_recipe_permission" {
  statement_id  = "AllowAPIGatewayInvokeCreateRecipe"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_recipe.arn
  principal     = "apigateway.amazonaws.com"
}

resource "aws_secretsmanager_secret" "openai_api_key" {
  name        = "openai_api_key"
  description = "Key for the OpenAI API"
}

resource "aws_secretsmanager_secret_version" "openai_api_key_version" {
  secret_id     = aws_secretsmanager_secret.openai_api_key.id
  secret_string = var.openai_api_key
}

# Define the GET Recipes Lambda function
resource "aws_lambda_function" "get_recipes" {
  filename         = "${path.module}/get_recipes.zip"
  function_name    = "GetRecipes"
  role             = aws_iam_role.get_recipes_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/get_recipes.zip")
  runtime          = "nodejs20.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION               = var.aws_region
      LAMBDA_DYNAMODB_ENDPOINT = var.lambda_dynamodb_endpoint
    }
  }
}

# Define the GET Recipes IAM role
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

# Define the GET Recipes IAM role policy
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

# Define the GET Recipes IAM role policy attachment
resource "aws_iam_role_policy_attachment" "get_recipes_role_policy_attach" {
  role       = aws_iam_role.get_recipes_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Define the POST Recipes Lambda function
resource "aws_lambda_function" "create_recipe" {
  filename         = "${path.module}/create_recipe.zip"
  function_name    = "CreateRecipe"
  role             = aws_iam_role.create_recipe_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/create_recipe.zip")
  runtime          = "nodejs20.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION                     = var.aws_region,
      LAMBDA_SECRETSMANAGER_ENDPOINT = var.lambda_secretsmanager_endpoint
      LAMBDA_DYNAMODB_ENDPOINT       = var.lambda_dynamodb_endpoint,
      OPENAI_API_KEY_ID              = aws_secretsmanager_secret.openai_api_key.id,
    }
  }
}

# Define the POST Recipes IAM role
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

# Define the POST Recipes IAM role policy
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
      },
      {
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ],
        Resource = aws_secretsmanager_secret.openai_api_key.arn
      },
    ]
  })
}

# Define the POST Recipes IAM role policy attachment
resource "aws_iam_role_policy_attachment" "create_recipe_role_policy_attach" {
  role       = aws_iam_role.create_recipe_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Define the DynamoDB Recipes table
resource "aws_dynamodb_table" "recipes" {
  name         = "Recipes"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "Id"
  range_key = "CreatedAt"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "CreatedAt"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "N"
  }

  global_secondary_index {
    name            = "UserIdIndex"
    hash_key        = "UserId"
    projection_type = "ALL"
  }
}
