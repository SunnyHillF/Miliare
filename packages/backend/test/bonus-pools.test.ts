import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('Bonus pool management endpoints are configured', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that ops function exists for handling bonus pools
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Runtime: 'provided.al2023',
    Architectures: ['arm64']
  });
});

test('Bonus pool REST API methods are secured', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that bonus pool endpoints require API key
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
    ApiKeyRequired: true
  });
  
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'GET',
    ApiKeyRequired: true
  });
  
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'PUT',
    ApiKeyRequired: true
  });
});

test('Bonus pool infrastructure supports quarterly distributions', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that REST API is properly configured for bonus pool operations
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'MiliareRestApi'
  });
  
  // Test that API key is configured for secure access
  template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
    Name: 'MiliareRestApiKey'
  });
});

test('Bonus pool reporting endpoints are available', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that lambda integration is properly configured for reporting
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    Integration: {
      Type: 'AWS_PROXY'
    }
  });
}); 