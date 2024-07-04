resource "aws_s3_bucket" "enplace" {
  bucket = "enplace-frontend"
}

resource "aws_s3_bucket_website_configuration" "enplace" {
  bucket = aws_s3_bucket.enplace.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_object" "enplace" {
  for_each     = fileset("${path.module}/frontend", "**/*")
  bucket       = aws_s3_bucket.enplace.id
  key          = each.value
  source       = "${path.module}/frontend/${each.value}"
  etag         = filemd5("${path.module}/frontend/${each.value}")
  content_type = "text/html"
}

resource "aws_s3_bucket_policy" "enplace" {
  bucket = aws_s3_bucket.enplace.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.enplace.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.enplace_fe.arn
          }
        }
      }
    ]
  })
}