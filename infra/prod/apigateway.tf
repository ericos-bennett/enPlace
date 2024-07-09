resource "aws_api_gateway_rest_api" "enplace" {
  name        = "enplace"
  description = "API for the enplace app"
}

resource "aws_api_gateway_deployment" "enplace" {
  depends_on = [
    aws_api_gateway_integration.get_recipe,
    aws_api_gateway_integration.get_recipes,
    aws_api_gateway_integration.create_recipe
  ]
  rest_api_id = aws_api_gateway_rest_api.enplace.id
}

resource "aws_api_gateway_stage" "enplace" {
  deployment_id = aws_api_gateway_deployment.enplace.id
  rest_api_id   = aws_api_gateway_rest_api.enplace.id
  stage_name    = var.environment
}

resource "aws_api_gateway_method_settings" "enplace" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  stage_name  = aws_api_gateway_stage.enplace.stage_name
  method_path = "*/*"

  settings {
    throttling_burst_limit = 40
    throttling_rate_limit  = 20
  }
}

resource "aws_api_gateway_gateway_response" "enplace" {
  rest_api_id   = aws_api_gateway_rest_api.enplace.id
  response_type = "DEFAULT_4XX"

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"      = "'*'",
    "gatewayresponse.header.Access-Control-Allow-Methods"     = "'GET,POST,OPTIONS'",
    "gatewayresponse.header.Access-Control-Allow-Headers"     = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
    "gatewayresponse.header.Access-Control-Allow-Credentials" = "'true'"
  }
}

resource "aws_api_gateway_resource" "recipes" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  parent_id   = aws_api_gateway_rest_api.enplace.root_resource_id
  path_part   = "recipes"
}

resource "aws_api_gateway_resource" "recipe" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  parent_id   = aws_api_gateway_resource.recipes.id
  path_part   = "{recipeId}"
}

resource "aws_api_gateway_method" "options_recipes" {
  rest_api_id   = aws_api_gateway_rest_api.enplace.id
  resource_id   = aws_api_gateway_resource.recipes.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_recipes" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.options_recipes.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration" "options_recipes" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
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

  rest_api_id = aws_api_gateway_rest_api.enplace.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.options_recipes.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
}

resource "aws_api_gateway_method" "get_recipe" {
  rest_api_id   = aws_api_gateway_rest_api.enplace.id
  resource_id   = aws_api_gateway_resource.recipe.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id

  request_parameters = {
    "method.request.path.recipeId" = true
  }
}

resource "aws_api_gateway_integration" "get_recipe" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  resource_id = aws_api_gateway_resource.recipe.id
  http_method = aws_api_gateway_method.get_recipe.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_recipe.invoke_arn

  request_parameters = {
    "integration.request.path.recipeId" = "method.request.path.recipeId"
  }
}

resource "aws_api_gateway_method" "get_recipes" {
  rest_api_id   = aws_api_gateway_rest_api.enplace.id
  resource_id   = aws_api_gateway_resource.recipes.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "get_recipes" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.get_recipes.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_recipes.invoke_arn
}

resource "aws_api_gateway_method" "create_recipe" {
  rest_api_id   = aws_api_gateway_rest_api.enplace.id
  resource_id   = aws_api_gateway_resource.recipes.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_integration" "create_recipe" {
  rest_api_id = aws_api_gateway_rest_api.enplace.id
  resource_id = aws_api_gateway_resource.recipes.id
  http_method = aws_api_gateway_method.create_recipe.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_recipe.invoke_arn
}
