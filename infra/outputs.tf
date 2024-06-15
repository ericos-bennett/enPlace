output "api_id" {
  value = aws_api_gateway_rest_api.menu_api.id
}

output "stage_name" {
  value = aws_api_gateway_deployment.menu_api_deployment.stage_name
}
