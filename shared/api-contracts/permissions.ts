// -----------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------

export enum PERMISSION {
  // -----------------------------------------------------------------
  // Workspace Permissions
  // -----------------------------------------------------------------
  WORKSPACE_VIEW = "WORKSPACE_VIEW",
  WORKSPACE_EDIT = "WORKSPACE_EDIT",
  WORKSPACE_DELETE = "WORKSPACE_DELETE",
  WORKSPACE_BILLING_MANAGE = "WORKSPACE_BILLING_MANAGE",
  WORKSPACE_MEMBER_VIEW = "WORKSPACE_MEMBER_VIEW",
  WORKSPACE_MEMBER_ROLE_CHANGE = "WORKSPACE_MEMBER_ROLE_CHANGE",
  WORKSPACE_MEMBER_DELETE = "WORKSPACE_MEMBER_DELETE",
  WORKSPACE_EMAIL_INVITE_VIEW = "WORKSPACE_EMAIL_INVITE_VIEW",
  WORKSPACE_EMAIL_INVITE_CREATE = "WORKSPACE_EMAIL_INVITE_CREATE",
  WORKSPACE_EMAIL_INVITE_DELETE = "WORKSPACE_EMAIL_INVITE_DELETE",
  WORKSPACE_INVOICE_VIEW = "WORKSPACE_INVOICE_VIEW",
}

export type Permissions = {
  [key in PERMISSION]: boolean;
};
