provider "aws" {
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
  region                      = "us-east-1"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    dynamodb = "http://localhost:4566"
    lambda   = "http://localhost:4566"
    iam      = "http://localhost:4566"
  }
}


resource "aws_lambda_function" "get_recipes" {
  filename         = "${path.module}/localstack/get_recipes.zip"
  function_name    = "GetRecipes"
  role             = aws_iam_role.get_recipes_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/localstack/get_recipes.zip")
  runtime          = "nodejs14.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION = "us-east-1"
    }
  }
}

resource "aws_iam_role" "get_recipes_role" {
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

resource "aws_iam_role_policy" "get_recipes_policy" {
  name = "get_recipes_policy"
  role = aws_iam_role.get_recipes_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "get_recipes_role_policy_attach" {
  role       = aws_iam_role.get_recipes_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_lambda_function" "create_recipe" {
  filename         = "${path.module}/localstack/create_recipe.zip"
  function_name    = "CreateRecipe"
  role             = aws_iam_role.create_recipe_role.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/localstack/create_recipe.zip")
  runtime          = "nodejs14.x"
  timeout          = 30
  environment {
    variables = {
      AWS_REGION = "us-east-1"
    }
  }
}

resource "aws_iam_role" "create_recipe_role" {
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

resource "aws_iam_role_policy" "create_recipe_policy" {
  name = "create_recipe_policy"
  role = aws_iam_role.create_recipe_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
        ],
        Resource = aws_dynamodb_table.recipes.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "create_recipe_role_policy_attach" {
  role       = aws_iam_role.create_recipe_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


resource "aws_dynamodb_table" "recipes" {
  name         = "Recipes"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "UserId"
  range_key = "Timestamp"

  attribute {
    name = "UserId"
    type = "N"
  }

  attribute {
    name = "Timestamp"
    type = "N"
  }
}
