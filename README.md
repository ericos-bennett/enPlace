# Menu
A better way to follow recipes found online

## Local Setup
1. Ensure `docker` and `jq` are installed
3. Navigate to `/infra` and run `./local_stack_init.sh` to create a LocalStack container
4. Run `terraform init` and `./local_deploy.sh` to launch the backend and infrastructure services in the above container
5. Run `./local_frontend_config.sh` to save API environment variables in `/frontend/.env.local`
5. Navigate to `/frontend` and run `npm install`
6. Launch the frontend with `npm run dev`
