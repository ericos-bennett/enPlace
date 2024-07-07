resource "aws_dynamodb_table" "recipes" {
  name           = "Recipes"
  billing_mode   = "PROVISIONED"
  read_capacity  = 15
  write_capacity = 15

  hash_key  = "Id"
  range_key = "CreatedAt"

  attribute {
    name = "Id"
    type = "S"
  }

  attribute {
    name = "CreatedAt"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "N"
  }

  attribute {
    name = "SourceUrl"
    type = "S"
  }

  global_secondary_index {
    name           = "UserIdIndex"
    read_capacity  = 10
    write_capacity = 10

    hash_key           = "UserId"
    range_key          = "SourceUrl"
    projection_type    = "INCLUDE"
    non_key_attributes = ["name"]
  }
}
