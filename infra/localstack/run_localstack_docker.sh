docker run -d \
    --name localstack \
    --network localstack-network \
    -p 4566:4566 -p 4571:4571 \
    -e SERVICES=dynamodb,lambda,iam \
    -e DEBUG=1 \
    -e LAMBDA_EXECUTOR=docker \
    -v /var/run/docker.sock:/var/run/docker.sock \
    localstack/localstack