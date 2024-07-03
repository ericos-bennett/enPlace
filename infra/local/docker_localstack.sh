#!/bin/bash
set -e

# Create the localstack docker network if it doesn't exist
NETWORK_NAME="localstack-network"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo ">>> Network $NETWORK_NAME does not exist, creating it"
  docker network create $NETWORK_NAME
  echo ">>> Network $NETWORK_NAME created"
else
  echo ">>> Network $NETWORK_NAME already exists"
fi

# Delete the localstack container if it exists
CONTAINER_NAME="localstack"
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo ">>> Stopping and removing the container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME
    echo ">>> Container $CONTAINER_NAME removed"
else
    echo ">>> Container $CONTAINER_NAME does not exist"
fi

# Start localstack container
echo ">>> Starting localstack docker container"
docker run -d \
    --name $CONTAINER_NAME \
    --network $NETWORK_NAME \
    -p 4566:4566 -p 4571:4571 \
    -e SERVICES=iam,apigateway,secretsmanager,lambda,dynamodb,logs \
    -e DEBUG=1 \
    -e LAMBDA_EXECUTOR=docker \
    -v /var/run/docker.sock:/var/run/docker.sock \
    localstack/localstack
echo ">>> Localstack docker container is running"