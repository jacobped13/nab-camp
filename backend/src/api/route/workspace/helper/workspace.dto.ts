import { z } from 'zod';
import { HTTP_STATUS_CODE, JSONResponse } from '@common';
import {
  AcceptWorkspaceEmailInviteRequestParam,
  AcceptWorkspaceEmailInviteResponseBody,
  AssignDefaultWorkspaceRequestBody,
  AssignDefaultWorkspaceResponseBody,
  CancelWorkspaceAccessSubscriptionRequestParam,
  CancelWorkspaceAccessSubscriptionResponseBody,
  ChangeWorkspaceAccessSubscriptionPlanRequestBody,
  ChangeWorkspaceAccessSubscriptionPlanRequestParam,
  ChangeWorkspaceAccessSubscriptionPlanResponseBody,
  CreateDocumentFileUploadUrlsRequestBody,
  CreateDocumentFileUploadUrlsRequestData,
  CreateDocumentFileUploadUrlsRequestParam,
  CreateDocumentFileUploadUrlsResponseBody,
  CreateWorkspacePaymentMethodManagementSessionRequestBody,
  CreateWorkspacePaymentMethodManagementSessionRequestParam,
  CreateWorkspacePaymentMethodManagementSessionResponseBody,
  CreateWorkspaceRequestBody,
  CreateWorkspaceResponseBody,
  DeclineWorkspaceEmailInviteRequestParam,
  DeclineWorkspaceEmailInviteResponseBody,
  ExpireWorkspaceEmailInvitesRequestBody,
  ExpireWorkspaceEmailInvitesRequestParam,
  ExpireWorkspaceEmailInvitesResponseBody,
  FindWorkspaceEmailInviteByCodeRequestParam,
  FindWorkspaceEmailInviteByCodeResponseBody,
  FindWorkspaceEmailInvitesRequestParam,
  FindWorkspaceEmailInvitesResponseBody,
  FindWorkspaceInvoicesRequestParam,
  FindWorkspaceInvoicesResponseBody,
  FindWorkspaceMembersRequestParam,
  FindWorkspaceMembersResponseBody,
  ProcessDocumentFileRequestBody,
  ProcessDocumentFileRequestParam,
  ProcessDocumentFileResponseBody,
  RemoveDefaultWorkspaceResponseBody,
  RemoveWorkspaceMembersRequestBody,
  RemoveWorkspaceMembersRequestParam,
  RemoveWorkspaceMembersResponseBody,
  ResumeCancelledWorkspaceAccessSubscriptionRequestParam,
  ResumeCancelledWorkspaceAccessSubscriptionResponseBody,
  SendBusinessContactRequestBody,
  SendBusinessContactResponseBody,
  SendWorkspaceEmailInvitesRequestBody,
  SendWorkspaceEmailInvitesRequestParam,
  SendWorkspaceEmailInvitesResponseBody,
  UpdateWorkspaceMemberRolesRequestBody,
  UpdateWorkspaceMemberRolesRequestParam,
  UpdateWorkspaceMemberRolesResponseBody,
  UpdateWorkspaceRequestBody,
  UpdateWorkspaceRequestParam,
  UpdateWorkspaceResponseBody,
  WORKSPACE_EMAIL_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_ROLE,
  WORKSPACE_MEMBER_SORT_FIELD,
} from '@api-contracts/workspace';
import {
  SUPPORTED_DOCUMENT_FILE_EXTENSION_SET,
  SUPPORTED_DOCUMENT_FILE_MIME_TYPES,
} from '@service/document/business/helper/document.business.constant';
import { PAGINATION_DIRECTION, SORT_DIRECTION } from '@api-contracts/common';

// -----------------------------------------------------------------
// Create Workspace Operation
// -----------------------------------------------------------------

export const CreateWorkspaceRequestBodySchema: z.Schema<CreateWorkspaceRequestBody> =
  z.object({
    name: z.string(),
    url: z.string().url().optional(),
  });

export type CreateWorkspaceResponse = JSONResponse<
  CreateWorkspaceResponseBody,
  HTTP_STATUS_CODE.CREATED
>;

// -----------------------------------------------------------------
// Assign Default Workspace Operation
// -----------------------------------------------------------------

export const AssignDefaultWorkspaceRequestBodySchema: z.Schema<AssignDefaultWorkspaceRequestBody> =
  z.object({
    workspaceId: z.string().uuid(),
  });

export type AssignDefaultWorkspaceResponse = JSONResponse<
  AssignDefaultWorkspaceResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Remove Default Workspace Operation
// -----------------------------------------------------------------

export type RemoveDefaultWorkspaceResponse = JSONResponse<
  RemoveDefaultWorkspaceResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Update Workspace Operation
// -----------------------------------------------------------------

export const UpdateWorkspaceRequestParamSchema: z.Schema<UpdateWorkspaceRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const UpdateWorkspaceRequestBodySchema: z.Schema<UpdateWorkspaceRequestBody> =
  z
    .object({
      name: z.string().min(1).optional(),
      url: z.string().url().optional(),
    })
    .refine(
      (data) => {
        if (!data.name && !data.url) {
          return false;
        }
        return true;
      },
      {
        message: 'Must provide at least one field to update',
      }
    );

