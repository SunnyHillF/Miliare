# Payments Table

This document covers the schema for the `Payments` DynamoDB table.

## Primary Keys
- **PK**: `PAYMENT#<PaymentId>`
- **SK**: `METADATA#<PaymentId>`

## Required Attributes
- `id` *(string)* - Unique payment identifier
- `userId` *(string)* - ID of the user receiving the payment
- `referralId` *(string)* - Associated referral record
- `amount` *(number)* - Payment amount in USD cents
- `type` *(string)* - Payment type (COMMISSION, BONUS_POOL, UPLINE)
- `status` *(string)* - Payment status (PENDING, PROCESSED, FAILED)
- `createdAt` *(string)* - ISO timestamp of creation

## Optional Attributes
- `period` *(string)* - Payment period (YYYY-MM)
- `processedAt` *(string)* - ISO timestamp when payment was processed
- `bankInfo` *(map)* - Bank account information:
  - `accountNumber` *(string)* - Last 4 digits of account
  - `routingNumber` *(string)* - Last 4 digits of routing
  - `accountType` *(string)* - Type of bank account
- `notes` *(string)* - Additional payment information
- `updatedAt` *(string)* - ISO timestamp of last update

## Notes
- Payments issued for referrals are logged here for auditing and reporting.
- All timestamps should be in ISO 8601 format.
- Amounts are stored in cents to avoid floating-point precision issues.
- The table supports querying payments by user, period, and status.
- Bank information is stored securely and only includes last 4 digits for reference.
