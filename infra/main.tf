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

resource "aws_secretsmanager_secret" "openai_api_key" {
  name        = "openai_api_key"
  description = "Key for the OpenAI API"
}

resource "aws_secretsmanager_secret_version" "openai_api_key" {
  secret_id     = aws_secretsmanager_secret.openai_api_key.id
  secret_string = var.openai_api_key
}

resource "aws_api_gateway_rest_api" "menu" {
  name        = "menu"
  description = "API for the Menu app"
}

resource "aws_api_gateway_deployment" "menu" {
  depends_on = [
    aws_api_gateway_integration.get_recipe,
    aws_api_gateway_integration.get_recipes,
    aws_api_gateway_integration.create_recipe
  ]
  rest_api_id = aws_api_gateway_rest_api.menu.id
  stage_name  = var.apigateway_stage
}

resource "aws_api_gateway_resource" "recipes" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  parent_id   = aws_api_gateway_rest_api.menu.root_resource_id
  path_part   = "recipes"
}

resource "aws_api_gateway_resource" "recipe" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  parent_id   = aws_api_gateway_resource.recipes.id
  path_part   = "{recipeId}"
}

# Define the OPTIONS method for CORS
resource "aws_api_gateway_method" "options_recipes" {
  rest_api_id   = aws_api_gateway_rest_api.menu.id
  resource_id   = aws_api_gateway_resource.recipes.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_recipes" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.options_recipes.http_method
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

resource "aws_api_gateway_integration" "options_recipes" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.options_recipes.http_method
  type        = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "options_recipes" {
  depends_on = [
    aws_api_gateway_integration.options_recipes
  ]

  rest_api_id = aws_api_gateway_rest_api.menu.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.options_recipes.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

resource "aws_api_gateway_method" "get_recipe" {
  rest_api_id   = aws_api_gateway_rest_api.menu.id
  resource_id   = aws_api_gateway_resource.recipe.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.recipeId" = true
  }
}

resource "aws_api_gateway_integration" "get_recipe" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.get_recipe.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_recipe.invoke_arn

  request_parameters = {
    "integration.request.path.recipeId" = "method.request.path.recipeId"
  }
}

resource "aws_lambda_function" "get_recipe" {
  filename         = "${path.module}/get_recipe.zip"
  function_name    = "GetRecipe"
  role             = aws_iam_role.get_recipe.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/get_recipe.zip")
  runtime          = "nodejs20.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION               = var.aws_region
      LAMBDA_DYNAMODB_ENDPOINT = var.lambda_dynamodb_endpoint
    }
  }
}

resource "aws_iam_role" "get_recipe" {
  name = "get_recipe_role"
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

resource "aws_iam_role_policy" "get_recipe" {
  name = "get_recipe_policy"
  role = aws_iam_role.get_recipe.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_lambda_permission" "get_recipe" {
  statement_id  = "AllowAPIGatewayInvokeGetRecipe"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_recipe.arn
  principal     = "apigateway.amazonaws.com"
}

resource "aws_iam_role_policy_attachment" "get_recipe" {
  role       = aws_iam_role.get_recipe.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_api_gateway_method" "get_recipes" {
  rest_api_id   = aws_api_gateway_rest_api.menu.id
  resource_id   = aws_api_gateway_resource.recipes.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_recipes" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.get_recipes.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_recipes.invoke_arn
}

resource "aws_lambda_function" "get_recipes" {
  filename         = "${path.module}/get_recipes.zip"
  function_name    = "GetRecipes"
  role             = aws_iam_role.get_recipes.arn
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

resource "aws_iam_role" "get_recipes" {
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

resource "aws_iam_role_policy" "get_recipes" {
  name = "get_recipes_policy"
  role = aws_iam_role.get_recipes.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_lambda_permission" "get_recipes" {
  statement_id  = "AllowAPIGatewayInvokeGetRecipes"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_recipes.arn
  principal     = "apigateway.amazonaws.com"
}

resource "aws_iam_role_policy_attachment" "get_recipes" {
  role       = aws_iam_role.get_recipes.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_api_gateway_method" "create_recipe" {
  rest_api_id   = aws_api_gateway_rest_api.menu.id
  resource_id   = aws_api_gateway_resource.recipes.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "create_recipe" {
  rest_api_id = aws_api_gateway_rest_api.menu.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.create_recipe.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_recipe.invoke_arn
}

resource "aws_lambda_function" "create_recipe" {
  filename         = "${path.module}/create_recipe.zip"
  function_name    = "CreateRecipe"
  role             = aws_iam_role.create_recipe.arn
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

resource "aws_iam_role" "create_recipe" {
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

resource "aws_iam_role_policy" "create_recipe" {
  name = "create_recipe_policy"
  role = aws_iam_role.create_recipe.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
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

resource "aws_lambda_permission" "create_recipe" {
  statement_id  = "AllowAPIGatewayInvokeCreateRecipe"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_recipe.arn
  principal     = "apigateway.amazonaws.com"
}

resource "aws_iam_role_policy_attachment" "create_recipe" {
  role       = aws_iam_role.create_recipe.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

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
