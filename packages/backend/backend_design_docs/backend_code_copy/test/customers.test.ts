import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

test('Customers lambda and resource created', () => {
  const app = new cdk.App();
  const stack = new MiliareBackendStack(app, 'TestStack', {
    restDomainName: 'api.example.com',
    hostedZoneId: 'Z1111111111',
    env: { account: '111111111111', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'bootstrap',
    Environment: {
      Variables: {
        CUSTOMERS_TABLE: {}
      }
    }
  });
});
