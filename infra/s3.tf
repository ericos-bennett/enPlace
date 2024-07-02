resource "aws_s3_bucket" "enplace" {
  bucket = "enplace-frontend"
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
            "AWS:SourceArn" = aws_cloudfront_distribution.enplace.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.enplace]
}