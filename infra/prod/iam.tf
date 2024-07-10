resource "aws_iam_role" "get_recipe" {
  name = "get_recipe_role"
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

resource "aws_iam_role_policy" "get_recipe" {
  name = "get_recipe_policy"
  role = aws_iam_role.get_recipe.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_recipe" {
  role       = aws_iam_role.get_recipe.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "get_recipes" {
  name = "get_recipes_role"
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

resource "aws_iam_role_policy" "get_recipes" {
  name = "get_recipes_policy"
  role = aws_iam_role.get_recipes.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query"
        ],
        Resource = [
          aws_dynamodb_table.recipes.arn,
          "${aws_dynamodb_table.recipes.arn}/index/UserIdIndex"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_recipes" {
  role       = aws_iam_role.get_recipes.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "create_recipe" {
  name = "create_recipe_role"
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

resource "aws_iam_role_policy" "create_recipe" {
  name = "create_recipe_policy"
  role = aws_iam_role.create_recipe.id
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
          aws_dynamodb_table.recipes.arn, "${aws_dynamodb_table.recipes.arn}/index/UserIdIndex"
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

resource "aws_iam_role_policy_attachment" "create_recipe" {
  role       = aws_iam_role.create_recipe.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
