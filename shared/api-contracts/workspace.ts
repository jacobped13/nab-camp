import { MimeType } from "../lib/file-types";
import {
  BillingManagementSession,
  Invoice,
  SUBSCRIPTION_STATUS,
  SubscriptionPlan,
} from "./billing";
import {
  BulkOperationError,
  BulkOperationResponseBody,
  CursorPaginationResponseBody,
  PAGINATION_DIRECTION,
  SORT_DIRECTION,
} from "./common";

// -----------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------

export type Workspace = {
  id: string;
  name: string;
  url: string | null;
  createdAt: number;
  updatedAt: number;
};

export enum WORKSPACE_MEMBER_ROLE {
  WORKSPACE_ADMIN = "WORKSPACE_ADMIN",
  WORKSPACE_MEMBER = "WORKSPACE_MEMBER",
}

export type WorkspaceMember = {
  id: string;
  role: WORKSPACE_MEMBER_ROLE;
  userId: string;
  workspaceId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: number;
  updatedAt: number;
};

export type WorkspaceAccessSubscription = {
  id: string;
  status: SUBSCRIPTION_STATUS;
  currentPeriodStartAt: number;
  currentPeriodEndAt: number;
  cancelAt: number | null;
  plan: SubscriptionPlan;
};

export type WorkspaceEmailInvite = {
  id: string;
  workspaceId: string;
  email: string;
  expireAt: number;
  createdAt: number;
  declinedAt: number | null;
};

export type WorkspaceOwner = {
  id: string;
  workspaceId: string;
};

export enum WORKSPACE_EMAIL_INVITE_SORT_FIELD {
  CREATED_AT = "CREATED_AT",
  EXPIRE_AT = "EXPIRE_AT",
  EMAIL = "EMAIL",
}

export enum WORKSPACE_MEMBER_SORT_FIELD {
  CREATED_AT = "CREATED_AT",
  EMAIL = "EMAIL",
  FIRST_NAME = "FIRST_NAME",
  LAST_NAME = "LAST_NAME",
}

// -----------------------------------------------------------------
// Create Workspace Contracts
// -----------------------------------------------------------------

export type CreateWorkspaceRequestBody = {
  name: string;
  url?: string;
};

export type CreateWorkspaceResponseBody = {
  workspace: Workspace;
  workspaceMember: WorkspaceMember;
};

// -----------------------------------------------------------------
// Assign Default Workspace Contracts
// -----------------------------------------------------------------

export type AssignDefaultWorkspaceRequestBody = {
  workspaceId: string;
};

export type AssignDefaultWorkspaceResponseBody = {
  workspace: Workspace;
};

// -----------------------------------------------------------------
// Remove Default Workspace Contracts
// -----------------------------------------------------------------

export type RemoveDefaultWorkspaceResponseBody = {
  workspace: Workspace;
};

// -----------------------------------------------------------------
// Update Workspace Contracts
// -----------------------------------------------------------------

export type UpdateWorkspaceRequestParam = {
  id: string;
};

export type UpdateWorkspaceRequestBody = {
  name?: string;
  url?: string;
};

export type UpdateWorkspaceResponseBody = {
  workspace: Workspace;
};

// -----------------------------------------------------------------
// Cancel Workspace Access Subscription Contracts
// -----------------------------------------------------------------

export type CancelWorkspaceAccessSubscriptionRequestParam = {
  id: string;
};

export type CancelWorkspaceAccessSubscriptionResponseBody = {
  subscription: WorkspaceAccessSubscription;
};

// -----------------------------------------------------------------
// Resume Cancelled Access Subscription Contracts
// -----------------------------------------------------------------

export type ResumeCancelledWorkspaceAccessSubscriptionRequestParam = {
  id: string;
};

export type ResumeCancelledWorkspaceAccessSubscriptionResponseBody = {
  subscription: WorkspaceAccessSubscription;
};

// -----------------------------------------------------------------
// Create Payment Method Management Session Contracts
// -----------------------------------------------------------------

export type CreateWorkspacePaymentMethodManagementSessionRequestParam = {
  id: string;
};

export type CreateWorkspacePaymentMethodManagementSessionRequestBody = {
  returnPath?: string;
};

