import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('GraphQL resolvers configured', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test total resolver count (should be 7 with current configuration)
  template.resourceCountIs('AWS::AppSync::Resolver', 7);
});

test('Enhanced GraphQL resolvers have correct configuration', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that dashboardMetrics resolver exists
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    TypeName: 'Query',
    FieldName: 'dashboardMetrics'
  });
  
  // Test that earningsByMonth resolver exists
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    TypeName: 'Query',
    FieldName: 'earningsByMonth'
  });
  
  
  // Test that referrals resolver exists
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    TypeName: 'Query',
    FieldName: 'referrals'
  });
  
  // Test that payments resolver exists
  template.hasResourceProperties('AWS::AppSync::Resolver', {
    TypeName: 'Query',
    FieldName: 'payments'
  });
});

test('GraphQL API has proper authentication configuration', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  
  // Test that GraphQL API exists with proper authentication
  template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
    Name: 'ReferralApi',
    AuthenticationType: 'AMAZON_COGNITO_USER_POOLS'
  });
});
