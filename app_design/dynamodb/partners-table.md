# Partners Table

This document outlines the schema for the `Partners` DynamoDB table.

## Primary Keys
- **PK**: `PARTNER#<PartnerId>`
- **SK**: `PROFILE#<PartnerId>`

## Required Attributes
- `id` *(string)* - Unique partner identifier
- `name` *(string)* - Partner or organization name
- `contactEmail` *(string)* - Email used for notifications
- `website` *(string)* - Partner's website URL
- `status` *(string)* - Partner status (ACTIVE, INACTIVE)
- `createdAt` *(string)* - ISO timestamp of creation

## Optional Attributes
- `description` *(string)* - Detailed description of partner's services
- `compensation` *(map)* - Compensation structure:
  - `agentPercentage` *(number)* - Percentage paid to referring agent
  - `smdPercentage` *(number)* - Percentage paid to upline SMD
  - `evcPercentage` *(number)* - Percentage paid to upline EVC
  - `bonusPoolPercentage` *(number)* - Percentage going to bonus pool
  - `mrnPercentage` *(number)* - Percentage retained by MRN
  - `contractorPercentage` *(number)* - Percentage paid to contractors
- `trainingLinks` *(list)* - List of training resource URLs
- `updatedAt` *(string)* - ISO timestamp of last update

## Notes
- The Partners table stores business information for organizations collaborating with Miliare.
- All timestamps should be in ISO 8601 format.
- Compensation percentages should be stored as decimal values (e.g., 0.15 for 15%).
- The table supports querying partners by status and compensation structure.
