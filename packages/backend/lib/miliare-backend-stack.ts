import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as fs from 'fs';

export interface MiliareBackendStackProps extends cdk.StackProps {
  readonly restDomainName: string;
  readonly hostedZoneId?: string;
  readonly amplifyOutputsPath?: string;
}

export class MiliareBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MiliareBackendStackProps) {
    super(scope, id, {
      ...props
    });

    // Read Amplify outputs
    const amplifyOutputs = props.amplifyOutputsPath 
      ? JSON.parse(fs.readFileSync(props.amplifyOutputsPath, 'utf-8'))
      : {};

    // Get user pool ID from Amplify outputs or env vars
    const userPoolId = amplifyOutputs.auth?.userPoolId || process.env.COGNITO_USER_POOL_ID || '';
    
    // Import existing Cognito User Pool using ARN
    const userPoolArn = userPoolId ? 
      `arn:aws:cognito-idp:${this.region}:${this.account}:userpool/${userPoolId}` : '';
    
    const userPool = userPoolId ? 
      cognito.UserPool.fromUserPoolArn(this, 'ImportedUserPool', userPoolArn) :
      new cognito.UserPool(this, 'NewUserPool', {
        selfSignUpEnabled: true,
        autoVerify: { email: true },
        standardAttributes: {
          email: { required: true, mutable: true },
          givenName: { required: true, mutable: true },
          familyName: { required: true, mutable: true },
        },
        passwordPolicy: {
          minLength: 8,
          requireLowercase: true,
          requireDigits: true,
          requireUppercase: true,
          requireSymbols: false,
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        removalPolicy: RemovalPolicy.DESTROY,
      });

    // Get user pool client ID from Amplify outputs or env vars
    const userPoolClientId = amplifyOutputs.auth?.userPoolWebClientId || process.env.COGNITO_USER_POOL_CLIENT_ID || '';
    
    // Import or create User Pool Client based on whether ID exists
    const userPoolClient = userPoolClientId ?
      cognito.UserPoolClient.fromUserPoolClientId(this, 'ImportedUserPoolClient', userPoolClientId) :
      new cognito.UserPoolClient(this, 'NewUserPoolClient', {
        userPool,
        authFlows: {
          userPassword: true,
          userSrp: true,
        },
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
      });

    // DynamoDB tables with proper removal policies
    const userProfileTable = new dynamodb.Table(this, 'UserProfileTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY, // Allows table deletion
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false }, // Disable PITR for easier deletion
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const partnersTable = new dynamodb.Table(this, 'PartnersTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const leadDataTable = new dynamodb.Table(this, 'LeadDataTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const referralsTable = new dynamodb.Table(this, 'ReferralsTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const customersTable = new dynamodb.Table(this, 'CustomersTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const paymentsTable = new dynamodb.Table(this, 'PaymentsTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Add tags to all resources for easier identification
    const tags = {
      Environment: 'development',
      Project: 'miliare-backend',
      ManagedBy: 'cdk',
    };

    // Apply tags to all resources
    Object.entries(tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });

    const hostedZone = props.hostedZoneId
      ? route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
          hostedZoneId: props.hostedZoneId,
          zoneName: 'miliarereferral.com',
        })
      : route53.HostedZone.fromLookup(this, 'HostedZone', {
          domainName: 'miliarereferral.com',
        });

    // Certificate for the REST API custom domain
    const apiGatewayCertificate = new acm.Certificate(this, 'ApiGatewayCertificate', {
      domainName: props.restDomainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Output the table names for reference
    new cdk.CfnOutput(this, 'UserProfileTableName', {
      value: userProfileTable.tableName,
      description: 'User Profile Table Name',
    });

    new cdk.CfnOutput(this, 'PartnersTableName', {
      value: partnersTable.tableName,
      description: 'Partners Table Name',
    });

    new cdk.CfnOutput(this, 'LeadDataTableName', {
      value: leadDataTable.tableName,
      description: 'Lead Data Table Name',
    });

    new cdk.CfnOutput(this, 'ReferralsTableName', {
      value: referralsTable.tableName,
      description: 'Referrals Table Name',
    });

    new cdk.CfnOutput(this, 'CustomersTableName', {
      value: customersTable.tableName,
      description: 'Customers Table Name',
    });

    new cdk.CfnOutput(this, 'PaymentsTableName', {
      value: paymentsTable.tableName,
      description: 'Payments Table Name',
    });

    const profileFn = new lambda.Function(this, 'ProfileFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      environment: {
        USER_PROFILE_TABLE: userProfileTable.tableName,
        PAYMENTS_TABLE: paymentsTable.tableName,
      },
      code: lambda.Code.fromAsset('lambda/profile', {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/golang:1.24'),
          local: {
            tryBundle(outputDir: string) {
              if (process.env.SKIP_BUNDLING) {
                require('fs').writeFileSync(`${outputDir}/bootstrap`, '');
                return true;
              }
              require('child_process').execSync(
                `GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o ${outputDir}/bootstrap main.go`,
                {
                  cwd: 'lambda/profile',
                  stdio: ['ignore', 'inherit', 'inherit'],
                }
              );
              return true;
            },
          },
        },
      }),
    });

