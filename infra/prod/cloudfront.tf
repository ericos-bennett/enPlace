resource "aws_cloudfront_distribution" "enplace_fe" {
  enabled = true

  aliases = ["${var.domain_name}", "www.${var.domain_name}"]

  origin {
    origin_id                = "S3-enplace-frontend"
    domain_name              = aws_s3_bucket_website_configuration.enplace.website_endpoint
    origin_access_control_id = aws_cloudfront_origin_access_control.enplace_fe.id
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

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 5
  }

  depends_on = [aws_acm_certificate_validation.enplace]
}

resource "aws_cloudfront_origin_access_control" "enplace_fe" {
  name                              = "enplace-fe-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}