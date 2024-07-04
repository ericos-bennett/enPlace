resource "aws_acm_certificate" "enplace_fe" {
  domain_name       = var.domain_name
  validation_method = "DNS"
}

resource "aws_acm_certificate" "enplace_api" {
  domain_name       = "api.${var.domain_name}"
  validation_method = "DNS"
}

resource "aws_acm_certificate" "enplace_auth" {
  domain_name       = "auth.${var.domain_name}"
  validation_method = "DNS"
}