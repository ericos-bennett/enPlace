# Menu

A better way to save and follow recipes. Built with a serverless architecture on AWS (API Gateway, Lambdas, DynamoDB), the OpenAI API, React, and Terraform.

## Local Setup

1. [Sign up for an OpenAI API Key](https://platform.openai.com/docs/quickstart/account-setup) and export it as the `TF_VAR_openai_api_key` variable in your `.bashrc` or `.zshrc`
2. Ensure `docker` and `jq` are installed
3. Navigate to `/infra` and run `./local_stack_init.sh` to create a LocalStack container
4. Run `terraform init` and `./local_deploy.sh` to launch the backend and infrastructure services in the above container
5. Run `./local_frontend_config.sh` to save API environment variables in `/frontend/.env.local`
6. Run `./local_dynamo_import.sh` to populate the database with sample recipe data
7. Navigate to `/frontend` and run `npm install`
8. Launch the frontend with `npm run dev`
9. This project uses custom git hooks - you can enable them by navigating to `/cicd/git-hooks` and running `init.sh`
