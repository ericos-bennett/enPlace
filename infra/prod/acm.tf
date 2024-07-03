resource "aws_acm_certificate" "enplace_fe" {
  domain_name       = aws_route53_record.enpalce_fe.name
  validation_method = "DNS"
}

resource "aws_acm_certificate" "enplace_api" {
  domain_name       = aws_route53_record.enplace_api.name
  validation_method = "DNS"
}

resource "aws_acm_certificate" "enplace_auth" {
  domain_name       = aws_route53_record.enplace_auth.name
  validation_method = "DNS"
}