#!/bin/bash

# Container Testing Script
# For use in isolated environments without internet access

set -e

echo "🐳 Running tests in isolated container mode..."
echo ""

# Function to run Go vet in offline mode
echo "🔍 Running Go vet in offline mode..."
for dir in lambda/*/; do
  if [ -d "$dir" ]; then
    echo "  Vetting $(basename "$dir")..."
    (cd "$dir" && GOPROXY=off go vet ./...)
  fi
done
echo "✅ Go vet completed successfully"
echo ""

# Run Jest tests with bundling disabled
echo "🧪 Running Jest tests with SKIP_BUNDLING=1..."
SKIP_BUNDLING=1 npx jest --runInBand
echo "✅ All tests completed successfully"
echo ""

# Optional: Build without Go compilation
if [ "$1" = "--build" ]; then
  echo "🏗️  Building with SKIP_BUNDLING=1..."
  SKIP_BUNDLING=1 pnpm run build
  echo "✅ Build completed successfully"
  echo ""
  
  echo "📦 Synthesizing CloudFormation..."
  SKIP_BUNDLING=1 pnpm run synth
  echo "✅ CloudFormation synthesis completed"
fi

echo "🎉 Container testing complete!" 