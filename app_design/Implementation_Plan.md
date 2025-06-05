# Miliare Implementation Plan

## Current Status: ✅ **Amplify Gen 2 Infrastructure Ready** | 🔄 **Phase 1 In Progress**

## Phase 1: Amplify Prototype (CURRENT)
### ✅ **Completed:**
- Monorepo structure with pnpm workspace
- Amplify Gen 2 setup with proper build configuration
- Basic data model (Todo) working
- CI/CD pipeline configured

### 🔄 **In Progress:**
1. **Integrate proto-mrn frontend:**
   - Copy proto-mrn React components to `packages/frontend/src`
   - Install additional dependencies (react-router-dom, tailwind, etc.)
   - Configure Tailwind CSS for styling
2. **Connect Amplify Auth:**
   - Replace AuthContext with Amplify Auth
   - Update auth configuration in amplify/auth/resource.ts
   - Implement proper authentication flow
3. **Create Miliare data models:**
   - Design schema based on Design_specs.md
   - Replace Todo model with business domain models
   - Set up proper authorization rules

### 📋 **Next Steps:**
4. **Environment management:**
   - Set up dev/QA environments
5. **Testing & iteration:**
   - Test all user flows
   - Iterate on UI/UX based on feedback

## Phase 2: Production Backend with CDK (FUTURE)
- Mirror Amplify resources using CDK in `packages/backend`
- Implement custom Go Lambda resolvers
- No data migration risk (development only)

## Phase 3: Decommission Amplify Backend (FUTURE)
- Keep frontend hosting, replace backend infrastructure
- Clean transition since no live user data

## Dependencies to Install for proto-mrn Integration:
```bash
cd packages/frontend
pnpm add react-router-dom @types/react-router-dom
pnpm add -D tailwindcss postcss autoprefixer
pnpm add lucide-react  # For icons
```
