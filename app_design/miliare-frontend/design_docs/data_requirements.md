# Data Requirements

This document summarizes the data needed for the Miliare Referral Network based on the design specifications. All data is managed through **AWS Amplify Gen&nbsp;2** using a GraphQL API and S3 storage.

## Entities

### User
- `id` (Auth ID)
- `name`
- `email`
- `phone`
- `address`
- `company` (affiliated company)
- `uplineEVC` (optional; required if company is WFG)
- `uplineSMD` (optional; required if company is WFG)
- `bankInfoDocument` (DocuSign direct deposit form)
- `taxDocument` (DocuSign 1099‑NEC form)
- `createdAt`
- `updatedAt`

User profile information is stored and retrieved via the Amplify GraphQL API.

### Company
- `id`
- `name`
- `website`
- `description`
- `payoutStructure`
- `widgetUrl` (link or embed for referrals)

### Referral
Managed entirely through the Amplify GraphQL API.
- `id`
- `userId`
- `companyId`
- `clientName`
- `status` (e.g., `IN_PROGRESS`, `IN_REVIEW`, `PAID`)
- `amount` (commission earned)
- `createdAt`
- `updatedAt`

### Payment
- `id`
- `userId`
- `referralId`
- `amount`
- `date`
- `status`

### BonusPool
- `id`
- `period` (e.g., quarter)
- `amount`
- `distributions` (payouts to uplines)

## Data Source Summary
- **Amplify GraphQL API** – Provides all data operations including user profiles, company info, referrals, and payments.
- **Amplify Storage (S3)** – Stores uploaded documents such as DocuSign forms.