export type CreateWorkspacePaymentMethodManagementSessionResponseBody = {
  session: BillingManagementSession;
};

// -----------------------------------------------------------------
// Change Workspace Access Subscription Plan Contracts
// -----------------------------------------------------------------

export type ChangeWorkspaceAccessSubscriptionPlanRequestParam = {
  id: string;
};

export type ChangeWorkspaceAccessSubscriptionPlanRequestBody = {
  planId: string;
};

export type ChangeWorkspaceAccessSubscriptionPlanResponseBody = {
  subscription: WorkspaceAccessSubscription;
};

// -----------------------------------------------------------------
// Create Document File Upload URLs Contracts
// -----------------------------------------------------------------

export type CreateDocumentFileUploadUrlsRequestParam = {
  id: string;
};

export type CreateDocumentFileUploadUrlsRequestData = {
  mimeType: MimeType;
  requestId: string;
};

export type CreateDocumentFileUploadUrlsRequestBody = {
  files: CreateDocumentFileUploadUrlsRequestData[];
};

export type CreateDocumentFileUploadUrlsResponseData = {
  fileId: string;
  fileExtension: string;
  requestId: string;
  uploadUrl: string;
};

export type CreateDocumentFileUploadUrlsResponseErrorMetadata = {
  requestId?: string;
};

export interface CreateDocumentFileUploadUrlsResponseError
  extends BulkOperationError {
  metadata?: CreateDocumentFileUploadUrlsResponseErrorMetadata;
}

export type CreateDocumentFileUploadUrlsResponseBody =
  BulkOperationResponseBody<
    CreateDocumentFileUploadUrlsResponseData[],
    CreateDocumentFileUploadUrlsResponseError
  >;

// -----------------------------------------------------------------
// Process Document File Contracts
// -----------------------------------------------------------------

export type ProcessDocumentFileRequestParam = {
  id: string;
};

export type ProcessDocumentFileRequestBody = {
  fileId: string;
  fileExtension: string;
};

export type ProcessDocumentFileResponseBody = {
  success: boolean;
};

// -----------------------------------------------------------------
// Find Workspace Email Invite Contracts
// -----------------------------------------------------------------

export type FindWorkspaceEmailInvitesRequestParam = {
  id: string;
};

export type FindWorkspaceEmailInvitesRequestQuery = {
  cursor?: string;
  direction?: PAGINATION_DIRECTION;
  limit?: string;
  sortDirection?: SORT_DIRECTION;
  sortField?: WORKSPACE_EMAIL_INVITE_SORT_FIELD;
};

export type FindWorkspaceEmailInvitesResponseBody =
  CursorPaginationResponseBody<WorkspaceEmailInvite>;

// -----------------------------------------------------------------
// Send Workspace Email Invites Contracts
// -----------------------------------------------------------------

export type SendWorkspaceEmailInvitesRequestParam = {
  id: string;
};

export type SendWorkspaceEmailInvitesRequestBody = {
  emails: string[];
};

export type SendWorkspaceEmailInvitesResponseErrorMeta = {
  email?: string;
};

export type SendWorkspaceEmailInvitesResponseData = {
  invite: WorkspaceEmailInvite;
  code?: string;
};

export interface SendWorkspaceEmailInvitesResponseError
  extends BulkOperationError {
  metadata?: SendWorkspaceEmailInvitesResponseErrorMeta;
}

export type SendWorkspaceEmailInvitesResponseBody = BulkOperationResponseBody<
  SendWorkspaceEmailInvitesResponseData[],
  SendWorkspaceEmailInvitesResponseError
>;

// -----------------------------------------------------------------
// Expire Workspace Email Invite Contracts
// -----------------------------------------------------------------

export type ExpireWorkspaceEmailInvitesRequestParam = {
  id: string;
};

export type ExpireWorkspaceEmailInvitesRequestBody = {
  inviteIds: string[];
};

export type ExpireWorkspaceEmailInvitesResponseErrorMeta = {
  inviteId?: string;
};

export interface ExpireWorkspaceEmailInvitesResponseError
  extends BulkOperationError {
  metadata?: ExpireWorkspaceEmailInvitesResponseErrorMeta;
}

