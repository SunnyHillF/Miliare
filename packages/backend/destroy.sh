#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting stack destruction with AWS profile: ratediver${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}pnpm is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if the ratediver profile exists
if ! aws configure list-profiles | grep -q "ratediver"; then
    echo -e "${RED}AWS profile 'ratediver' not found. Please configure it first.${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
pnpm run build

# Destroy using CDK (all stacks)
echo -e "${YELLOW}Destroying all stacks with CDK...${NC}"
AWS_PROFILE=ratediver pnpm cdk destroy --all --force

echo -e "${GREEN}Stack destruction completed successfully!${NC}" 