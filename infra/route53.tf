resource "aws_route53_zone" "enplace" {
  name = "enplace.xyz"
}

resource "aws_route53_record" "enpalce_fe" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = "www.${aws_route53_zone.enplace.name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.enplace_fe.domain_name
    zone_id                = aws_cloudfront_distribution.enplace_fe.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "enplace_api" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = aws_api_gateway_domain_name.enplace.domain_name
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.enplace.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.enplace.cloudfront_zone_id
    evaluate_target_health = false
  }
}