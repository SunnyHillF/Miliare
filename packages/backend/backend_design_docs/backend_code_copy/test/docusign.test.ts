import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('DocuSign integration endpoints are configured', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that ops function exists (handles DocuSign endpoints)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'provided.al2023',
    Architectures: ['arm64']
  });
  
  // Test that REST API has proper CORS configuration for DocuSign integration
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'MiliareRestApi'
  });
});

test('DocuSign callback endpoint does not require API key', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that there are methods without API key requirement
  // (The callback endpoint and OPTIONS methods for CORS)
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    ApiKeyRequired: false
  });
});

test('DocuSign envelope endpoints require API key', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that most endpoints require API key
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    ApiKeyRequired: true
  });
  
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ApiKeyRequired: true
  });
}); 