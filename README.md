# Miliare Referral Network Platform

A sophisticated referral network management platform built for financial services professionals, focusing on WFG (World Financial Group) agents and strategic business partnerships.

## 🎯 Project Overview

Miliare is a comprehensive referral tracking and commission management platform designed to streamline business relationships between financial advisors, strategic partners, and team hierarchies. Built with modern web technologies and AWS Amplify Gen 2.

### Key Features

- **Referral Management**: Complete lifecycle tracking from lead to conversion with commission distribution
- **Team Hierarchy**: Multi-level team structure with SMD/EVC upline tracking for WFG integration
- **Strategic Partners**: 7 integrated business partners with flexible compensation structures (15-40% total commissions):
  - Sunny Hill Financial
  - Prime Corporate Services  
  - ANCO
  - Weightless Financial
  - Summit Business Syndicate
  - Wellness for the Workforce
  - Impact Health Sharing
- **Commission Tracking**: Precise money handling in cents with complex distribution formulas
- **Document Management**: DocuSign integration for 1099-NEC and direct deposit forms
- **Team Reporting**: Aggregated performance data and analytics for team leads
- **Professional UI**: Modern React interface with Tailwind CSS and responsive design

## 🏗️ Technical Architecture

### Monorepo Structure
```
Miliare/
├── packages/
│   ├── frontend/          # React app with Proto-mrn integration
│   │   ├── amplify/       # Amplify Gen 2 backend configuration
│   │   ├── src/           # React components and pages
│   │   └── package.json
│   └── backend/           # Future CDK implementation (Phase 2)
├── app_design/            # Design docs and data models
├── pnpm-workspace.yaml    # Monorepo configuration
└── package.json
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- Proto-mrn component library integration
- Lucide React for icons

**Backend (Phase 1 - Amplify Gen 2):**
- AWS Cognito for authentication
- AWS AppSync for GraphQL API
- Amazon DynamoDB for data persistence
- AWS Lambda for custom business logic
- Amplify CLI Gen 2 for infrastructure

**Development:**
- pnpm 10.11.0 for package management
- Node.js 22 runtime
- TypeScript for type safety
- ESLint and Prettier for code quality

## 📊 Data Models

### Core Business Entities

**UserProfile**: User management with Cognito integration
- Company affiliations (WFG focus)
- Upline tracking (SMD/EVC hierarchy)
- DocuSign document references
- Team lead relationships

**Partner**: Strategic business partners
- Individual compensation structures
- Commission percentages and tiers
- Contact information and metadata

**Referral**: Complete referral lifecycle
- Lead tracking from source to conversion
- Commission calculations and distribution
- Status updates and audit trail
- Upline commission sharing

**Payment**: Monthly commission payouts
- Money stored in cents for precision
- Bank account information (secure, last 4 digits)
- 1099-NEC tax form support
- Payment status and reconciliation

**TeamReport**: Aggregated team performance
- Team lead dashboards
- Commission summaries
- Performance metrics and KPIs

### Authorization Structure

- **owner**: Full CRUD access to personal data
- **admins**: Full access to all platform data
- **team_lead**: Read access to team members' data and reports
- **authenticated**: Read access to partner information

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10.11.0+
- AWS CLI configured
- Amplify CLI installed

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd Miliare
pnpm install
```

2. **Set up frontend environment:**
```bash
cd packages/frontend
pnpm install
```

3. **Initialize Amplify backend:**
```bash
npx ampx configure
npx ampx sandbox
```

4. **Start development server:**
```bash
pnpm dev
```

### Deployment to AWS

**Using Amplify Pipeline:**
```bash
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```

**Environment Configuration:**
- Root directory: `packages/frontend`
- Build settings: Node.js 22 with pnpm via corepack
- Amplify apps configured for monorepo structure

## 📈 Implementation Status

### Phase 1: Amplify Prototype (95% Complete ✅)

**Completed:**
- ✅ Monorepo structure with pnpm workspace
- ✅ Amplify Gen 2 setup with optimized build configuration
- ✅ Proto-mrn frontend integration (complete React app)
- ✅ Real Amplify Authentication (Cognito User Pool)
- ✅ Complete business data models with proper relationships
- ✅ Team lead functionality with hierarchical access
- ✅ Professional UI/UX with Tailwind CSS
- ✅ Working CI/CD pipeline with proper caching
- ✅ User Pool with correct attributes (givenName, familyName, phoneNumber, address, custom fields)

**Remaining (~5%):**
- Minor frontend component integration updates
- Partner data seeding for 7 strategic partners
- End-to-end testing of complete user flows

### Phase 2: Production Backend (Future)
- Custom CDK backend implementation
- Go Lambda functions for complex business logic
- DocuSign API integration
- Automated commission calculation engine
- Advanced reporting and analytics

### Phase 3: Backend Migration (Future)
- Decommission Amplify backend
- Maintain Amplify frontend hosting
- Complete migration to custom CDK infrastructure

## 🔧 Key Technical Achievements

### Deployment Optimization
- **Monorepo Support**: Proper `applications` key in amplify.yml
- **Cache Management**: Optimized to avoid 5GB limits
- **Build Performance**: pnpm with proper dependency resolution
- **Artifact Handling**: Correct paths for monorepo structure

### Authentication Evolution
- **User Pool Recreation**: Resolved Cognito attribute conflicts
- **Proper Attributes**: givenName/familyName instead of name
- **Custom Fields**: company, uplineSMD, uplineEVC for business logic
- **Authorization Modes**: Proper role-based access control

### Data Relationship Resolution
- **Bidirectional Relationships**: UserProfile ↔ Referral/Payment
- **Team Hierarchy**: Self-referencing UserProfile relationships
- **Partner Integration**: Flexible commission structure support
- **Type Safety**: Full TypeScript integration with generated types

## 🎯 Business Domain Features

### Commission Management
- **Precision Handling**: All monetary values stored in cents
- **Complex Distribution**: Multi-tier commission structures per partner
- **Upline Sharing**: Automatic SMD/EVC commission distribution
- **Audit Trail**: Complete transaction history with timestamps

### Team Operations
- **Hierarchical Access**: Team leads access subordinate data
- **Performance Reporting**: Aggregated team metrics and KPIs
- **Territory Management**: Geographic and partner-based territories
- **Compliance Tracking**: 1099-NEC and tax document management

### Partner Integration
- **Flexible Compensation**: 15-40% total commission ranges
- **Partner-Specific Rules**: Customizable business logic per partner
- **Performance Incentives**: Tier-based commission increases
- **Relationship Management**: Complete partner lifecycle tracking

## 🔒 Security & Compliance

- **Authentication**: AWS Cognito with MFA support
- **Authorization**: Fine-grained access control with custom rules
- **Data Privacy**: GDPR-compliant data handling
- **Financial Compliance**: 1099-NEC tax reporting integration
- **Audit Trail**: Complete activity logging and monitoring

## 📚 Documentation

- `AGENTS.md` - Development setup guide and repository conventions
- `/app_design/` - Business requirements and data models
- `/app_design/dynamodb/` - Database schema and relationships
- `/app_design/proto-mrn/` - UI component specifications
- `CONTRIBUTING.md` - Development guidelines
- `CODE_OF_CONDUCT.md` - Community standards

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Development setup
- Code standards
- Pull request process
- Testing requirements

## 📄 License

This project is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file for details.

---

**Status**: Phase 1 nearly complete - fully functional referral network platform ready for testing and iteration.