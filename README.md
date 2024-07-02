# enPlace

A better way to save and follow recipes. Built with a serverless architecture on AWS (API Gateway, Lambdas, DynamoDB), the OpenAI API, React, and Terraform.

## Local Setup

1. [Sign up for an OpenAI API Key](https://platform.openai.com/docs/quickstart/account-setup) and export it as the `TF_VAR_openai_api_key` variable in your `.bashrc` or `.zshrc`
2. Ensure [docker](https://docs.docker.com/get-docker/), [jq](https://jqlang.github.io/jq/), and [deterministic-zip](https://github.com/timo-reymann/deterministic-zip) are installed
3. Navigate to `/infra` and run `terraform init`
4. Navigate to `/infra/local` and run `init.sh` to launch the backend services in a LocalStack contaner
5. Navigate to `/frontend` and run `npm install`
6. Launch the frontend with `npm run dev`
7. This project uses custom git hooks - you can enable them by navigating to `.githooks` and running `init.sh`
