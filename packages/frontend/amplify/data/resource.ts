import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // User Profile model - extends Cognito user data
  UserProfile: a
    .model({
      id: a.id(), // Matches Cognito sub
      name: a.string().required(),
      email: a.email().required(),
      phone: a.string(),
      address: a.string(),
      company: a.string(),
      uplineEVC: a.string(), // Required if company is WFG
      uplineSMD: a.string(), // Required if company is WFG
      teamLeadId: a.id(), // References the team lead's UserProfile ID
      bankInfoDocument: a.string(), // DocuSign envelope ID
      taxDocument: a.string(), // DocuSign envelope ID
      referrals: a.hasMany("Referral", "userProfileId"),
      payments: a.hasMany("Payment", "userProfileId"),
      teamLead: a.belongsTo("UserProfile", "teamLeadId"),
      teamMembers: a.hasMany("UserProfile", "teamLeadId"),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(["admins"]),
      allow.groups(["team_lead"]).to(["read"])
    ]),

  // Strategic Partners model
  Partner: a
    .model({
      id: a.id(),
      name: a.string().required(),
      contactEmail: a.email().required(),
      website: a.url().required(),
      status: a.enum(["ACTIVE", "INACTIVE"]),
      description: a.string(),
      // Compensation structure
      agentPercentage: a.float(),
      smdPercentage: a.float(),
      evcPercentage: a.float(),
      bonusPoolPercentage: a.float(),
      mrnPercentage: a.float(),
      contractorPercentage: a.float(),
      trainingLinks: a.string().array(),
      referrals: a.hasMany("Referral", "partnerId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admins"]),
      allow.groups(["team_lead"]).to(["read"])
    ]),

  // Referrals model - tracks leads sent to partners
  Referral: a
    .model({
      id: a.id(),
      userProfileId: a.id().required(), // References UserProfile
      partnerId: a.id().required(), // References Partner
      leadId: a.string().required(),
      clientName: a.string().required(),
      status: a.enum(["IN_PROGRESS", "IN_REVIEW", "PAID", "REJECTED"]),
      amount: a.integer().required(), // Amount in cents
      uplineEVC: a.string(),
      uplineSMD: a.string(),
      // Commission distribution
      agentAmount: a.integer(),
      smdAmount: a.integer(),
      evcAmount: a.integer(),
      bonusPoolAmount: a.integer(),
      mrnAmount: a.integer(),
      contractorAmount: a.integer(),
      partnerType: a.enum(["DIRECT_PAYMENT", "MRN_PAYMENT"]),
      paymentStatus: a.enum(["PENDING", "PROCESSED", "FAILED"]),
      notes: a.string(),
      paidAt: a.datetime(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      partner: a.belongsTo("Partner", "partnerId"),
      payments: a.hasMany("Payment", "referralId"),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update", "delete"]),
      allow.groups(["admins"]),
      allow.groups(["team_lead"]).to(["read"])
    ]),

  // Payments model - monthly payouts
  Payment: a
    .model({
      id: a.id(),
      userProfileId: a.id().required(), // References UserProfile
      referralId: a.id(), // References Referral
      amount: a.integer().required(), // Amount in cents
      type: a.enum(["COMMISSION", "BONUS_POOL", "UPLINE"]),
      status: a.enum(["PENDING", "PROCESSED", "FAILED"]),
      period: a.string(), // YYYY-MM format
      processedAt: a.datetime(),
      // Bank account info (last 4 digits only)
      accountNumber: a.string(),
      routingNumber: a.string(),
      accountType: a.string(),
      notes: a.string(),
      userProfile: a.belongsTo("UserProfile", "userProfileId"),
      referral: a.belongsTo("Referral", "referralId"),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update", "delete"]),
      allow.groups(["admins"]),
      allow.groups(["team_lead"]).to(["read"])
    ]),

  // Team Performance Reports - aggregated data for team leads
  TeamReport: a
    .model({
      id: a.id(),
      teamLeadId: a.id().required(), // References UserProfile of team lead
      period: a.string().required(), // YYYY-MM format
      totalReferrals: a.integer().required(),
      totalCommissions: a.integer().required(), // Amount in cents
      totalPayments: a.integer().required(), // Amount in cents
      teamMemberCount: a.integer().required(),
      topPerformerId: a.id(), // References UserProfile of top performer
      reportData: a.json(), // Detailed breakdown data
    })
    .authorization((allow) => [
      allow.owner().to(["read"]),
      allow.groups(["admins"])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
