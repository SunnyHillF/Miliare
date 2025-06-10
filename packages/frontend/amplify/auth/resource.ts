import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource for Miliare
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Verify your Miliare account",
      verificationEmailBody: (createCode) => `Welcome to Miliare! Use this code to confirm your account: ${createCode()}`,
    },
  },
  // User pool groups used throughout the app for authorization
  groups: ["admin", "teamLead", "partnerAdmin"],
  userAttributes: {
    // Standard attributes
    email: {
      required: true,
      mutable: true,
    },
    givenName: {
      required: true,
      mutable: true,
    },
    familyName: {
      required: true,
      mutable: true,
    },
    phoneNumber: {
      required: false,
      mutable: true,
    },
    address: {
      required: false,
      mutable: true,
    },
    // Custom attributes for Miliare business domain
    'custom:company': {
      dataType: 'String',
      mutable: true,
    },
    'custom:uplineSMD': {
      dataType: 'String',
      mutable: true,
    },
    'custom:uplineEVC': {
      dataType: 'String',
      mutable: true,
    },
  },
});
