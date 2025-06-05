#!/bin/bash

# Manual Amplify Gen 2 Environment Variables Setup
# Uses the known deployment values from the recent CDK deployment

set -e

# Configuration
AWS_PROFILE="ratediver"
AMPLIFY_APP_ID="d2rrg4ub4zb43t"
AWS_REGION="us-west-2"
BRANCH_NAME="main"

# Known deployment values from the recent deployment
REST_API_ENDPOINT="https://jqja8qlvh1.execute-api.us-west-2.amazonaws.com/prod"
GRAPHQL_API_URL="https://w5rleny6brhdjdgr2k7ni6fpoe.appsync-api.us-west-2.amazonaws.com/graphql"
API_KEY="dev-static-rest-api-key"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo "🚀 Manual Amplify Gen 2 Environment Setup"
echo "========================================="
echo

log_info "Configuration Summary:"
echo "  App ID: $AMPLIFY_APP_ID"
echo "  Branch: $BRANCH_NAME"
echo "  Region: $AWS_REGION"
echo
log_info "Environment Variables to Set:"
echo "  API_BASE_URL: $REST_API_ENDPOINT"
echo "  GRAPHQL_ENDPOINT: $GRAPHQL_API_URL"
echo "  REST_API_KEY: $API_KEY"
echo "  NODE_ENV: production"
echo

echo "Choose an option:"
echo "  1) Try automatic update via AWS CLI"
echo "  2) Show manual console instructions"
echo "  3) Cancel"
echo
read -p "Enter your choice (1/2/3): " -n 1 -r
echo

case $REPLY in
    1)
        log_info "Attempting to update environment variables via AWS CLI..."
        
        AWS_PROFILE=$AWS_PROFILE aws amplify update-branch \
            --app-id "$AMPLIFY_APP_ID" \
            --branch-name "$BRANCH_NAME" \
            --region "$AWS_REGION" \
            --environment-variables \
            "API_BASE_URL=$REST_API_ENDPOINT" \
            "GRAPHQL_ENDPOINT=$GRAPHQL_API_URL" \
            "REST_API_KEY=$API_KEY" \
            "NODE_ENV=production" \
            > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            log_success "Environment variables updated successfully via CLI!"
            
            # Trigger deployment
            log_info "Triggering new deployment..."
            job_id=$(AWS_PROFILE=$AWS_PROFILE aws amplify start-job \
                --app-id "$AMPLIFY_APP_ID" \
                --branch-name "$BRANCH_NAME" \
                --job-type RELEASE \
                --region "$AWS_REGION" \
                --query 'jobSummary.jobId' \
                --output text 2>/dev/null)
            
            if [ $? -eq 0 ] && [ "$job_id" != "None" ]; then
                log_success "Deployment triggered with job ID: $job_id"
                log_info "Monitor at: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID/$BRANCH_NAME/$job_id"
            else
                log_warning "Environment updated but couldn't trigger deployment automatically"
                log_info "Please trigger a deployment manually in the Amplify console"
            fi
            
            echo
            log_success "✨ Setup complete! Your frontend will be deployed with the new backend configuration."
        else
            log_warning "CLI update failed. Showing manual instructions..."
            echo
            # Fall through to manual instructions
            REPLY=2
        fi
        ;;
esac

if [ "$REPLY" = "2" ]; then
    echo
    log_info "Manual Setup Instructions:"
    echo "================================"
    echo
    echo "1. Go to the Amplify Console:"
    echo "   https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID"
    echo
    echo "2. Click on your app, then click on the '$BRANCH_NAME' branch"
    echo
    echo "3. Go to 'Environment variables' in the left sidebar"
    echo
    echo "4. Add these environment variables:"
    echo "   ┌─────────────────────┬────────────────────────────────────────────────────────────────┐"
    echo "   │ Variable Name       │ Value                                                          │"
    echo "   ├─────────────────────┼────────────────────────────────────────────────────────────────┤"
    echo "   │ API_BASE_URL        │ $REST_API_ENDPOINT        │"
    echo "   │ GRAPHQL_ENDPOINT    │ $GRAPHQL_API_URL │"
    echo "   │ REST_API_KEY        │ $API_KEY                                         │"
    echo "   │ NODE_ENV            │ production                                                     │"
    echo "   └─────────────────────┴────────────────────────────────────────────────────────────────┘"
    echo
    echo "5. Save the variables and trigger a new deployment by clicking 'Redeploy this version'"
    echo
    log_success "Configuration values are ready for manual setup!"
elif [ "$REPLY" = "3" ]; then
    log_warning "Setup cancelled by user."
    exit 0
elif [ "$REPLY" != "1" ]; then
    log_error "Invalid choice. Exiting."
    exit 1
fi 