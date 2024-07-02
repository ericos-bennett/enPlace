resource "aws_acm_certificate" "enplace_fe" {
  domain_name       = aws_route53_zone.enplace.name
  validation_method = "DNS"
}

resource "aws_acm_certificate" "enplace_api" {
  domain_name       = "api.${aws_route53_zone.enplace.name}"
  validation_method = "DNS"
}
