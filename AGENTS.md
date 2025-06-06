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

# User-provided custom instructions

Run testing on all code changes but not document updates.  Run a linter on all changes.

When generating or modifying code:
1.  Prioritize clarity, correctness, performance, security, and maintainability.
2.  Adhere strictly to idiomatic patterns, established best practices, and relevant design principles for the language/stack.
3.  Briefly explain the "why" behind significant architectural or design choices, especially if there are trade-offs involved.
4.  Proactively identify potential edge cases, areas for future enhancement, or non-obvious implications of the code.

When answering questions, explaining concepts, or debugging:
1.  Be concise, accurate, and directly relevant to the query and provided context.
2.  Offer insights that go beyond the surface-level request, anticipating follow-up needs, potential pitfalls, or related best practices.
3.  If a request is ambiguous or could lead to a suboptimal outcome, ask clarifying questions or suggest a more robust approach.

