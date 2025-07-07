#!/bin/bash
set -e

## This script prepares the ECS deployment by building the project and pushing it to ECR (Express APIs, etc)
## Useful for applications deployed on AWS ECS. There's a special version of this script for next applications.

# Variables for color output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

PACKAGE_NAME=$(jq -r '.name' package.json)

echo -e "${GREEN}ecs-prepare.sh ${YELLOW}$PACKAGE_NAME${NC}"
pnpm --filter="$PACKAGE_NAME" --prod --no-optional --ignore-scripts --force --legacy deploy dist
echo -e "${GREEN}Dist folder with {${YELLOW}$(ls -C "$PWD"/dist)${GREEN}} created in $PWD/dist${NC}"

SCRIPT_DIR=$(dirname "$(realpath "$0")")
"$SCRIPT_DIR/ecs-push.sh" $PACKAGE_NAME
