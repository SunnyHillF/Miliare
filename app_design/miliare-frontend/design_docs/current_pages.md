# Current Pages Overview

This document lists the pages that exist in the application as of this commit. It serves as a reference for future fixes and design iterations.

## Landing / Login
- **Route:** `/` (`app/page.tsx`)
- **Purpose:** Main landing screen and login form. Provides email and password inputs with a "Remember me" option and link to registration. Features a side panel describing the referral network benefits.

## Dedicated Login
- **Route:** `/login`
- **Purpose:** Alternate login page with branding. Contains email/password fields, "Remember me" option, and basic error handling.

## Register
- **Route:** `/register`
- **Purpose:** Account creation form collecting name, email, phone, address, company, and password. On success, navigates to the dashboard.

## Registration Complete
- **Route:** `/register/complete`
- **Purpose:** Placeholder for DocuSign links (1099‑NEC and Direct Deposit) to finalize registration. Links back to the dashboard.

## Dashboard (Layout)
- **Route:** `/dashboard`
- **Behavior:** Redirects to `/dashboard/business`.

### Dashboard – Business
- **Route:** `/dashboard/business`
- **Purpose:** Shows earnings summary widgets, pending referrals, recent payments, and an earnings chart. Link to the Payment History page.

### Dashboard – Payment History
- **Route:** `/dashboard/business/payments`
- **Purpose:** Displays a filterable table of past payments.

### Dashboard – Learn
- **Route:** `/dashboard/learn`
- **Purpose:** Lists strategic partners with brief descriptions and links to detailed partner pages.

### Dashboard – Partner Detail
- **Route:** `/dashboard/learn/[partnerSlug]`
- **Purpose:** Dynamic page showing detailed partner information, services, training materials, and contact options.

### Dashboard – Refer
- **Route:** `/dashboard/refer`
- **Purpose:** Lists partners with short descriptions, payouts, and links to each partner's referral widget.

### Dashboard – Refer Partner
- **Route:** `/dashboard/refer/[partnerSlug]`
- **Purpose:** Provides an embedded referral widget or external link for the selected partner along with training links and contact info.

## Admin
- **Route:** `/admin`
- **Purpose:** Basic admin dashboard. Currently contains placeholder logic for checking admin privileges.

