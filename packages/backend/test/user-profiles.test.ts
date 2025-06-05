import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('Enhanced user profile infrastructure is configured', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that user profile table exists
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    BillingMode: 'PAY_PER_REQUEST',
    KeySchema: [
      {
        AttributeName: 'PK',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'SK',
        KeyType: 'RANGE'
      }
    ]
  });
});

test('Profile function has proper environment variables', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that profile function has both user profile and payments table access
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Environment: {
      Variables: {
        USER_PROFILE_TABLE: {},
        PAYMENTS_TABLE: {}
      }
    }
  });
});

test('User profile endpoints support enhanced fields', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that profile function has proper DynamoDB permissions for CRUD operations
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

test('User profile REST endpoints are secured with API key', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that user profile endpoints require API key
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ApiKeyRequired: true
  });
  
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'PUT',
    ApiKeyRequired: true
  });
}); 