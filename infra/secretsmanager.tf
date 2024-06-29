resource "aws_secretsmanager_secret" "openai_api_key" {
  name        = "openai_api_key"
  description = "Key for the OpenAI API"
}

resource "aws_secretsmanager_secret_version" "openai_api_key" {
  secret_id     = aws_secretsmanager_secret.openai_api_key.id
  secret_string = var.openai_api_key
}
