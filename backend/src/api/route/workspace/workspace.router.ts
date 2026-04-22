import { createRouter } from '@common';
import * as workspaceHandler from './workspace.handler';

export enum WORKSPACE_ROUTE {
  ROOT = '/',
  DEFAULT = '/default',
  ID = '/:id',
  // Billing
  SEND_BUSINESS_CONTACT = '/send-business-contact',
  ID_SUBSCRIPTION_CANCEL = '/:id/subscription/cancel',
  ID_SUBSCRIPTION_RESUME = '/:id/subscription/resume',
  ID_SUBSCRIPTION_PLAN = '/:id/subscription/plan',
  ID_PAYMENT_METHOD_SESSION = '/:id/payment-method/session',
  ID_INVOICE = '/:id/invoice',
  // Document
  ID_DOCUMENT_FILE_UPLOAD = '/:id/document/file/upload',
  ID_DOCUMENT_FILE_PROCESS = '/:id/document/file/process',
  // Invite
  ID_INVITE_EMAIL = '/:id/invite/email',
  ID_INVITE_EMAIL_SEND = '/:id/invite/email/send',
  ID_INVITE_EMAIL_EXPIRE = '/:id/invite/email/expire',
  INVITE_EMAIL_ID_ACCEPT = '/invite/email/:id/accept',
  INVITE_EMAIL_ID_DECLINE = '/invite/email/:id/decline',
  INVITE_EMAIL_CODE_ID = '/invite/email/code/:code',
  // Member
  ID_MEMBER = '/:id/member',
  ID_MEMBER_REMOVE = '/:id/member/remove',
  ID_MEMBER_ROLE_UPDATE = '/:id/member/role',
}

export const workspaceRouter = createRouter()
  // -----------------------------------------------------------------
  // Create Workspace Operation
  // -----------------------------------------------------------------
  .post(WORKSPACE_ROUTE.ROOT, ...workspaceHandler.createWorkspace)
  // -----------------------------------------------------------------
  // Assign Default Workspace Operation
  // -----------------------------------------------------------------
  .put(WORKSPACE_ROUTE.DEFAULT, ...workspaceHandler.assignDefaultWorkspace)
  // -----------------------------------------------------------------
  // Remove Default Workspace Operation
  // -----------------------------------------------------------------
  .delete(WORKSPACE_ROUTE.DEFAULT, ...workspaceHandler.removeDefaultWorkspace)
  // -----------------------------------------------------------------
  // Update Workspace Operation
  // -----------------------------------------------------------------
  .put(WORKSPACE_ROUTE.ID, ...workspaceHandler.updateWorkspace)
  // -----------------------------------------------------------------
  // Cancel Workspace Access Subscription Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_SUBSCRIPTION_CANCEL,
    ...workspaceHandler.cancelWorkspaceAccessSubscription
  )
  // -----------------------------------------------------------------
  // Resume Cancelled Workspace Access Subscription Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_SUBSCRIPTION_RESUME,
    ...workspaceHandler.resumeCancelledWorkspaceAccessSubscription
  )
  // -----------------------------------------------------------------
  // Change Workspace Access Subscription Plan Operation
  // -----------------------------------------------------------------
  .put(
    WORKSPACE_ROUTE.ID_SUBSCRIPTION_PLAN,
    ...workspaceHandler.changeWorkspaceAccessSubscriptionPlan
  )
  // -----------------------------------------------------------------
  // Create Payment Method Management Session Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_PAYMENT_METHOD_SESSION,
    ...workspaceHandler.createWorkspacePaymentMethodManagementSession
  )
  .get(WORKSPACE_ROUTE.ID_INVOICE, ...workspaceHandler.findWorkspaceInvoices)
  // -----------------------------------------------------------------
  // Create Document File Upload URLs Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_DOCUMENT_FILE_UPLOAD,
    ...workspaceHandler.createDocumentFileUploadUrls
  )
  // -----------------------------------------------------------------
  // Process Document File Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_DOCUMENT_FILE_PROCESS,
    ...workspaceHandler.processDocumentFile
  )
  // -----------------------------------------------------------------
  // Find Workspace Email Invite by Code Operation
  // -----------------------------------------------------------------
  .get(
    WORKSPACE_ROUTE.INVITE_EMAIL_CODE_ID,
    ...workspaceHandler.findWorkspaceEmailInviteByCode
  )
  // -----------------------------------------------------------------
  // Find Workspace Email Invites Operation
  // -----------------------------------------------------------------
  .get(
    WORKSPACE_ROUTE.ID_INVITE_EMAIL,
    ...workspaceHandler.findWorkspaceEmailInvites
  )
  // -----------------------------------------------------------------
  // Send Workspace Email Invites Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_INVITE_EMAIL_SEND,
    ...workspaceHandler.sendWorkspaceEmailInvites
  )
  // -----------------------------------------------------------------
  // Expire Workspace Email Invite Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.ID_INVITE_EMAIL_EXPIRE,
    ...workspaceHandler.expireWorkspaceEmailInvites
  )
  // -----------------------------------------------------------------
  // Accept Workspace Email Invite Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.INVITE_EMAIL_ID_ACCEPT,
    ...workspaceHandler.acceptWorkspaceEmailInvite
  )
  // -----------------------------------------------------------------
  // Decline Workspace Email Invite Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.INVITE_EMAIL_ID_DECLINE,
    ...workspaceHandler.declineWorkspaceEmailInvite
  )
  // -----------------------------------------------------------------
  // Send Business Contact Operation
  // -----------------------------------------------------------------
  .post(
    WORKSPACE_ROUTE.SEND_BUSINESS_CONTACT,
    ...workspaceHandler.sendBusinessContact
  )
  // -----------------------------------------------------------------
  // Find Workspace Members Operation
  // -----------------------------------------------------------------
  .get(WORKSPACE_ROUTE.ID_MEMBER, ...workspaceHandler.findWorkspaceMembers)
  // -----------------------------------------------------------------
  // Remove Workspace Members Operation
  // -----------------------------------------------------------------
  .delete(
    WORKSPACE_ROUTE.ID_MEMBER_REMOVE,
    ...workspaceHandler.removeWorkspaceMembers
  )
  // -----------------------------------------------------------------
  // Update Workspace Member Roles Operation
  // -----------------------------------------------------------------
  .patch(
    WORKSPACE_ROUTE.ID_MEMBER_ROLE_UPDATE,
    ...workspaceHandler.updateWorkspaceMemberRoles
  );
