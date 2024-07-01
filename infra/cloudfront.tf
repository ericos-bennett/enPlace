resource "aws_cloudfront_origin_access_control" "menu" {
  name                              = "menu-frontend"
  description                       = "Origin Access Control for the Menu Frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "menu" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.menu.bucket_regional_domain_name
    origin_id   = "S3-menu-frontend"

    origin_access_control_id = aws_cloudfront_origin_access_control.menu.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]

    target_origin_id = "S3-menu-frontend"

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
    cloudfront_default_certificate = true
  }
}
