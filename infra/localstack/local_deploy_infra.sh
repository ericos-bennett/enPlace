# Check if the network exists
NETWORK_NAME="localstack-network"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "Network $NETWORK_NAME does not exist. Creating it..."
  docker network create $NETWORK_NAME
  echo "Network $NETWORK_NAME created."
else
  echo "Network $NETWORK_NAME already exists."
fi


# Delete localstack container
CONTAINER_NAME="localstack"
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing the running container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
    echo "Container $CONTAINER_NAME stopped and removed."
else
    echo "Container $CONTAINER_NAME is not running."
fi
    docker rm $CONTAINER_NAME    


# Update lambda zips
echo "Updating lambda code"
cd ../../backend/lambdas/create_recipe
zip -r ../../../infra/localstack/create_recipe.zip .
cd ../get_recipes
zip -r ../../../infra/localstack/get_recipes.zip .
cd ../../../infra/localstack
echo "Lambda code updated"

# Start localstack container
echo "Run localstack docker container"
bash ./run_localstack_docker.sh
echo "Localstack docker container is running"

# Apply terraform
echo "Applying terraform locally"
cd ..
terraform apply -auto-approve
echo "Terraform applied!"