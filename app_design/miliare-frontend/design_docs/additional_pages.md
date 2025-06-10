# Additional Pages Needed

The current frontend includes login, registration, dashboard (business, learn, refer) and admin pages. To fully meet the design specifications, the following pages should be added:

## Partner Detail Page
- **Route:** `/dashboard/learn/[partnerSlug]`
- **Purpose:** Provide detailed information and training resources for a specific strategic partner.
- **Contents:**
  - Partner description and compensation structure
  - Links to training materials or videos
  - Contact information and external links

## Referral Widget Page
- **Route:** `/dashboard/refer/[partnerSlug]`
- **Purpose:** Embed or link to the partner's referral widget so users can submit leads.
- **Contents:**
  - Brief instructions on how to refer
  - Embedded widget or external URL
  - Display of payout percentage for that partner

## Payment History Page
- **Route:** `/dashboard/business/payments`
- **Purpose:** Show a detailed list of all payments made to the logged-in user.
- **Contents:**
  - Table of payments with date, company, and amount
  - Filters by date range

## DocuSign Completion Page
- **Route:** `/register/complete`
- **Purpose:** Confirmation page after registration where users are directed to complete DocuSign forms (1099‑NEC and direct deposit).
- **Contents:**
  - Instructions and links to DocuSign envelopes
  - Option to return to dashboard when done

These pages enhance user experience and ensure that all requirements from the design specification are addressed.

