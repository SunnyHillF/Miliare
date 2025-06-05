#!/bin/bash
set -e

# Script to build all Go Lambda functions for deployment to AWS Lambda

# Print colored output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Go Lambda functions...${NC}"

# Create build directory if it doesn't exist
BUILD_DIR="./dist/lambda"
mkdir -p $BUILD_DIR

# Set Go environment for AWS Lambda (Linux)
export GOOS=linux
export GOARCH=amd64
export CGO_ENABLED=0

# Get the list of lambda directories
LAMBDA_DIRS=(
  "customer"
  "lead"
  "ops"
  "partner"
  "profile"
  "user"
)

# Track build status
BUILD_SUCCESS=true

# Function to build a single Lambda function
build_lambda() {
  local dir=$1
  local function_dir="./lambda/$dir"
  
  if [ ! -d "$function_dir" ]; then
    echo -e "${YELLOW}Warning: Directory $function_dir does not exist, skipping...${NC}"
    return 0
  fi
  
  echo -e "${GREEN}Building Lambda function: $dir${NC}"
  
  # Check if there are any .go files in the directory
  if [ -z "$(find $function_dir -name '*.go' -type f -print -quit)" ]; then
    echo -e "${YELLOW}Warning: No Go files found in $function_dir, skipping...${NC}"
    return 0
  fi
  
  # Create output directory
  mkdir -p "$BUILD_DIR/$dir"
  
  # Build the Lambda function from within its directory
  echo "Building Lambda function in $function_dir..."
  
  # Save current directory
  CURRENT_DIR=$(pwd)
  
  # Change to function directory for building
  cd "$function_dir"
  
  # Initialize go module if it doesn't exist
  if [ ! -f "go.mod" ]; then
    echo "Initializing Go module for $dir..."
    go mod init "$dir"
    # Add required dependencies
    cat > go.mod <<EOL
module $dir

go 1.24

require (
    github.com/aws/aws-lambda-go v1.49.0
    github.com/aws/aws-sdk-go-v2 v1.30.0
    github.com/aws/aws-sdk-go-v2/config v1.27.2
    github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.13.9
    github.com/aws/aws-sdk-go-v2/service/dynamodb v1.30.4
    github.com/google/uuid v1.3.1
)
EOL
    go mod tidy
  fi
  
  # Build the binary
  if go build -ldflags="-s -w" -o "../../$BUILD_DIR/$dir/bootstrap" .; then
    echo -e "${GREEN}Successfully built $dir Lambda function${NC}"
    # Return to original directory
    cd "$CURRENT_DIR"
    return 0
  else
    echo -e "${RED}Failed to build $dir Lambda function${NC}"
    BUILD_SUCCESS=false
    # Return to original directory
    cd "$CURRENT_DIR"
    return 1
  fi
}

# Build each Lambda function
for dir in "${LAMBDA_DIRS[@]}"; do
  build_lambda "$dir" || true  # Continue to next function even if this one fails
done

# Check overall build status
if [ "$BUILD_SUCCESS" = true ]; then
  echo -e "${GREEN}All Lambda functions built successfully!${NC}"
  exit 0
else
  echo -e "${RED}Some Lambda functions failed to build. Check the logs above for details.${NC}"
  exit 1
fi
