import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('Payment REST API endpoints are configured', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that profile function has proper permissions to payments table
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

test('Profile function has environment variables for payments table', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that profile function has proper environment variables
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

test('REST API has payment resource endpoints', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that REST API is created
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'MiliareRestApi'
  });
  
  // Test that payment methods are configured with API key requirement
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ApiKeyRequired: true
  });
  
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    ApiKeyRequired: true
  });
  
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'PUT',
    ApiKeyRequired: true
  });
}); 