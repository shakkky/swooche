#!/bin/bash
set -euo pipefail

# Variables for color output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

PACKAGE_NAME=$1

export AWS_PROFILE=swooche
AWS_REGION=ap-southeast-2
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
TAG=$ECR/services:$PACKAGE_NAME

echo -e "${GREEN}Building $PACKAGE_NAME and pushing to $TAG...${NC}"

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR
docker build -t services:$PACKAGE_NAME $PWD
docker tag services:$PACKAGE_NAME $TAG

docker push $TAG
