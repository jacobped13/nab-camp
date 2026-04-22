/**
 * Represents the target types for workspace invites.
 */
export enum WORKSPACE_INVITE_TARGET_TYPE {
  EMAIL = 'EMAIL',
}

/**
 * Represents the sort fields for workspace invites.
 */
export enum WORKSPACE_INVITE_SORT_FIELD {
  CREATED_AT = 'CREATED_AT',
  EXPIRE_AT = 'EXPIRE_AT',
  TARGET_ID = 'TARGET_ID',
}

/**
 * Represents the sort fields for workspace members.
 */
export enum WORKSPACE_MEMBER_SORT_FIELD {
  CREATED_AT = 'CREATED_AT',
  EMAIL = 'EMAIL',
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
}
