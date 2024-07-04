resource "aws_acm_certificate" "enplace" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}",
    "api.${var.domain_name}",
    "auth.${var.domain_name}",
  ]

  depends_on = [aws_route53_record.enplace_fe, aws_route53_record.enplace_fe_www, aws_route53_record.enplace_api, aws_route53_record.enplace_auth]
}