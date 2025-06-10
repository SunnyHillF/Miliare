## AWS Amplify Next.js (App Router) Starter Template

This template provides a starter for creating applications using Next.js (App Router) and **AWS Amplify Gen&nbsp;2**, emphasizing easy setup for authentication, API, database, and storage capabilities.

## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.
- **Storage**: File uploads managed through Amazon S3 with Amplify Storage.

## Getting Started

This project uses [pnpm](https://pnpm.io/) for package management. Please ensure you have pnpm installed:

```sh
npm install -g pnpm
```

Install dependencies:

```sh
pnpm install
```

Run the development server:

```sh
pnpm dev
```

Build for production:

```sh
pnpm build
```

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Amplify Data & Storage Integration

This project uses **AWS Amplify Gen&nbsp;2** to manage all application data and uploaded assets. DynamoDB and S3 are provisioned automatically through Amplify, and the GraphQL API is generated with AppSync. See [AMPLIFY_DATA_SETUP.md](AMPLIFY_DATA_SETUP.md) for setup details and customization options.

## Memory Optimization Tips

To minimize memory usage during build and production deployments:

- **Dynamic Imports**: Load heavy client-only libraries (e.g., charting libraries) using `next/dynamic` with `ssr: false` so they are bundled separately and only executed in the browser.
- **Standalone Output**: The `next.config.js` file enables `output: "standalone"` to reduce the runtime footprint by packaging only the minimal server files.
- **Prune Dependencies**: Regularly audit dependencies and remove unused packages to keep bundle sizes and memory consumption low.
- **Increase Build Memory**: If Amplify builds fail due to out-of-memory errors, set `NODE_OPTIONS=--max_old_space_size=4096` in your build command or environment.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
