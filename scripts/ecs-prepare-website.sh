#!/bin/bash
set -e

## There's a special version of the ecs-prepare script for next applications.

# Variables for color output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

PACKAGE_NAME="website"
echo -e "${GREEN}ecs-prepare-website.sh ${YELLOW}$PACKAGE_NAME${NC}"
cp -R ./public .next/standalone/apps/website
cp -R .next/static .next/standalone/apps/website/.next
find . -type f -name '*swc.node' -delete # https://github.com/vercel/next.js/issues/42641
echo -e "${GREEN}$PWD/.next/standalone/${NC}"

SCRIPT_DIR=$(dirname "$(realpath "$0")")
"$SCRIPT_DIR/ecs-push.sh" "website"
