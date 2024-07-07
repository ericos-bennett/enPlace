variable "environment" {
  type     = string
  nullable = false
}
variable "openai_api_key" {
  type      = string
  nullable  = false
  sensitive = true
}