resource "aws_s3_bucket" "enplace" {
  bucket = "enplace-frontend"
}

resource "aws_s3_bucket_website_configuration" "enplace" {
  bucket = aws_s3_bucket.enplace.id

  index_document {
    suffix = "index.html"
  }
}

module "template_files" {
  source   = "hashicorp/dir/template"
  base_dir = "${path.module}/frontend"
}

resource "aws_s3_object" "enplace" {
  for_each     = module.template_files.files
  bucket       = aws_s3_bucket.enplace.id
  source       = each.value.source_path
  key          = each.key
  content      = each.value.content
  content_type = each.value.content_type
  etag         = each.value.digests.md5
}

resource "aws_s3_bucket_policy" "enplace" {
  bucket = aws_s3_bucket.enplace.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.enplace.arn}/*",
        Condition = {
          StringEquals = {
            "aws:Referer" = var.cloudfront_referer_header
          }
        }
      }
    ]
  })
}