## AWS Amplify React+Vite Starter Template

This repository provides a starter template for creating applications using React+Vite and AWS Amplify **Gen&nbsp;2**, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational React application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

To deploy using Amplify Gen&nbsp;2, run the backend pipeline deploy command from the repository root:

```bash
npx ampx pipeline-deploy --branch <branch> --app-id <appId>
```

This will provision the backend defined in `packages/frontend/amplify` and build the frontend located in `packages/frontend`.
Refer to the [deployment section](https://docs.amplify.aws/gen2/deploy/pipelines/) for more details.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.