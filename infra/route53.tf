resource "aws_route53_zone" "enplace" {
  name = "enplace.xyz"
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.enplace.zone_id
  name    = "www.enplace.xyz"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.enplace.domain_name
    zone_id                = aws_cloudfront_distribution.enplace.hosted_zone_id
    evaluate_target_health = false
  }
}