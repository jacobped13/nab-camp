/**
 * Represents the supported identity providers in the system.
 */
export enum AUTHENTICATION_IDENTITY_PROVIDER {
  FIREBASE = 'FIREBASE',
}

/**
 * Represents the type of stakeholders that can be associated with an identity provider.
 */
export enum AUTHENTICATION_STAKEHOLDER_TYPE {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

/**
 * Represents the target types for authentication codes.
 */
export enum AUTHENTICATION_CODE_TARGET_TYPE {
  EMAIL = 'EMAIL',
}