    userProfileTable.grantReadWriteData(profileFn);
    paymentsTable.grantReadWriteData(profileFn);

    // Lambda function implemented in Go
    const userFn = new lambda.Function(this, 'UserFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      environment: {
        REFERRALS_TABLE: referralsTable.tableName,
        PAYMENTS_TABLE: paymentsTable.tableName,
      },
      code: lambda.Code.fromAsset('lambda/user', {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/golang:1.24'),
          local: {
            tryBundle(outputDir: string) {
              if (process.env.SKIP_BUNDLING) {
                require('fs').writeFileSync(`${outputDir}/bootstrap`, '');
                return true;
              }
              require('child_process').execSync(
                `GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o ${outputDir}/bootstrap main.go`,
                {
                  cwd: 'lambda/user',
                  stdio: ['ignore', 'inherit', 'inherit'],
                }
              );
              return true;
            },
          },
        },
      }),
    });

    referralsTable.grantReadWriteData(userFn);
    paymentsTable.grantReadWriteData(userFn);

    const partnerFn = new lambda.Function(this, 'PartnerFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      environment: {
        PARTNERS_TABLE: partnersTable.tableName,
      },
      code: lambda.Code.fromAsset('lambda/partner', {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/golang:1.24'),
          local: {
            tryBundle(outputDir: string) {
              if (process.env.SKIP_BUNDLING) {
                require('fs').writeFileSync(`${outputDir}/bootstrap`, '');
                return true;
              }
              require('child_process').execSync(
                `GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o ${outputDir}/bootstrap main.go`,
                {
                  cwd: 'lambda/partner',
                  stdio: ['ignore', 'inherit', 'inherit'],
                }
              );
              return true;
            },
          },
        },
      }),
    });

    partnersTable.grantReadWriteData(partnerFn);

    const customerFn = new lambda.Function(this, 'CustomerFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      environment: {
        CUSTOMERS_TABLE: customersTable.tableName,
      },
      code: lambda.Code.fromAsset('lambda/customer', {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/golang:1.24'),
          local: {
            tryBundle(outputDir: string) {
              if (process.env.SKIP_BUNDLING) {
                require('fs').writeFileSync(`${outputDir}/bootstrap`, '');
                return true;
              }
              require('child_process').execSync(
                `GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o ${outputDir}/bootstrap main.go`,
                {
                  cwd: 'lambda/customer',
                  stdio: ['ignore', 'inherit', 'inherit'],
                }
              );
              return true;
            },
          },
        },
      }),
    });

    customersTable.grantReadWriteData(customerFn);

    const leadFn = new lambda.Function(this, 'LeadFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      environment: {
        USER_PROFILE_TABLE: userProfileTable.tableName,
      },
      code: lambda.Code.fromAsset('lambda/lead', {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/golang:1.24'),
          local: {
            tryBundle(outputDir: string) {
              if (process.env.SKIP_BUNDLING) {
                require('fs').writeFileSync(`${outputDir}/bootstrap`, '');
                return true;
              }
              require('child_process').execSync(
                `GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o ${outputDir}/bootstrap main.go`,
                {
                  cwd: 'lambda/lead',
                  stdio: ['ignore', 'inherit', 'inherit'],
                },
              );
              return true;
            },
          },
        },
      }),
    });

    userProfileTable.grantReadData(leadFn);

    // Lambda for DocuSign and bonus pool REST endpoints
    const opsFn = new lambda.Function(this, 'OpsFunction', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      handler: 'bootstrap',
      code: lambda.Code.fromAsset('lambda/ops', {
        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/docker/library/golang:1.24'),
          local: {
            tryBundle(outputDir: string) {
              if (process.env.SKIP_BUNDLING) {
                require('fs').writeFileSync(`${outputDir}/bootstrap`, '');
                return true;
              }
              require('child_process').execSync(
                `GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -ldflags="-s -w" -tags lambda.norpc -o ${outputDir}/bootstrap main.go`,
                {
                  cwd: 'lambda/ops',
                  stdio: ['ignore', 'inherit', 'inherit'],
                },
              );
              return true;
            },
          },
        },
      }),
    });

    // GraphQL API using AppSync
    const graphqlApi = new appsync.GraphqlApi(this, 'ReferralApi', {
      name: 'ReferralApi',
      definition: appsync.Definition.fromFile('backend_design_docs/graphql/referral_schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
          {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        ],
      },
      // No custom domain for AppSync
    });

    const lambdaDs = graphqlApi.addLambdaDataSource('UserDataSource', userFn);

    lambdaDs.createResolver('ReferralsResolver', {
      typeName: 'Query',
      fieldName: 'referrals',
    });

    lambdaDs.createResolver('ReferralResolver', {
      typeName: 'Query',
      fieldName: 'referral',
    });

    lambdaDs.createResolver('PaymentsResolver', {
      typeName: 'Query',
      fieldName: 'payments',
    });


    lambdaDs.createResolver('DashboardMetricsResolver', {
      typeName: 'Query',
      fieldName: 'dashboardMetrics',
    });

    lambdaDs.createResolver('EarningsByMonthResolver', {
      typeName: 'Query',
      fieldName: 'earningsByMonth',
    });

    lambdaDs.createResolver('CreateReferralResolver', {
      typeName: 'Mutation',
      fieldName: 'createReferral',
    });

    lambdaDs.createResolver('UpdateReferralStatusResolver', {
      typeName: 'Mutation',
      fieldName: 'updateReferralStatus',
    });

    // AppSync does not use a custom domain

    // REST API using API Gateway
    const restApi = new apigateway.RestApi(this, 'RestApi', {
      restApiName: 'MiliareRestApi',
      deployOptions: {
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Api-Key',
        ],
      },
    });

    // REST resources

    const users = restApi.root.addResource('users');
    const userId = users.addResource('{userId}');
    userId.addMethod('GET', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });
    userId.addMethod('PUT', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });
    const paymentsRes = userId.addResource('payments');
    paymentsRes.addMethod('GET', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });

    const payments = restApi.root.addResource('payments');
    payments.addMethod('GET', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });
    payments.addMethod('POST', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });
    const paymentId = payments.addResource('{paymentId}');
    paymentId.addMethod('GET', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });
    paymentId.addMethod('PUT', new apigateway.LambdaIntegration(profileFn), { apiKeyRequired: true });

    const partners = restApi.root.addResource('partners');
    partners.addMethod('GET', new apigateway.LambdaIntegration(partnerFn), { apiKeyRequired: true });
    partners.addMethod('POST', new apigateway.LambdaIntegration(partnerFn), { apiKeyRequired: true });
    const partnerId = partners.addResource('{partnerId}');
    partnerId.addMethod('GET', new apigateway.LambdaIntegration(partnerFn), { apiKeyRequired: true });
    partnerId.addMethod('PUT', new apigateway.LambdaIntegration(partnerFn), { apiKeyRequired: true });

    const customers = restApi.root.addResource('customers');
    customers.addMethod('GET', new apigateway.LambdaIntegration(customerFn), { apiKeyRequired: true });
    customers.addMethod('POST', new apigateway.LambdaIntegration(customerFn), { apiKeyRequired: true });
    const customerId = customers.addResource('{customerId}');
    customerId.addMethod('GET', new apigateway.LambdaIntegration(customerFn), { apiKeyRequired: true });
    customerId.addMethod('PUT', new apigateway.LambdaIntegration(customerFn), { apiKeyRequired: true });

    const lead = restApi.root.addResource('lead');
    const leadUsers = lead.addResource('users');
    leadUsers.addMethod('GET', new apigateway.LambdaIntegration(leadFn), { apiKeyRequired: true });

    const docusign = restApi.root.addResource('docusign');
    const envelopes = docusign.addResource('envelopes');
    envelopes.addMethod('POST', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });
    const envelopeId = envelopes.addResource('{envelopeId}');
    envelopeId.addMethod('GET', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });
    const callbackRes = docusign.addResource('callback');
    callbackRes.addMethod('POST', new apigateway.LambdaIntegration(opsFn));

    const bonusPools = restApi.root.addResource('bonus-pools');
    bonusPools.addMethod('POST', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });
    bonusPools.addMethod('GET', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });
    const poolId = bonusPools.addResource('{poolId}');
    poolId.addMethod('GET', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });
    poolId.addMethod('PUT', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });
    const report = poolId.addResource('report');
    report.addMethod('GET', new apigateway.LambdaIntegration(opsFn), { apiKeyRequired: true });

    // Pin a static API key for clients that rely on a fixed value.
    const restApiKeyValue =
      process.env.REST_API_KEY || 'dev-static-rest-api-key';
    const restApiKey = restApi.addApiKey('RestApiKey', {
      apiKeyName: 'MiliareRestApiKey',
      value: restApiKeyValue,
    });

    const restUsagePlan = restApi.addUsagePlan('RestUsagePlan', {
      name: 'RestUsagePlan',
    });
    restUsagePlan.addApiKey(restApiKey);

    restUsagePlan.addApiStage({
      stage: restApi.deploymentStage,
    });

    new cdk.CfnOutput(this, 'RestApiKeyOutput', {
      value: restApiKeyValue,
      description: 'Static API key for the REST endpoint',
    });

    const restDomain = new apigateway.DomainName(this, 'RestDomain', {
      domainName: props.restDomainName,
      certificate: apiGatewayCertificate,
    });

    new apigateway.BasePathMapping(this, 'RestMapping', {
      domainName: restDomain,
      restApi,
    });

    // Create A record for API Gateway
    new route53.ARecord(this, 'RestAliasRecord', {
      zone: hostedZone,
      recordName: props.restDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.ApiGatewayDomain(restDomain)
      ),
      ttl: cdk.Duration.seconds(300),
    });

    // Output Cognito configuration for reference
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    // Output GraphQL API URL for reference
    new cdk.CfnOutput(this, 'GraphqlApiUrl', {
      value: graphqlApi.graphqlUrl,
      description: 'AppSync GraphQL API URL',
    });
  }
}
