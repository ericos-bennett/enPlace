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
variable "domain_name" {
  type     = string
  nullable = false
}
variable "cloudfront_referer_header" {
  type      = string
  nullable  = false
  sensitive = true
}