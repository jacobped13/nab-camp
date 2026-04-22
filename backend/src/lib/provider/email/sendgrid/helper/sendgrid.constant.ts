import { EmailSender } from './sendgrid.type';

/**
 * Represents all the possible sender information used in the application.
 */
export const EMAIL_SENDER = {
  SUPPORT: {
    name: 'AB Ads Support',
    address: 'alex@troyersolutions.io',
  },
} as const satisfies Record<string, EmailSender>;

/**
 * Represents the possible SendGrid email templates used in the application.
 */
export enum EMAIL_TEMPLATE {
  VERIFY_LOGIN_CODE = 'd-43ab5a057f8b4209a56a6b00bc853e8f',
}
