## AWS Amplify Next.js Example

This directory contains a reference Next.js (App Router) application that
demonstrates how the frontend integrates with AWS Amplify authentication and the
backend services defined in this repository.

## Overview

The example project provides a minimal Next.js application wired up to Amplify
for authentication. GraphQL queries and file uploads are handled by the backend
microservices in this repository, keeping the frontend lightweight while still
benefiting from Amplify's seamless auth flows.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: GraphQL queries are served by a dedicated endpoint maintained outside of Amplify.
- **Database**: Data persistence is managed by backend microservices; this frontend communicates via GraphQL and REST APIs.
- **Static Fixtures**: Test and offline data live under `lib/` for predictable unit tests and local development.

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

## Configuration

The app expects the following environment variables defined in `next.config.js`:

- `GRAPHQL_ENDPOINT` – GraphQL service used for client-side data (`https://graphql-dev.miliarereferral.com/graphql`).
- `API_BASE_URL` – REST API base for server-side requests (`https://api-dev.miliqrereferral.com`).
- `REST_API_KEY` – static API key required by the REST service.

These are exposed at runtime through `process.env.GRAPHQL_ENDPOINT`, `process.env.API_BASE_URL`, and `process.env.REST_API_KEY`.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Memory Optimization Tips

To minimize memory usage during build and production deployments:

- **Dynamic Imports**: Load heavy client-only libraries (e.g., charting libraries) using `next/dynamic` with `ssr: false` so they are bundled separately and only executed in the browser.
- **Standalone Output**: The `next.config.js` file enables `output: "standalone"` to reduce the runtime footprint by packaging only the minimal server files.
- **Prune Dependencies**: Regularly audit dependencies and remove unused packages to keep bundle sizes and memory consumption low.
- **Increase Build Memory**: If Amplify builds fail due to out-of-memory errors, set `NODE_OPTIONS=--max_old_space_size=50000` in your build command or environment.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
