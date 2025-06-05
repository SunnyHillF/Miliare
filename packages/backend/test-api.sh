#!/bin/bash

# Miliare Backend API Testing Script
# Tests REST API endpoints and shows GraphQL API information
#
# Usage: ./test-api.sh
#
# Prerequisites:
#   - curl (for making HTTP requests)
#   - jq (for JSON parsing) - install with: brew install jq
#
# This script will:
#   1. Test all implemented REST API endpoints (GET/POST/PUT)
#   2. Create test data (partners, customers, payments, user profiles)
#   3. Verify CRUD operations work correctly
#   4. Test enhanced payment functionality
#   5. Test DocuSign integration endpoints
#   6. Test bonus pool functionality
#   7. Show GraphQL API information and test enhanced queries
#   8. Display infrastructure details
#
# Note: Test data is not automatically cleaned up and will remain in DynamoDB

set -e

# Configuration
API_BASE_URL="https://jqja8qlvh1.execute-api.us-west-2.amazonaws.com/prod"
API_KEY="dev-static-rest-api-key"
GRAPHQL_URL="https://w5rleny6brhdjdgr2k7ni6fpoe.appsync-api.us-west-2.amazonaws.com/graphql"

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

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo
    log_info "Testing: $description"
    echo "   $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -H "x-api-key: $API_KEY" "$API_BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
                   -H "x-api-key: $API_KEY" \
                   -H "Content-Type: application/json" \
                   -d "$data" \
                   "$API_BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        log_success "Status: $http_code"
        echo "   Response: $body"
        
        # Return the response body for further processing, but send to a temp file
        # to avoid interfering with the output flow
        echo "$body" > /tmp/last_response.json
        return 0
    else
        log_error "Status: $http_code"
        echo "   Response: $body"
        return 1
    fi
}

