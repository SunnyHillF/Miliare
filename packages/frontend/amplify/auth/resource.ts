import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource for Miliare
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // Standard attributes
    email: {
      required: true,
      mutable: true,
    },
    name: {
      required: true,
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
