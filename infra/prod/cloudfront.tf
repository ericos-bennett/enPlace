resource "aws_cloudfront_distribution" "enplace_fe" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket_website_configuration.enplace.website_endpoint
    origin_id   = "S3-enplace-frontend"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    target_origin_id = "S3-enplace-frontend"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.enplace.arn
    ssl_support_method  = "sni-only"
  }

  depends_on = [aws_acm_certificate_validation.enplace]
}
