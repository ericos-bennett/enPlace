# Menu

A better way to follow recipes found online

## Local Setup

1. [Sign up for an OpenAI API Key](https://platform.openai.com/docs/quickstart/account-setup) and export it as the `TF_VAR_openai_api_key` variable in your `.bashrc` or `.zshrc`
2. Ensure `docker` and `jq` are installed
3. Navigate to `/infra` and run `./local_stack_init.sh` to create a LocalStack container
4. Run `terraform init` and `./local_deploy.sh` to launch the backend and infrastructure services in the above container
5. Run `./local_frontend_config.sh` to save API environment variables in `/frontend/.env.local`
6. Navigate to `/frontend` and run `npm install`
7. Launch the frontend with `npm run dev`
8. This project uses custom git hooks - you can enable them by navigating to `/cicd/git-hooks` and running `init.sh`
