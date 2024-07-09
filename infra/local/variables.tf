variable "environment" {
  type     = string
  nullable = false
}
variable "dynamodb_endpoint" {
  type     = string
  nullable = true
}
variable "secretsmanager_endpoint" {
  type     = string
  nullable = true
}
variable "openai_api_key" {
  type      = string
  nullable  = false
  sensitive = true
}