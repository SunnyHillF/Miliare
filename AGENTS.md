# Miliare Agent Guide

This repository is a PNPM based monorepo. It contains:

- `packages/frontend` – React + Vite project managed with **AWS Amplify**.
- `packages/backend` – AWS CDK infrastructure with Go Lambda functions.
- `app_design` – Planning docs and prototype reference code.

## Getting Started
1. Install dependencies from the repo root: `pnpm install`.
2. Work in the appropriate package:
   - Frontend: use `pnpm run frontend:dev` for local development.
   - Backend: use `pnpm run backend:deploy` to deploy the CDK stack.
3. Lint all code before committing:
   - Frontend: `pnpm run frontend:lint`.
   - Backend linting is not yet configured.
4. Run backend tests with `pnpm run backend:test` when backend code changes.
5. Update documentation and design docs in `packages/backend/backend_design_docs` when backend APIs change.

## Design Reference
The high level product requirements live in `app_design/Design_specs.md`. A working
prototype is provided under `app_design/proto-mrn` and serves as the starting
point for the Amplify application. When planning new features or infrastructure,
review these files first.

## Notes
- This project uses Node 22+ and pnpm 10.11.1.
- A separate `AGENTS.md` exists in `packages/backend/backend_design_docs` with detailed backend design and maintenance notes.
- Keep this guide current as the project evolves.
