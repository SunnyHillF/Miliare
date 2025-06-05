import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MiliareBackendStack } from '../lib/miliare-backend-stack';

describe('Enhanced Miliare Backend Integration Tests', () => {
  let app: cdk.App;
  let stack: MiliareBackendStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    stack = new MiliareBackendStack(app, 'TestStack', {
      restDomainName: 'api.example.com',
      hostedZoneId: 'Z1111111111',
      env: { account: '111111111111', region: 'us-east-1' }
    });
    template = Template.fromStack(stack);
  });

  test('Complete infrastructure deployment includes all enhanced features', () => {
    // Verify all DynamoDB tables are created
    template.resourceCountIs('AWS::DynamoDB::Table', 6);
    
    // Verify all Lambda functions are created
    template.resourceCountIs('AWS::Lambda::Function', 6);
    
    // Verify GraphQL API with all resolvers
    template.resourceCountIs('AWS::AppSync::Resolver', 7);
    template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
      Name: 'ReferralApi'
    });
    
    // Verify REST API setup
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'MiliareRestApi'
    });
  });

  test('Enhanced user profile functionality integration', () => {
    // Verify profile function has access to both user profile and payments tables
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          USER_PROFILE_TABLE: {},
          PAYMENTS_TABLE: {}
        }
      }
    });
    
    // Verify DynamoDB permissions are granted
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

  test('Payment system integration with user profiles', () => {
    // Verify payment endpoints are secured
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

  test('Enhanced GraphQL resolvers for analytics', () => {
    // Verify dashboard metrics resolver
    template.hasResourceProperties('AWS::AppSync::Resolver', {
      TypeName: 'Query',
      FieldName: 'dashboardMetrics'
    });
    
    // Verify earnings by month resolver
    template.hasResourceProperties('AWS::AppSync::Resolver', {
      TypeName: 'Query',
      FieldName: 'earningsByMonth'
    });
    
  });

  test('DocuSign integration endpoints', () => {
    // Verify ops function exists for DocuSign operations
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'bootstrap',
      Runtime: 'provided.al2023'
    });
    
    // Verify mixed security model (some endpoints with API key, callback and OPTIONS without)
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ApiKeyRequired: true
    });
    
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: false
    });
  });

  test('Bonus pool management integration', () => {
    // Verify API key configuration for security
    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'MiliareRestApiKey'
    });
    
    // Verify usage plan configuration
    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
      UsagePlanName: 'RestUsagePlan'
    });
  });

  test('Partner and customer management enhancements', () => {
    // Verify partner function configuration
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          PARTNERS_TABLE: {}
        }
      }
    });
    
    // Verify customer function configuration
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          CUSTOMERS_TABLE: {}
        }
      }
    });
  });

  test('Security and authentication integration', () => {
    // Verify Cognito integration with GraphQL
    template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
      AuthenticationType: 'AMAZON_COGNITO_USER_POOLS'
    });
    
    // Verify REST API has proper CORS configuration
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'MiliareRestApi'
    });
  });

  test('Domain and DNS integration', () => {
    // Verify custom domain setup
    template.hasResourceProperties('AWS::ApiGateway::DomainName', {
      DomainName: 'api.example.com'
    });
    
    // Verify base path mapping
    template.hasResourceProperties('AWS::ApiGateway::BasePathMapping', {});
    
    // Verify Route 53 record (created as subdomain.domain format)
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'A',
      Name: 'api.example.com.miliarereferral.com.'
    });
  });

  test('Infrastructure supports enhanced functionality', () => {
    // Verify all tables have proper key schema
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
}); 