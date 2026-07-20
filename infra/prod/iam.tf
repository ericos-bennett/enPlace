resource "aws_iam_role" "recipes" {
  name = "recipes_role"
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

resource "aws_iam_role_policy" "recipes" {
  name = "recipes_policy"
  role = aws_iam_role.recipes.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ],
        Resource = [
          aws_dynamodb_table.recipes.arn,
          "${aws_dynamodb_table.recipes.arn}/index/UserIdIndex"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ],
        Resource = aws_secretsmanager_secret.openai_api_key.arn
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "recipes" {
  role       = aws_iam_role.recipes.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
