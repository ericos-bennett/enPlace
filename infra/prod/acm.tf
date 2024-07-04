resource "aws_acm_certificate" "enplace" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}",
    "api.${var.domain_name}",
    "auth.${var.domain_name}",
  ]
}