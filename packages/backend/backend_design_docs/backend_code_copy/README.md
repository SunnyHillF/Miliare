# Miliare Referral Network Backend

Infrastructure for the Miliare Referral Network is defined in this CDK project.
It provisions REST and GraphQL APIs powered by Go based Lambda functions and
DynamoDB tables. The `cdk.json` file instructs the CDK Toolkit how to execute
the application.

## Useful commands

This project requires **Node.js 22+**, **pnpm 10.11.1**, and **Go 1.24** when
building the Lambda functions. The basic workflow is:

1. `pnpm install`
2. Run `go vet ./...` inside each `lambda/*` directory
3. `pnpm test` – set `SKIP_BUNDLING=1` to skip Go compilation in offline mode
4. `pnpm run build && pnpm run synth`

Useful commands:

* `npm run build`   compile TypeScript to JS
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the Jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emit the synthesized CloudFormation template

## Custom API Domains

The stack exposes both the GraphQL and REST APIs under a custom domain. The
domain is selected based on the `DEPLOY_BRANCH` environment variable when the CDK
app is executed:

| Branch | Domain |
| ------ | ----------------------------- |
| `prod` | `api.miliarereferral.com`     |
| other  | `api-dev.miliarereferral.com` |

When deploying manually from the `main` branch set `DEPLOY_BRANCH=main`. Automated
deployments from the `prod` branch should set `DEPLOY_BRANCH=prod`.

The generated CloudFormation stack name is automatically prefixed with
`dev-` or `prod-` based on the branch.

## Deployment

Run `./deploy.sh` with the appropriate AWS credentials. Provide
`COGNITO_USER_POOL_ID` and `COGNITO_USER_POOL_CLIENT_ID` (or
`amplifyOutputsPath`) in your environment. Use `destroy.sh` to tear down the
stack.

## Linting

No linter configuration is currently included. A `pnpm lint` script may be added
in the future.
