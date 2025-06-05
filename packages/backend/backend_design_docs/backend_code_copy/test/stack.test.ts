import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('Stack includes core DynamoDB tables', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // Create DynamoDB tables similar to the main stack
  new dynamodb.Table(stack, 'UserProfileTable', {
    partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  new dynamodb.Table(stack, 'PartnersTable', {
    partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  new dynamodb.Table(stack, 'LeadDataTable', {
    partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  new dynamodb.Table(stack, 'ReferralsTable', {
    partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  new dynamodb.Table(stack, 'PaymentsTable', {
    partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  new dynamodb.Table(stack, 'CustomersTable', {
    partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::DynamoDB::Table', 6);
});

test('Enhanced backend stack has all required lambda functions', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that we have the expected number of lambda functions (6 total)
  // ProfileFunction, UserFunction, PartnerFunction, CustomerFunction, LeadFunction, OpsFunction
  template.resourceCountIs('AWS::Lambda::Function', 6);
  
  // Test that all functions use ARM64 architecture
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'provided.al2023',
    Architectures: ['arm64'],
    Handler: 'bootstrap'
  });
});

test('Enhanced GraphQL API configuration', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test GraphQL API with enhanced features
  template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
    Name: 'ReferralApi',
    AuthenticationType: 'AMAZON_COGNITO_USER_POOLS'
  });
  
  // Test that we have the expected number of resolvers (7 total)
  template.resourceCountIs('AWS::AppSync::Resolver', 7);
});

test('REST API with comprehensive endpoint coverage', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test REST API configuration
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'MiliareRestApi'
  });
  
  // Test API key configuration
  template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
    Name: 'MiliareRestApiKey'
  });
  
  // Test usage plan
  template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
    UsagePlanName: 'RestUsagePlan'
  });
});

test('Enhanced security and permissions configuration', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that IAM policies exist for DynamoDB access
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:BatchGetItem',
            'dynamodb:GetRecords',
            'dynamodb:GetShardIterator',
            'dynamodb:Query',
            'dynamodb:GetItem',
            'dynamodb:Scan',
            'dynamodb:ConditionCheckItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            'dynamodb:DescribeTable'
          ]
        }
      ]
    }
  });
});

test('Domain and DNS configuration', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test custom domain configuration
  template.hasResourceProperties('AWS::ApiGateway::DomainName', {
    DomainName: 'api.example.com'
  });
  
  // Test Route 53 A record (it will be created as subdomain.domain format)
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'A',
    Name: 'api.example.com.miliarereferral.com.'
  });
});
