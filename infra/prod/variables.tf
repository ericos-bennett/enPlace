variable "environment" {
  type     = string
  nullable = false
}
variable "domain_name" {
  type     = string
  nullable = false
}
variable "openai_api_key" {
  type      = string
  nullable  = false
  sensitive = true
}
variable "cloudfront_referer_header" {
  type      = string
  nullable  = false
  sensitive = true
}