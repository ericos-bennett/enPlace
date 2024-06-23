#!/bin/bash
set -e

./docker_localstack.sh
./deploy_infra.sh
./frontend_config.sh
./dynamo_import.sh