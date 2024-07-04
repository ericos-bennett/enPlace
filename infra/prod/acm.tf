resource "aws_acm_certificate" "enplace" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}",
    "api.${var.domain_name}",
    "auth.${var.domain_name}",
  ]
}

resource "aws_acm_certificate_validation" "enplace" {
  certificate_arn         = aws_acm_certificate.enplace.arn
  validation_record_fqdns = [for record in aws_route53_record.enplace_acm_validation : record.fqdn]
}