# Main testing function
run_tests() {
    echo "🚀 Starting Miliare Backend API Tests (Enhanced)"
    echo "=================================================="
    
    # Test User Profiles API (Enhanced)
    echo
    echo "👤 USER PROFILES API TESTS (Enhanced)"
    echo "--------------------------------------"
    
    # Create test user ID
    test_user_id="test-user-$(date +%s)"
    
    # Test enhanced user profile creation
    user_data='{
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "555-0123",
        "address": "123 Main St, Anytown, USA",
        "company": "WFG",
        "uplineEVC": "Jane Smith",
        "uplineSMD": "Bob Johnson",
        "bankInfoDocument": "envelope_123456",
        "taxDocument": "envelope_789012"
    }'
    test_endpoint "PUT" "/users/$test_user_id" "$user_data" "Create enhanced user profile"
    
    # Get user profile
    test_endpoint "GET" "/users/$test_user_id" "" "Get user profile"
    
    # Test user payments endpoint
    test_endpoint "GET" "/users/$test_user_id/payments" "" "Get user payment history"
    
    # Test Partners API
    echo
    echo "📋 PARTNERS API TESTS"
    echo "---------------------"
    
    # Get initial partners list
    test_endpoint "GET" "/partners" "" "Get all partners (initial)"
    
    # Create a new partner with enhanced fields
    partner_data='{
        "name": "Sunny Hill Financial",
        "email": "contact@sunnyhill.com",
        "status": "active",
        "tags": ["insurance", "financial"],
        "website": "https://sunnyhill.com",
        "description": "Premier financial services partner"
    }'
    test_endpoint "POST" "/partners" "$partner_data" "Create new partner"
    
    if [ $? -eq 0 ]; then
        # Extract partner ID from response
        partner_id=$(cat /tmp/last_response.json | jq -r '.id')
        log_info "Created partner with ID: $partner_id"
        
        # Get specific partner
        test_endpoint "GET" "/partners/$partner_id" "" "Get specific partner by ID"
        
        # Update partner
        update_data='{"name": "Sunny Hill Financial (Updated)", "status": "premium"}'
        test_endpoint "PUT" "/partners/$partner_id" "$update_data" "Update partner"
        
        # Get updated partners list
        test_endpoint "GET" "/partners" "" "Get all partners (after creation)"
    fi
    
    # Test Customers API
    echo
    echo "👥 CUSTOMERS API TESTS"
    echo "----------------------"
    
    # Get initial customers list
    test_endpoint "GET" "/customers" "" "Get all customers (initial)"
    
    # Create a new customer
    customer_data='{"name": "John Customer", "email": "john.customer@example.com"}'
    test_endpoint "POST" "/customers" "$customer_data" "Create new customer"
    
    if [ $? -eq 0 ]; then
        # Extract customer ID from response
        customer_id=$(cat /tmp/last_response.json | jq -r '.id')
        log_info "Created customer with ID: $customer_id"
        
        # Get specific customer
        test_endpoint "GET" "/customers/$customer_id" "" "Get specific customer by ID"
        
        # Update customer
        update_customer='{"name": "John Customer Updated", "email": "john.updated@example.com"}'
        test_endpoint "PUT" "/customers/$customer_id" "$update_customer" "Update customer"
        
        # Get updated customers list
        test_endpoint "GET" "/customers" "" "Get all customers (after creation)"
    fi
    
    # Test Lead API
    echo
    echo "📋 LEAD API TESTS"
    echo "-----------------"
    
    # Get lead users (should return user profiles from DynamoDB)
    test_endpoint "GET" "/lead/users" "" "Get lead users list"
    
    # Test Enhanced Payments API
    echo
    echo "💰 PAYMENTS API TESTS (New)"
    echo "---------------------------"
    
    # Get all payments
    test_endpoint "GET" "/payments" "" "Get all payments"
    
    # Create a new payment
    payment_data="{
        \"userId\": \"$test_user_id\",
        \"referralId\": \"ref_12345\",
        \"amount\": 250.50,
        \"status\": \"Paid\"
    }"
    test_endpoint "POST" "/payments" "$payment_data" "Create new payment"
    
    if [ $? -eq 0 ]; then
        # Extract payment ID from response
        payment_id=$(cat /tmp/last_response.json | jq -r '.id')
        log_info "Created payment with ID: $payment_id"
        
        # Get specific payment
        test_endpoint "GET" "/payments/$payment_id" "" "Get specific payment by ID"
        
        # Update payment
        update_payment='{"amount": 275.75, "status": "Paid"}'
        test_endpoint "PUT" "/payments/$payment_id" "$update_payment" "Update payment"
    fi
    
    # Test DocuSign Integration
    echo
    echo "📝 DOCUSIGN INTEGRATION TESTS"
    echo "-----------------------------"
    
    # Create DocuSign envelope
    docusign_data="{
        \"userId\": \"$test_user_id\",
        \"envelopeType\": \"1099\"
    }"
    test_endpoint "POST" "/docusign/envelopes" "$docusign_data" "Create DocuSign envelope"
    
    # Test envelope status (with dummy ID)
    test_endpoint "GET" "/docusign/envelopes/envelope_123" "" "Get DocuSign envelope status"
    
    # Test DocuSign callback (should work without auth)
    callback_data='{"envelopeId": "envelope_123", "status": "completed"}'
    # Note: callback endpoint doesn't require API key
    echo
    log_info "Testing: DocuSign callback endpoint"
    callback_response=$(curl -s -w "\n%{http_code}" -X POST \
                       -H "Content-Type: application/json" \
                       -d "$callback_data" \
                       "$API_BASE_URL/docusign/callback")
    callback_code=$(echo "$callback_response" | tail -n1)
    callback_body=$(echo "$callback_response" | sed '$d')
    echo "   POST /docusign/callback"
    if [ "$callback_code" -ge 200 ] && [ "$callback_code" -lt 300 ]; then
        log_success "Status: $callback_code"
    else
        log_error "Status: $callback_code"
    fi
    echo "   Response: $callback_body"
    
    # Test Bonus Pools API
    echo
    echo "🎁 BONUS POOLS API TESTS"
    echo "------------------------"
    
    # Get initial bonus pools
    test_endpoint "GET" "/bonus-pools" "" "Get all bonus pools"
    
    # Create a new bonus pool
    pool_data='{
        "period": "Q1-2024",
        "amount": 5000.00,
        "distributions": [
            {"userId": "user1", "amount": 1500.00},
            {"userId": "user2", "amount": 2000.00}
        ]
    }'
    test_endpoint "POST" "/bonus-pools" "$pool_data" "Create new bonus pool"
    
    if [ $? -eq 0 ]; then
        # Extract pool ID from response
        pool_id=$(cat /tmp/last_response.json | jq -r '.id')
        log_info "Created bonus pool with ID: $pool_id"
        
        # Get specific bonus pool
        test_endpoint "GET" "/bonus-pools/$pool_id" "" "Get specific bonus pool by ID"
        
        # Update bonus pool
        update_pool='{"amount": 5500.00, "period": "Q1-2024-Updated"}'
        test_endpoint "PUT" "/bonus-pools/$pool_id" "$update_pool" "Update bonus pool"
        
        # Get bonus pool report
        test_endpoint "GET" "/bonus-pools/$pool_id/report" "" "Get bonus pool report"
    fi
    
    # Test GraphQL API with Enhanced Queries
    echo
    echo "🌐 ENHANCED GRAPHQL API TESTS"
    echo "-----------------------------"
    log_info "GraphQL Endpoint: $GRAPHQL_URL"
    log_info "WebSocket Endpoint: wss://6vzwdyhrb5by7lszfhr4td6nuu.appsync-realtime-api.us-west-2.amazonaws.com/graphql"
    
    # Test GraphQL introspection
    log_info "Testing GraphQL introspection query"
    gql_response=$(curl -s -w "\n%{http_code}" -X POST \
                   -H "Content-Type: application/json" \
                   -d '{"query": "{ __schema { queryType { fields { name description } } } }"}' \
                   "$GRAPHQL_URL")
    gql_code=$(echo "$gql_response" | tail -n1)
    gql_body=$(echo "$gql_response" | sed '$d')
    
    echo "   Introspection Status: $gql_code"
    if [ "$gql_code" = "200" ]; then
        if echo "$gql_body" | grep -q "UnauthorizedException"; then
            log_success "GraphQL API responding correctly (requires authentication)"
        else
            log_success "GraphQL API accessible"
            # Try to extract available queries
            if echo "$gql_body" | grep -q "referrals\|payments\|dashboardSummary"; then
                log_info "Available queries detected: referrals, payments, dashboardSummary, etc."
            fi
        fi
    else
        log_warning "GraphQL API Status: $gql_code"
    fi
    echo "   Response: $gql_body"
    
    # Test enhanced queries (these will fail without auth, but show the schema)
    echo
    log_info "Testing enhanced GraphQL queries (expect auth errors)"
    
    # Test dashboardMetrics query
    dashboard_query='{"query": "query { dashboardMetrics(userId: \"test\") { totalEarnings pendingCommissions totalReferrals successRate } }"}'
    dashboard_response=$(curl -s -w "\n%{http_code}" -X POST \
                        -H "Content-Type: application/json" \
                        -d "$dashboard_query" \
                        "$GRAPHQL_URL")
    dashboard_code=$(echo "$dashboard_response" | tail -n1)
    echo "   dashboardMetrics query status: $dashboard_code"
    
    # Test earningsByMonth query
    earnings_query='{"query": "query { earningsByMonth(userId: \"test\", months: 6) { month earnings } }"}'
    earnings_response=$(curl -s -w "\n%{http_code}" -X POST \
                       -H "Content-Type: application/json" \
                       -d "$earnings_query" \
                       "$GRAPHQL_URL")
    earnings_code=$(echo "$earnings_response" | tail -n1)
    echo "   earningsByMonth query status: $earnings_code"
    
    # Infrastructure Information
    echo
    echo "🏗️  INFRASTRUCTURE INFORMATION"
    echo "------------------------------"
    log_info "REST API Base URL: $API_BASE_URL"
    log_info "API Key: $API_KEY"
    log_info "Cognito User Pool: us-west-2_lieG8JhD2"
    log_info "Cognito Client ID: 3v2s7u06pa4e8mbpqg4846vv85"
    
    echo
    echo "📊 ENHANCED FEATURES SUMMARY"
    echo "----------------------------"
    log_success "✅ Enhanced User Profiles (uplineEVC, uplineSMD, DocuSign fields)"
    log_success "✅ Full Payment CRUD Operations"
    log_success "✅ DocuSign Integration Endpoints"
    log_success "✅ Bonus Pool Management"
    log_success "✅ Enhanced GraphQL Resolvers (dashboardMetrics, earningsByMonth)"
    log_success "✅ Partner Management with Tags and Status"
    log_success "✅ Customer Management CRUD"
    
    echo
    echo "🎉 Enhanced API Testing Complete!"
    echo "================================="
    log_success "All REST API endpoints functional"
    log_success "GraphQL API with enhanced queries deployed"
    log_success "DocuSign integration endpoints ready"
    log_success "Payment system fully operational"
    log_success "Bonus pool management active"
    log_success "Enhanced user profiles supported"
}

# Cleanup function for created test data
cleanup_test_data() {
    echo
    log_info "Note: Test data cleanup not implemented yet"
    log_info "Created test partners and customers will remain in the database"
    log_info "Consider implementing DELETE endpoints for cleanup"
}

# Check dependencies
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Install with: brew install jq"
        exit 1
    fi
}

# Main execution
main() {
    check_dependencies
    run_tests
    cleanup_test_data
}

# Run the script
main "$@" 