variable "openai_api_key" {
  type      = string
  nullable  = false
  sensitive = true
}
variable "environment" {
  type     = string
  nullable = false
}
variable "domain_name" {
  type     = string
  nullable = false
}