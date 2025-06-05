# Backend Agent Guide

This directory stores Miliare's backend design docs along with reference frontend code. All infrastructure uses AWS CDK (TypeScript) and Go 1.24.3 Lambda functions.

## Implementation Summary
- **Lambda functions**: `profile`, `user`, `partner`, `customer`, `lead`, and `ops` are implemented. `ops` currently returns `{"message":"not implemented"}` and serves as a placeholder for DocuSign and bonus pool features.
- **DynamoDB tables**: six tables using the `PK/SK` pattern.
- **APIs**: REST endpoints defined in `restapi/openapi.yaml`; GraphQL schema in `graphql/referral_schema.graphql` with eight resolvers.
- **Tests**: 35 Jest tests across nine suites verify infrastructure. Set `SKIP_BUNDLING=1` to run without pulling Go dependencies.

## Workflow
1. `pnpm install`
2. `go vet ./...` within each `lambda/*` directory
3. `pnpm test`
4. `pnpm run build` && `pnpm run synth`

For offline environments, set `SKIP_BUNDLING=1` before steps 3 and 4.

## Coding Standards
- Strict TypeScript configuration
- `packageManager` pinned to `pnpm@10.11.1`
- No new compiled `bootstrap` binaries
- REST and GraphQL interfaces must match the specs here

## Deployment
- Provide `COGNITO_USER_POOL_ID` and `COGNITO_USER_POOL_CLIENT_ID` (or `amplifyOutputsPath`) on deploy
- AppSync certificates live in `us-east-1`
- Use `deploy.sh` and `destroy.sh` for local deploy and teardown

## Design Docs Sync
The folders below mirror the deployed code. Update them whenever backend or frontend code changes so other agents have an accurate reference:
- `backend_code_copy/` – snapshot of backend code and structure
- `frontend_code/` – example frontend reflecting current API and integration expectations

## Maintenance
After significant updates, rewrite this AGENTS.md to keep instructions concise and current.

## Future Work
- Implement DocuSign envelope handling and bonus pool logic in `lambda/ops`
- Add real-time notifications and batch payment processing
