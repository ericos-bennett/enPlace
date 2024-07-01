resource "aws_s3_bucket" "menu" {
  bucket = "menu-frontend"
}

resource "aws_s3_bucket_policy" "menu" {
  bucket = aws_s3_bucket.menu.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.menu.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.menu.arn
          }
        }
      }
    ]
  })

  depends_on = [ aws_cloudfront_distribution.menu ]
}