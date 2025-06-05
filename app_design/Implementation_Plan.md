# Initial Implementation Plan

This document outlines how to bootstrap the Miliare application using AWS Amplify and later transition to a production stack managed by the AWS CDK.

## Phase 1: Amplify Prototype
1. **Bootstrap from `proto-mrn`:**
   - Copy the contents of `app_design/proto-mrn` into `packages/frontend`.
   - Configure Amplify authentication (Cognito) and connect the prototype React code.
2. **Rapid data layer:**
   - Use Amplify's DataStore and auto-generated GraphQL API for early development.
   - Model schemas based on `app_design/Design_specs.md` and iterate quickly.
3. **Environment management:**
   - Use Amplify environments for separate dev and QA stacks.
4. **CI/CD:**
   - Leverage Amplify Console for automatic frontend deployments on push.

## Phase 2: Production Backend with CDK
1. **CDK Infrastructure:**
   - Mirror Amplify resources (Cognito, AppSync, DynamoDB) using the CDK in `packages/backend`.
   - Implement custom Go Lambda resolvers where Amplify auto-generated code is insufficient.
2. **Data Migration:**
   - Export data from the Amplify-managed backend and import it into the CDK-managed resources.
   - Coordinate cut-over by updating environment variables and Amplify configuration to point to the new endpoints.
3. **Testing & Validation:**
   - Ensure parity between Amplify and CDK deployments before switching production traffic.
   - Maintain a rollback plan to the Amplify environment if issues arise.

## Phase 3: Decommission Amplify Backend
1. Once the CDK stack is stable, remove backend resources from Amplify, leaving it to manage only the frontend hosting if desired.
2. Update project documentation to reflect the new architecture.

This phased approach allows quick iteration with Amplify while building a robust CDK-based backend for long-term maintainability.
