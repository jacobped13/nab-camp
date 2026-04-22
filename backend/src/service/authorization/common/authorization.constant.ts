/**
 * Represents all possible user roles in the authorization service.
 */
export enum USER_ROLE {
  USER_EDITOR = 'USER_EDITOR',
}

/**
 * Represents all possible workspace roles in the authorization service.
 */
export enum WORKSPACE_ROLE {
  WORKSPACE_OWNER = 'WORKSPACE_OWNER',
  WORKSPACE_ADMIN = 'WORKSPACE_ADMIN',
  WORKSPACE_MEMBER = 'WORKSPACE_MEMBER',
  WORKSPACE_CREATOR = 'WORKSPACE_CREATOR',
}

/**
 * Represents all possible roles in the authorization service.
 */
export const ROLE = {
  ...USER_ROLE,
  ...WORKSPACE_ROLE,
};
export type ROLE = USER_ROLE | WORKSPACE_ROLE;

/**
 * Represents all possible user permissions in the authorization service.
 */
export enum USER_PERMISSION {
  USER_VIEW = 'USER_VIEW',
  USER_EDIT = 'USER_EDIT',
  USER_DELETE = 'USER_DELETE',
  WORKSPACE_CREATE = 'WORKSPACE_CREATE',
}

/**
 * Represents all possible workspace permissions in the authorization service.
 */
export enum WORKSPACE_PERMISSION {
  WORKSPACE_VIEW = 'WORKSPACE_VIEW',
  WORKSPACE_EDIT = 'WORKSPACE_EDIT',
  WORKSPACE_DELETE = 'WORKSPACE_DELETE',
  WORKSPACE_BILLING_MANAGE = 'WORKSPACE_BILLING_MANAGE',
  WORKSPACE_INVOICE_VIEW = 'WORKSPACE_INVOICE_VIEW',
  WORKSPACE_MEMBER_VIEW = 'WORKSPACE_MEMBER_VIEW',
  WORKSPACE_MEMBER_ROLE_CHANGE = 'WORKSPACE_MEMBER_ROLE_CHANGE',
  WORKSPACE_MEMBER_DELETE = 'WORKSPACE_MEMBER_DELETE',
  WORKSPACE_EMAIL_INVITE_VIEW = 'WORKSPACE_EMAIL_INVITE_VIEW',
  WORKSPACE_EMAIL_INVITE_CREATE = 'WORKSPACE_EMAIL_INVITE_CREATE',
  WORKSPACE_EMAIL_INVITE_DELETE = 'WORKSPACE_EMAIL_INVITE_DELETE',
}

/**
 * Represents a list of workspace roles in the authorization service.
 */
export const WORKSPACE_ROLES = [
  WORKSPACE_ROLE.WORKSPACE_OWNER,
  WORKSPACE_ROLE.WORKSPACE_ADMIN,
  WORKSPACE_ROLE.WORKSPACE_MEMBER,
  WORKSPACE_ROLE.WORKSPACE_CREATOR,
] as const;

/**
 * Represents a set of workspace roles in the authorization service.
 */
export const WORKSPACE_ROLE_SET = new Set(WORKSPACE_ROLES);

/**
 * Represents all possible document permissions in the authorization service.
 */
export enum DOCUMENT_PERMISSION {
  DOCUMENT_FILE_UPLOAD = 'DOCUMENT_FILE_UPLOAD',
}

/**
 * Represents all possible permissions in the authorization service.
 */
export const PERMISSION = {
  ...USER_PERMISSION,
  ...WORKSPACE_PERMISSION,
  ...DOCUMENT_PERMISSION,
};
export type PERMISSION =
  | USER_PERMISSION
  | WORKSPACE_PERMISSION
  | DOCUMENT_PERMISSION;

/**
 * Represents all possible user entities that have a stake in a resource.
 */
export enum AUTHORIZATION_STAKEHOLDER_TYPE {
  USER = 'USER',
  WORKSPACE = 'WORKSPACE',
  WORKSPACE_MEMBER = 'WORKSPACE_MEMBER',
}

/**
 * Represents all possible resource types that can be accessed or managed.
 */
export enum AUTHORIZATION_RESOURCE_TYPE {
  USER = 'USER',
  WORKSPACE = 'WORKSPACE',
  DOCUMENT = 'DOCUMENT',
}

/**
 * Represents the value used to indicate that a resource ID can be any valid ID.
 */
export const ANY_RESOURCE_ID = 'ALL_RESOURCES';
