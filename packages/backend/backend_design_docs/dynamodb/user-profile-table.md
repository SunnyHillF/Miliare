# User Profile Table

This document describes the schema for the `UserProfile` DynamoDB table.

## Primary Keys
- **PK**: `USER#<UserId>` - where UserId is the `sub` field from the Cognito Auth object
- **SK**: `PROFILE#<UserId>` - where UserId is the `sub` field from the Cognito Auth object

## Required Attributes
- `id` *(string)* - User ID (matches Cognito sub)
- `name` *(string)* - User's full name
- `email` *(string)* - Primary email address

## Optional Attributes
- `phone` *(string)* - Contact phone number
- `address` *(string)* - Physical address
- `company` *(string)* - Company affiliation
- `uplineEVC` *(string)* - Direct upline EVC name (required if company is WFG)
- `uplineSMD` *(string)* - Direct upline SMD name (required if company is WFG)
- `bankInfoDocument` *(string)* - DocuSign envelope ID for bank info form
- `taxDocument` *(string)* - DocuSign envelope ID for tax form
- `createdAt` *(string)* - ISO timestamp of creation
- `updatedAt` *(string)* - ISO timestamp of last update

## Notes
- The `UserId` used in both PK and SK is derived from the `sub` field in the Cognito Auth object, ensuring consistency with the authentication system.
- All timestamps should be in ISO 8601 format.
- The `bankInfoDocument` and `taxDocument` fields store DocuSign envelope IDs for tracking document completion status.
- Company-specific fields (uplineEVC, uplineSMD) are only required for WFG affiliates.
