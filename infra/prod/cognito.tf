resource "aws_cognito_user_pool" "enplace" {
  name                     = "enplace_user_pool"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
}

resource "aws_cognito_user_pool_client" "enplace" {
  name                                 = "enplace_user_pool_client"
  user_pool_id                         = aws_cognito_user_pool.enplace.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["openid", "email"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls                        = ["https://www.${var.domain_name}/callback", "http://localhost:5173/callback"]
  logout_urls                          = ["https://www.${var.domain_name}/logout", "http://localhost:5173/logout"]
  prevent_user_existence_errors        = "ENABLED"
}

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name            = "cognito_authorizer"
  rest_api_id     = aws_api_gateway_rest_api.enplace.id
  type            = "COGNITO_USER_POOLS"
  identity_source = "method.request.header.Authorization"
  provider_arns   = [aws_cognito_user_pool.enplace.arn]
}