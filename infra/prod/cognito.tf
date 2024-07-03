resource "aws_cognito_user_pool" "enplace" {
  name = "enplace_user_pool"
}

resource "aws_cognito_user_pool_client" "enplace" {
  name                                 = "enplace_user_pool_client"
  user_pool_id                         = aws_cognito_user_pool.enplace.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["openid", "email"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls                        = ["https://example.com/callback"]
  logout_urls                          = ["https://example.com/logout"]
}

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name            = "cognito_authorizer"
  rest_api_id     = aws_api_gateway_rest_api.enplace.id
  type            = "COGNITO_USER_POOLS"
  identity_source = "method.request.header.Authorization"
  provider_arns   = [aws_cognito_user_pool.enplace.arn]
}