# Miliare Agent Guide

This repository is a PNPM based monorepo. It contains:

- `packages/frontend` – React + Vite project managed with **AWS Amplify**.
- `packages/backend` – AWS CDK infrastructure with Go Lambda functions.
- `app_design` – Planning docs and prototype reference code.

## Getting Started
1. Install dependencies from the repo root: `pnpm install`.
2. Work in the appropriate package:
   - Frontend: use `pnpm run frontend:dev` for local development.
   - Backend: run `npx ampx pipeline-deploy --branch <branch> --app-id <appId>` to deploy the Amplify Gen&nbsp;2 stack.
3. Lint all code before committing:
   - Frontend: `pnpm run frontend:lint`.
   - Backend linting is not yet configured.
4. Run backend tests with `pnpm run backend:test` when backend code changes.
5. Update documentation and design docs under `app_design/` when backend APIs change.

## Design Reference
The high level product requirements live in `app_design/Design_specs.md`. A working
prototype is provided under `app_design/proto-mrn` and serves as the starting
point for the Amplify application. When planning new features or infrastructure,
review these files first.

## Notes
- This project uses Node 22+ and pnpm 10.11.1.
- Backend design notes are tracked in the `app_design` directory.
- Keep this guide current as the project evolves.

## Phase 1 Progress
The prototype from `app_design/proto-mrn` has been copied into `packages/frontend`.
Tailwind, React Router and related dependencies are installed.  Basic login and
registration pages now render using a local `AuthContext`.

### Remaining Phase 1 Tasks
1. Hook the authentication flows to Amplify Cognito instead of the local mock.
2. Replace the sample Todo data model with schemas from `Design_specs.md` using Amplify DataStore.
3. Configure Amplify environments for dev and QA.
4. Set up Amplify Console for automatic deployments.
