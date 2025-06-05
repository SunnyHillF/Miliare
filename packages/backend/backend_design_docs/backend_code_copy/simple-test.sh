#!/bin/bash

API_BASE_URL="https://jqja8qlvh1.execute-api.us-west-2.amazonaws.com/prod"
API_KEY="dev-static-rest-api-key"

echo "🚀 Quick API Test Summary"
echo "========================="
echo

# Test key endpoints
echo "📋 Testing core endpoints:"

endpoints=(
    "GET /partners Partners"
    "GET /customers Customers" 
    "GET /payments Payments"
    "GET /lead/users Lead-Users"
    "GET /bonus-pools Bonus-Pools"
)

for endpoint in "${endpoints[@]}"; do
    method=$(echo $endpoint | cut -d' ' -f1)
    path=$(echo $endpoint | cut -d' ' -f2)
    name=$(echo $endpoint | cut -d' ' -f3)
    
    echo -n "  $name: "
    status=$(curl -s -w "%{http_code}" -o /dev/null -H "x-api-key: $API_KEY" "$API_BASE_URL$path")
    
    if [ "$status" -eq 200 ]; then
        echo "✅ $status"
    else
        echo "❌ $status"
    fi
done

echo
echo "🔍 Quick functionality test:"

# Test user creation
echo -n "  Create User: "
status=$(curl -s -w "%{http_code}" -o /dev/null -X PUT \
    -H "x-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com"}' \
    "$API_BASE_URL/users/quick-test-user")

if [ "$status" -eq 200 ]; then
    echo "✅ $status"
else
    echo "❌ $status"
fi

echo
echo "✨ Test completed!" 