# Nonfunctional Features & Implementation Strategy

This document compiles the features described in the design specs and OpenAPI documentation that are not fully implemented in the current codebase. It also notes whether they should be tackled now with the Amplify Gen&nbsp;2 setup or deferred until the CDK backend migration.

## 1. DocuSign Integration & Bonus Pools

- **OpenAPI definitions** include routes for creating envelopes, checking status and receiving callbacks from DocuSign along with several `/bonus-pools` endpoints.【F:app_design/openapi.yml†L246-L349】
- **Current state**: the `ops` Lambda that should power these routes simply returns a "not implemented" message.【F:packages/backend/lambda/ops/main.go†L1-L27】

**Recommendation**: Implement these endpoints after migrating to the CDK backend where the complex DocuSign automation and bonus-pool logic can be structured cleanly.

## 2. Partner Seeding & Dynamic Dashboards

- Dashboard pages rely on static data from `partnersData.tsx` instead of fetching from an API or database.【F:packages/frontend/src/data/partnersData.tsx†L30-L60】
- The design docs mention seeding seven strategic partners, but no database seeding scripts exist.

**Recommendation**: Temporary seeding in Amplify Gen&nbsp;2 is possible for demos, but the full dynamic solution should be implemented once the CDK backend is in place.

## 3. Automated Document Workflow After Registration

- The registration flow states that users will be redirected to DocuSign forms post‑signup, yet no code triggers these envelopes.
- This feature depends on the unimplemented DocuSign APIs above.

**Recommendation**: Defer implementation until the CDK backend phase alongside the DocuSign endpoints.

## 4. Backend Infrastructure & Deployments

- The backend directory is explicitly marked as a placeholder awaiting a more complete implementation.【F:packages/backend/README.md†L5-L10】
- Environment configuration and automated deployment pipelines are not set up.

**Recommendation**: Complete the infrastructure work during the CDK migration when deployment automation will be formalized.

## Summary Table

| Feature | Amplify Gen&nbsp;2 Feasible? | Recommended Phase |
| --- | --- | --- |
| DocuSign integration & bonus pool APIs | ❌ Limited (placeholder only) | Implement with CDK backend |
| Partner seeding & dynamic dashboards | ⚠️ Possible now, but better with CDK | Begin after CDK migration (temporary demo seeding OK) |
| Automated DocuSign workflow | ❌ Depends on unbuilt APIs | Implement with CDK backend |
| Infrastructure & deployments | ⚠️ Basic Amplify setup exists | Finalize with CDK migration |

This list can guide planning for the upcoming phases and prioritize work during the backend transition.
