# Referrals Table

This document describes the schema for the `Referrals` DynamoDB table.

## Primary Keys
- **PK**: `REFERRAL#<ReferralId>`
- **SK**: `METADATA#<ReferralId>`

## Required Attributes
- `id` *(string)* - Unique referral identifier
- `userId` *(string)* - ID of the user who made the referral
- `partnerId` *(string)* - ID of the partner receiving the referral
- `leadId` *(string)* - Linked lead record
- `clientName` *(string)* - Name of the referred client
- `status` *(string)* - Referral status (IN_PROGRESS, IN_REVIEW, PAID, REJECTED)
- `amount` *(number)* - Total commission amount in USD cents
- `createdAt` *(string)* - ISO timestamp of creation

## Optional Attributes
- `uplineEVC` *(string)* - ID of the upline EVC (required for WFG)
- `uplineSMD` *(string)* - ID of the upline SMD (required for WFG)
- `compensation` *(map)* - Commission distribution:
  - `agentAmount` *(number)* - Amount for referring agent (15-25% based on partner)
  - `smdAmount` *(number)* - Amount for upline SMD (2%)
  - `evcAmount` *(number)* - Amount for upline EVC (1%)
  - `bonusPoolAmount` *(number)* - Amount for bonus pool (2%)
  - `mrnAmount` *(number)* - Amount retained by MRN (5%)
  - `contractorAmount` *(number)* - Amount for contractors (if applicable)
- `partnerType` *(string)* - Type of partner (DIRECT_PAYMENT, MRN_PAYMENT)
- `paymentStatus` *(string)* - Payment status (PENDING, PROCESSED, FAILED)
- `notes` *(string)* - Additional referral information
- `updatedAt` *(string)* - ISO timestamp of last update
- `paidAt` *(string)* - ISO timestamp when commission was paid

## Notes
- Each record associates a partner with a lead referral and tracks the referral lifecycle.
- All timestamps should be in ISO 8601 format.
- Amounts are stored in cents to avoid floating-point precision issues.
- The table supports querying referrals by user, partner, and status.
- Commission distribution varies by partner:
  - Sunny Hill Financial: 25% total (15% agent, 2% SMD, 1% EVC, 2% bonus, 5% MRN)
  - Prime Corporate Services: 30% total (20% agent, 2% SMD, 1% EVC, 2% bonus, 5% MRN)
  - ANCO: 30% total (20% agent, 2% SMD, 1% EVC, 2% bonus, 2.5% contractor, 2.5% MRN)
  - Summit Business: 40% total (25% agent, 2% SMD, 1% EVC, 2% bonus, 5% contractor, 5% MRN)
- Some partners (Weightless Financial, Wellness for the Workforce) handle payments directly
- Upline fields are only required for WFG affiliates