export type UpdateWorkspaceResponse = JSONResponse<
  UpdateWorkspaceResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Cancel Workspace Access Subscription Operation
// -----------------------------------------------------------------

export const CancelWorkspaceAccessSubscriptionRequestParamSchema: z.Schema<CancelWorkspaceAccessSubscriptionRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export type CancelWorkspaceAccessSubscriptionResponse = JSONResponse<
  CancelWorkspaceAccessSubscriptionResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Resume Cancelled Access Subscription Operation
// -----------------------------------------------------------------

export const ResumeCancelledWorkspaceAccessSubscriptionRequestParamSchema: z.Schema<ResumeCancelledWorkspaceAccessSubscriptionRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export type ResumeCancelledWorkspaceAccessSubscriptionResponse = JSONResponse<
  ResumeCancelledWorkspaceAccessSubscriptionResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Create Workspace Payment Method Management Session Operation
// -----------------------------------------------------------------

export const CreateWorkspacePaymentMethodManagementSessionRequestParamSchema: z.Schema<CreateWorkspacePaymentMethodManagementSessionRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const CreateWorkspacePaymentMethodManagementSessionRequestBodySchema: z.Schema<CreateWorkspacePaymentMethodManagementSessionRequestBody> =
  z.object({
    returnPath: z.string().optional(),
  });

export type CreateWorkspacePaymentMethodManagementSessionResponse =
  JSONResponse<
    CreateWorkspacePaymentMethodManagementSessionResponseBody,
    HTTP_STATUS_CODE.OK
  >;

// -----------------------------------------------------------------
// Change Workspace Access Subscription Plan Operation
// -----------------------------------------------------------------

export const ChangeWorkspaceAccessSubscriptionPlanRequestParamSchema: z.Schema<ChangeWorkspaceAccessSubscriptionPlanRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const ChangeWorkspaceAccessSubscriptionPlanRequestBodySchema: z.Schema<ChangeWorkspaceAccessSubscriptionPlanRequestBody> =
  z.object({
    planId: z.string().uuid(),
  });

export type ChangeWorkspaceAccessSubscriptionPlanResponse = JSONResponse<
  ChangeWorkspaceAccessSubscriptionPlanResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Find Workspace Invoices Operation
// -----------------------------------------------------------------

export const FindWorkspaceInvoicesRequestParamSchema: z.Schema<FindWorkspaceInvoicesRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const FindWorkspaceInvoicesRequestQuerySchema = z.object({
  cursor: z.string().optional(),
  direction: z.nativeEnum(PAGINATION_DIRECTION).optional(),
  limit: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Number(val)), {
      message: 'Limit must be a valid integer string',
    })
    .transform((val) => (val ? Number(val) : undefined)),
});

export type FindWorkspaceInvoicesResponse = JSONResponse<
  FindWorkspaceInvoicesResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Create Document File Upload URLs Operation
// -----------------------------------------------------------------

export const CreateDocumentFileUploadUrlsRequestParamSchema: z.Schema<CreateDocumentFileUploadUrlsRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const CreateDocumentFileUploadUrlsRequestDataSchema: z.Schema<CreateDocumentFileUploadUrlsRequestData> =
  z.object({
    mimeType: z.enum(SUPPORTED_DOCUMENT_FILE_MIME_TYPES),
    requestId: z.string().uuid(),
  });

export const CreateDocumentFileUploadUrlsRequestBodySchema: z.Schema<CreateDocumentFileUploadUrlsRequestBody> =
  z.object({
    files: z.array(CreateDocumentFileUploadUrlsRequestDataSchema),
  });

export type CreateDocumentFileUploadUrlsResponse = JSONResponse<
  CreateDocumentFileUploadUrlsResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Process Document File Operation
// -----------------------------------------------------------------

export const ProcessDocumentFileRequestParamSchema: z.Schema<ProcessDocumentFileRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const ProcessDocumentFileRequestBodySchema: z.Schema<ProcessDocumentFileRequestBody> =
  z.object({
    fileId: z.string().uuid(),
    fileExtension: z.string().refine((fileExtension) => {
      return SUPPORTED_DOCUMENT_FILE_EXTENSION_SET.has(fileExtension);
    }),
  });

export type ProcessDocumentFileResponse = JSONResponse<
  ProcessDocumentFileResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Find Workspace Email Invites Operation
// -----------------------------------------------------------------

export const FindWorkspaceEmailInvitesRequestParamSchema: z.Schema<FindWorkspaceEmailInvitesRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const FindWorkspaceEmailInvitesRequestQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Number(val)), {
      message: 'Limit must be a valid integer string',
    })
    .transform((val) => (val ? Number(val) : undefined)),
  direction: z.nativeEnum(PAGINATION_DIRECTION).optional(),
  cursor: z.string().optional(),
  sortDirection: z.nativeEnum(SORT_DIRECTION).optional(),
  sortField: z.nativeEnum(WORKSPACE_EMAIL_INVITE_SORT_FIELD).optional(),
});

