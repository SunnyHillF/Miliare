#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment with AWS profile: ratediver${NC}"

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check for AWS profile
if ! aws configure list-profiles | grep -q "ratediver"; then
    echo -e "${RED}AWS profile 'ratediver' not found. Please configure it first.${NC}"
    exit 1
fi

# Check for amplify_outputs.json
if [ ! -f "amplify_outputs.json" ]; then
    echo -e "${RED}amplify_outputs.json not found. Creating a template file...${NC}"
    cat > amplify_outputs.json << EOL
{
  "auth": {
    "user_pool_id": "us-west-2_placeholder",
    "aws_region": "us-west-2",
    "user_pool_client_id": "placeholder",
    "identity_pool_id": "us-west-2:placeholder",
    "mfa_methods": [],
    "standard_required_attributes": [
      "email"
    ],
    "username_attributes": [
      "email"
    ],
    "user_verification_types": [
      "email"
    ],
    "groups": [
      {
        "admin": {
          "precedence": 0
        }
      }
    ],
    "mfa_configuration": "NONE",
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true,
      "require_uppercase": true
    },
    "unauthenticated_identities_enabled": true
  },
  "version": "1.3"
}
EOL
    echo -e "${RED}Template amplify_outputs.json created. Please update it with your actual values after deployment.${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    pnpm install
fi

# Build the project
echo -e "${YELLOW}Building the project...${NC}"
pnpm run build

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
pnpm test

# Build Go Lambda functions
if ! command -v go &> /dev/null; then
    echo -e "${RED}Go is not installed. Please install it first.${NC}"
    exit 1
fi

for dir in lambda/*; do
    if [ -d "$dir" ] && [ -f "$dir/main.go" ]; then
        echo -e "${YELLOW}Building Go Lambda in $dir...${NC}"
        (cd "$dir" && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o bootstrap main.go)
    fi
done

# Deploy using CDK
echo -e "${YELLOW}Deploying with CDK...${NC}"
deployment_output=$(AWS_PROFILE=ratediver pnpm cdk deploy --all --require-approval never)

# Extract endpoints from deployment output and update test-api.sh
echo -e "${YELLOW}Updating test-api.sh with deployed endpoints...${NC}"

# Extract REST API URL from deployment output
rest_api_url=$(echo "$deployment_output" | grep "RestApiEndpoint" | sed 's/.*= //')
graphql_api_url=$(echo "$deployment_output" | grep "GraphqlApiUrl" | sed 's/.*= //')

if [ ! -z "$rest_api_url" ] && [ ! -z "$graphql_api_url" ]; then
    echo -e "${YELLOW}Updating test-api.sh with new endpoints...${NC}"
    
    # Create backup
    cp test-api.sh test-api.sh.backup
    
    # Update API URLs in test-api.sh using perl for cross-platform compatibility
    perl -i -pe "s|API_BASE_URL=\"[^\"]*\"|API_BASE_URL=\"$rest_api_url\"|g" test-api.sh
    perl -i -pe "s|GRAPHQL_URL=\"[^\"]*\"|GRAPHQL_URL=\"$graphql_api_url\"|g" test-api.sh
    
    echo -e "${GREEN}Updated test-api.sh with:${NC}"
    echo -e "  REST API: $rest_api_url"
    echo -e "  GraphQL API: $graphql_api_url"
else
    echo -e "${YELLOW}Endpoints already up to date in test-api.sh${NC}"
fi

echo -e "${GREEN}Deployment completed successfully!${NC}" 