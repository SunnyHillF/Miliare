#!/bin/bash

# Amplify Gen 2 Environment Variables Update Script
# Updates the Miliare frontend app with backend deployment configuration
#
# Usage: ./update-amplify-env.sh
#
# This script will:
#   1. Extract deployment outputs from CDK stack
#   2. Set environment variables in Amplify Gen 2 app
#   3. Trigger a new deployment
#
# Prerequisites:
#   - AWS CLI configured with ratediver profile
#   - Access to Amplify Gen 2 app d2rrg4ub4zb43t
#
# Note: If CLI update fails, variables can be set manually in Amplify console

set -e

# Configuration
AWS_PROFILE="ratediver"
AMPLIFY_APP_ID="d2rrg4ub4zb43t"
AWS_REGION="us-west-2"
BRANCH_NAME="main"
CDK_STACK_NAME="dev-MiliareBackend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws configure list-profiles | grep -q "$AWS_PROFILE"; then
        log_error "AWS profile '$AWS_PROFILE' not found. Please configure it first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Get stack outputs
get_stack_outputs() {
    log_info "Retrieving CDK stack outputs..."
    
    local outputs=$(AWS_PROFILE=$AWS_PROFILE aws cloudformation describe-stacks \
        --stack-name "$CDK_STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs' \
        --output json 2>/dev/null)
    
    if [ $? -ne 0 ] || [ "$outputs" = "null" ]; then
        log_error "Failed to retrieve stack outputs. Ensure the stack '$CDK_STACK_NAME' exists."
        exit 1
    fi
    
    echo "$outputs"
}

# Extract specific output value
extract_output_value() {
    local outputs="$1"
    local key="$2"
    
    echo "$outputs" | jq -r ".[] | select(.OutputKey==\"$key\") | .OutputValue" 2>/dev/null || echo ""
}

# Update Amplify Gen 2 environment variables
update_amplify_env() {
    local rest_api_endpoint="$1"
    local graphql_api_url="$2"
    local api_key="$3"
    
    log_info "Updating Amplify Gen 2 environment variables..."
    
    # For Amplify Gen 2, we need to update the branch environment variables
    AWS_PROFILE=$AWS_PROFILE aws amplify update-branch \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --region "$AWS_REGION" \
        --environment-variables \
        "API_BASE_URL=$rest_api_endpoint" \
        "GRAPHQL_ENDPOINT=$graphql_api_url" \
        "REST_API_KEY=$api_key" \
        "NODE_ENV=production" \
        > /dev/null
    
    if [ $? -eq 0 ]; then
        log_success "Environment variables updated successfully"
    else
        log_warning "Failed to update via CLI. You may need to set these manually in the Amplify console."
        log_info "Go to: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID/settings/variables"
        echo
        log_info "Set these variables manually:"
        echo "  API_BASE_URL = $rest_api_endpoint"
        echo "  GRAPHQL_ENDPOINT = $graphql_api_url"
        echo "  REST_API_KEY = $api_key"
        echo "  NODE_ENV = production"
        return 1
    fi
}

# Trigger new deployment
trigger_deployment() {
    log_info "Triggering new Amplify deployment..."
    
    local job_id=$(AWS_PROFILE=$AWS_PROFILE aws amplify start-job \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --job-type RELEASE \
        --region "$AWS_REGION" \
        --query 'jobSummary.jobId' \
        --output text 2>/dev/null)
    
    if [ $? -eq 0 ] && [ "$job_id" != "None" ]; then
        log_success "Deployment triggered with job ID: $job_id"
        log_info "Monitor deployment at: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID/$BRANCH_NAME/$job_id"
    else
        log_warning "Failed to trigger deployment. You may need to deploy manually."
    fi
}

# Display configuration summary
display_summary() {
    local rest_api_endpoint="$1"
    local graphql_api_url="$2"
    local api_key="$3"
    
    echo
    log_info "Configuration Summary:"
    echo "  App ID: $AMPLIFY_APP_ID"
    echo "  Branch: $BRANCH_NAME"
    echo "  Region: $AWS_REGION"
    echo
    log_info "Environment Variables Set:"
    echo "  API_BASE_URL: $rest_api_endpoint"
    echo "  GRAPHQL_ENDPOINT: $graphql_api_url"
    echo "  REST_API_KEY: $api_key"
    echo "  NODE_ENV: production"
    echo
    log_info "Note: Cognito configuration is managed by Amplify Gen 2"
}

# Main execution
main() {
    echo "🚀 Amplify Environment Variables Update"
    echo "======================================="
    echo
    
    check_prerequisites
    
    # Get stack outputs
    local outputs=$(get_stack_outputs)
    
    # Extract required values (Cognito is managed by Amplify Gen 2)
    local rest_api_endpoint=$(extract_output_value "$outputs" "RestApiEndpoint0551178A")
    local graphql_api_url=$(extract_output_value "$outputs" "GraphqlApiUrl")  
    local api_key=$(extract_output_value "$outputs" "RestApiKeyOutput")
    
    # Validate extracted values
    if [ -z "$rest_api_endpoint" ] || [ -z "$graphql_api_url" ] || [ -z "$api_key" ]; then
        log_error "Failed to extract required stack outputs. Check stack deployment."
        log_info "Available outputs:"
        echo "$outputs" | jq -r '.[].OutputKey' | sed 's/^/  /'
        exit 1
    fi
    
    # Remove trailing slash from REST API endpoint if present
    rest_api_endpoint=$(echo "$rest_api_endpoint" | sed 's|/$||')
    
    display_summary "$rest_api_endpoint" "$graphql_api_url" "$api_key"
    
    echo
    echo "Choose an option:"
    echo "  1) Try automatic update via AWS CLI (may not work for all Gen 2 setups)"
    echo "  2) Show manual console instructions"
    echo "  3) Cancel"
    echo
    read -p "Enter your choice (1/2/3): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            update_amplify_env "$rest_api_endpoint" "$graphql_api_url" "$api_key"
            if [ $? -eq 0 ]; then
                trigger_deployment
                echo
                log_success "✨ Amplify environment variables updated successfully!"
                log_info "Your frontend app will be deployed with the new backend configuration."
            fi
            ;;
        2)
            echo
            log_info "Manual Setup Instructions:"
            echo "================================"
            echo
            echo "1. Go to the Amplify Console:"
            echo "   https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID"
            echo
            echo "2. Click on your app, then go to 'Environment variables' in the left sidebar"
            echo
            echo "3. Add these environment variables:"
            echo "   API_BASE_URL = $rest_api_endpoint"
            echo "   GRAPHQL_ENDPOINT = $graphql_api_url"
            echo "   REST_API_KEY = $api_key"
            echo "   NODE_ENV = production"
            echo
            echo "4. Save the variables and trigger a new deployment"
            echo
            log_success "Configuration values are ready for manual setup!"
            ;;
        3)
            log_warning "Update cancelled by user."
            exit 0
            ;;
        *)
            log_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
}

# Run the script
main "$@" 