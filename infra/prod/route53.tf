resource "aws_route53_zone" "enplace" {
  name = var.domain_name
}

resource "aws_route53_record" "enplace_fe" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.enplace_fe.domain_name
    zone_id                = aws_cloudfront_distribution.enplace_fe.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "enplace_fe_www" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.enplace_fe.domain_name
    zone_id                = aws_cloudfront_distribution.enplace_fe.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_api_gateway_domain_name" "enplace" {
  domain_name = "api.${var.domain_name}"
  # certificate_arn = aws_acm_certificate.enplace.arn
}

resource "aws_route53_record" "enplace_api" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.enplace.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.enplace.cloudfront_zone_id
    evaluate_target_health = false
  }
}

resource "aws_cognito_user_pool_domain" "enplace" {
  domain       = "auth.${var.domain_name}"
  user_pool_id = aws_cognito_user_pool.enplace.id
  # certificate_arn = aws_acm_certificate.enplace.arn
}

resource "aws_route53_record" "enplace_auth" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = "auth.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cognito_user_pool_domain.enplace.cloudfront_distribution
    zone_id                = aws_cognito_user_pool_domain.enplace.cloudfront_distribution_zone_id
    evaluate_target_health = false
  }
}
