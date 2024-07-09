variable "environment" {
  type     = string
  nullable = false
}
variable "dynamodb_endpoint" {
  type     = string
  nullable = false
}
variable "secretsmanager_endpoint" {
  type     = string
  nullable = false
}
variable "openai_api_key" {
  type      = string
  nullable  = false
  sensitive = true
}