export type ExpireWorkspaceEmailInvitesResponseBody = BulkOperationResponseBody<
  WorkspaceEmailInvite[],
  ExpireWorkspaceEmailInvitesResponseError
>;

// -----------------------------------------------------------------
// Accept Workspace Email Invite Contracts
// -----------------------------------------------------------------

export type AcceptWorkspaceEmailInviteRequestParam = {
  id: string;
};

export type AcceptWorkspaceEmailInviteResponseBody = {
  invite: WorkspaceEmailInvite;
};

// -----------------------------------------------------------------
// Decline Workspace Email Invite Contracts
// -----------------------------------------------------------------

export type DeclineWorkspaceEmailInviteRequestParam = {
  id: string;
};

export type DeclineWorkspaceEmailInviteResponseBody = {
  invite: WorkspaceEmailInvite;
};

// -----------------------------------------------------------------
// Find Workspace Email Invite by Code Contracts
// -----------------------------------------------------------------

export type FindWorkspaceEmailInviteByCodeRequestParam = {
  code: string;
};

export type FindWorkspaceEmailInviteByCodeResponseBody = {
  invite: WorkspaceEmailInvite;
  metadata: {
    workspaceName: string;
  };
};

// -----------------------------------------------------------------
// Send Business Contact Contracts
// -----------------------------------------------------------------

export type SendBusinessContactRequestBody = {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companySize: string;
};

export type SendBusinessContactResponseBody = {
  success: boolean;
};

// -----------------------------------------------------------------
// Find Workspace Members Contracts
// -----------------------------------------------------------------

export type FindWorkspaceMembersRequestParam = {
  id: string;
};

export type FindWorkspaceMembersRequestQuery = {
  cursor?: string;
  direction?: PAGINATION_DIRECTION;
  limit?: string;
  sortDirection?: SORT_DIRECTION;
  sortField?: WORKSPACE_MEMBER_SORT_FIELD;
};

export type FindWorkspaceMembersResponseBody =
  CursorPaginationResponseBody<WorkspaceMember>;

// -----------------------------------------------------------------
// Remove Workspace Members Contracts
// -----------------------------------------------------------------

export type RemoveWorkspaceMembersRequestParam = {
  id: string;
};

export type RemoveWorkspaceMembersRequestBody = {
  memberIds: string[];
};

export type RemoveWorkspaceMembersResponseErrorMeta = {
  memberId?: string;
};

export interface RemoveWorkspaceMembersResponseError
  extends BulkOperationError {
  metadata?: RemoveWorkspaceMembersResponseErrorMeta;
}

export type RemoveWorkspaceMembersResponseBody = BulkOperationResponseBody<
  WorkspaceMember[],
  RemoveWorkspaceMembersResponseError
>;

// -----------------------------------------------------------------
// Update Workspace Member Roles Contracts
// -----------------------------------------------------------------

export type UpdateWorkspaceMemberRolesRequestParam = {
  id: string;
};

export type UpdateWorkspaceMemberRolesRequestData = {
  id: string;
  role: WORKSPACE_MEMBER_ROLE;
};

export type UpdateWorkspaceMemberRolesRequestBody = {
  members: UpdateWorkspaceMemberRolesRequestData[];
};

export type UpdateWorkspaceMemberRolesResponseErrorMeta = {
  memberId?: string;
};

export interface UpdateWorkspaceMemberRolesResponseError
  extends BulkOperationError {
  metadata?: UpdateWorkspaceMemberRolesResponseErrorMeta;
}

export type UpdateWorkspaceMemberRolesResponseBody = BulkOperationResponseBody<
  WorkspaceMember[],
  UpdateWorkspaceMemberRolesResponseError
>;

// -----------------------------------------------------------------
// Find Workspace Invoices Contracts
// -----------------------------------------------------------------

export type FindWorkspaceInvoicesRequestParam = {
  id: string;
};

export type FindWorkspaceInvoicesRequestQuery = {
  cursor?: string;
  direction?: PAGINATION_DIRECTION;
  limit?: string;
};

export type FindWorkspaceInvoicesResponseBody =
  CursorPaginationResponseBody<Invoice>;
