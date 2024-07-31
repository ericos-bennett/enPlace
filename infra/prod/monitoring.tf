resource "aws_iam_role" "metrics_report" {
  name = "metrics_report_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "metrics_report" {
  name = "metrics_report_policy"
  role = aws_iam_role.metrics_report.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect : "Allow",
        Action : "cloudwatch:GetMetricStatistics",
        Resource : "*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "metrics_report" {
  role       = aws_iam_role.metrics_report.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "metrics_report" {
  filename         = "${path.module}/metrics_report.zip"
  function_name    = "MetricsReport"
  role             = aws_iam_role.metrics_report.arn
  handler          = "main.handler"
  source_code_hash = filebase64sha256("${path.module}/metrics_report.zip")
  runtime          = "python3.12"
  timeout          = 30
  architectures    = ["arm64"]
  environment {
    variables = {
      USER_POOL_ID = aws_cognito_user_pool.enplace.id
    }
  }
}

resource "aws_lambda_permission" "metrics_report" {
  statement_id  = "AllowAPIGatewayInvokeMetricsReport"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.metrics_report.arn
  principal     = "apigateway.amazonaws.com"
}
