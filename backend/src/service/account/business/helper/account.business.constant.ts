/**
 * Represents the state of an account.
 */
export enum ACCOUNT_STATE {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REGISTRATION = 'REGISTRATION',
}

/**
 * Represents the registration state of an account.
 */
export enum REGISTRATION_STATE {
  REGISTER_USER = 'REGISTER_USER',
  REGISTER_WORKSPACE = 'REGISTER_WORKSPACE',
  REGISTER_PAYMENT_PLAN = 'REGISTER_PAYMENT_PLAN',
}
