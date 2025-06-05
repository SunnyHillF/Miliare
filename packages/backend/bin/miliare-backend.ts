#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PlaceholderStack } from '../lib/placeholder-stack';

const app = new cdk.App();

// This is a placeholder - no actual deployment will happen
new PlaceholderStack(app, 'MiliarePlaceholderStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2'
  },
  description: 'Placeholder stack for Miliare backend (not for deployment)'
});

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

const app = new cdk.App();

// Get the deployment branch from context or use a default
const branch = app.node.tryGetContext('branch') || 'dev';
const isProd = branch === 'prod';

// Set domain names based on branch
const restDomainName = isProd
  ? 'api.miliarereferral.com'
  : 'api-dev.miliarereferral.com';

// Get AWS account and region from current profile
const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;

if (!account || !region) {
  throw new Error('AWS account and region must be configured');
}

// Create the main stack with a prefix based on the branch
const prefix = isProd ? 'prod' : 'dev';

new MiliareBackendStack(app, `${prefix}-MiliareBackendStack`, {
  stackName: `${prefix}-MiliareBackend`,
  restDomainName,
  amplifyOutputsPath: './amplify_outputs.json', // Path to amplify outputs file
  env: {
    account,
    region
  }
});