export type FindWorkspaceEmailInvitesResponse = JSONResponse<
  FindWorkspaceEmailInvitesResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Send Workspace Email Invites Operation
// -----------------------------------------------------------------

export const SendWorkspaceEmailInvitesRequestParamSchema: z.Schema<SendWorkspaceEmailInvitesRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const SendWorkspaceEmailInvitesRequestBodySchema: z.Schema<SendWorkspaceEmailInvitesRequestBody> =
  z.object({
    emails: z.array(z.string().email()).refine(
      (emails) => {
        const uniqueEmails = new Set(emails);
        return uniqueEmails.size === emails.length;
      },
      {
        message: 'Emails must be unique',
      }
    ),
  });

export type SendWorkspaceEmailInvitesResponse = JSONResponse<
  SendWorkspaceEmailInvitesResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Expire Workspace Email Invite Request Body
// -----------------------------------------------------------------

export const ExpireWorkspaceEmailInvitesRequestParamSchema: z.Schema<ExpireWorkspaceEmailInvitesRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const ExpireWorkspaceEmailInvitesRequestBodySchema: z.Schema<ExpireWorkspaceEmailInvitesRequestBody> =
  z.object({
    inviteIds: z.array(z.string().uuid()),
  });

export type ExpireWorkspaceEmailInvitesResponse = JSONResponse<
  ExpireWorkspaceEmailInvitesResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Accept Workspace Email Invite Operation
// -----------------------------------------------------------------

export const AcceptWorkspaceEmailInviteRequestParamSchema: z.Schema<AcceptWorkspaceEmailInviteRequestParam> =
  z.object({
    id: z.string(),
  });

export type AcceptWorkspaceEmailInviteResponse = JSONResponse<
  AcceptWorkspaceEmailInviteResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Decline Workspace Email Invite Operation
// -----------------------------------------------------------------

export const DeclineWorkspaceEmailInviteRequestParamSchema: z.Schema<DeclineWorkspaceEmailInviteRequestParam> =
  z.object({
    id: z.string(),
  });

export type DeclineWorkspaceEmailInviteResponse = JSONResponse<
  DeclineWorkspaceEmailInviteResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Find Workspace Email Invite by Code Operation
// -----------------------------------------------------------------

export const FindWorkspaceEmailInviteByCodeRequestParamSchema: z.Schema<FindWorkspaceEmailInviteByCodeRequestParam> =
  z.object({
    code: z.string(),
  });

export type FindWorkspaceEmailInviteByCodeResponse = JSONResponse<
  FindWorkspaceEmailInviteByCodeResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Send Business Contact Operation
// -----------------------------------------------------------------

export const SendBusinessContactRequestBodySchema: z.Schema<SendBusinessContactRequestBody> =
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    companySize: z.string(),
    companyName: z.string(),
  });

export type SendBusinessContactResponse = JSONResponse<
  SendBusinessContactResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Find Workspace Members Operation
// -----------------------------------------------------------------

export const FindWorkspaceMembersRequestParamSchema: z.Schema<FindWorkspaceMembersRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const FindWorkspaceMembersRequestQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .refine((val) => val === undefined || !isNaN(Number(val)), {
      message: 'Limit must be a valid integer string',
    })
    .transform((val) => (val ? Number(val) : undefined)),
  direction: z.nativeEnum(PAGINATION_DIRECTION).optional(),
  cursor: z.string().optional(),
  sortDirection: z.nativeEnum(SORT_DIRECTION).optional(),
  sortField: z.nativeEnum(WORKSPACE_MEMBER_SORT_FIELD).optional(),
});

export type FindWorkspaceMembersResponse = JSONResponse<
  FindWorkspaceMembersResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Remove Workspace Members Operation
// -----------------------------------------------------------------

export const RemoveWorkspaceMembersRequestParamSchema: z.Schema<RemoveWorkspaceMembersRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const RemoveWorkspaceMembersRequestBodySchema: z.Schema<RemoveWorkspaceMembersRequestBody> =
  z.object({
    memberIds: z.array(z.string().uuid()),
  });

export type RemoveWorkspaceMembersResponse = JSONResponse<
  RemoveWorkspaceMembersResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Update Workspace Member Roles Operation
// -----------------------------------------------------------------

export const UpdateWorkspaceMemberRolesRequestParamSchema: z.Schema<UpdateWorkspaceMemberRolesRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const UpdateWorkspaceMemberRolesRequestBodySchema: z.Schema<UpdateWorkspaceMemberRolesRequestBody> =
  z.object({
    members: z.array(
      z.object({
        id: z.string().uuid(),
        role: z.nativeEnum(WORKSPACE_MEMBER_ROLE),
      })
    ),
  });

export type UpdateWorkspaceMemberRolesResponse = JSONResponse<
  UpdateWorkspaceMemberRolesResponseBody,
  HTTP_STATUS_CODE.OK
>;
