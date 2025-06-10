# Amplify Data & Storage Setup Guide

This project is already configured with **AWS Amplify Gen&nbsp;2** for all data and storage operations. Use the following steps if you need to recreate or customize the backend.

## Prerequisites
- AWS account with appropriate permissions
- The Amplify Gen&nbsp;2 CLI is used via the ephemeral `ampx` command (no global installation required)

## 1. Initialize Amplify
Run the initialization command from the project root:

```sh
npx ampx init
```

Follow the prompts to configure your environment and select **JavaScript** with **Next.js**.

## 2. Add a GraphQL API
Create the backend API using AppSync and DynamoDB:

```sh
npx ampx add api
```

Choose **GraphQL** and provide a schema or use the sample provided in `design_docs/referral_schema.graphql`.

## 3. Add Storage for File Uploads
Provision an S3 bucket for uploaded documents:

```sh
npx ampx add storage
```

Select **Content (Images, audio, video, etc.)** and configure the access level according to your needs.

## 4. Push the Backend
Deploy the resources to your AWS account:

```sh
npx ampx push
```

Amplify generates TypeScript models and hooks that can be imported in your application for data operations and file uploads.

## 5. Update Environment Configuration
Ensure that the generated `aws-exports.js` file is included in your build and referenced by the Amplify client setup in `app/_app.tsx`.

## Next Steps
- Use the generated GraphQL queries and mutations for all backend operations.
- Replace direct file uploads with `Storage.put` and `Storage.get` from `aws-amplify`.
- Review `MEMORY_OPTIMIZATION.md` for build considerations when deploying via Amplify Gen&nbsp;2.
