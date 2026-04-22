import {
  BusinessResultContextErrorDto,
  BusinessResultInputContextErrorDto,
} from '@common';
import { ROLE } from '@service/authorization';
import { z } from 'zod';
import {
  WorkspaceAccessSubscription,
  WorkspaceMembership,
  WorkspaceOwner,
} from './workspace.business.model';
import {
  WorkspaceEntity,
  WorkspaceInviteEntity,
} from '../../data/helper/workspace.data.model';
import {
  BILLING_PROVIDER,
  CustomerDto,
  CustomerConnectionEntity,
  ProviderCheckoutSession,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  SubscriptionConnectionEntity,
  SubscriptionPlan,
} from '@service/billing';
import {
  ProviderBillingManagementSession,
  ProviderInvoice,
} from '@service/billing/provider/helper/billing.provider.model';
import { APP_PATH } from '@lib/util/url.util';
import {
  CursorPaginationInputDto,
  CursorPaginationInputDtoSchema,
  CursorPaginationOutputDto,
  SortInputDtoSchema,
} from '@lib/util/pagination.util';
import {
  WorkspaceMemberSortInputDto,
  WorkspaceMemberSortInputDtoSchema,
} from '../../common/workspace.dto';
import { WORKSPACE_INVITE_SORT_FIELD } from '../../common/workspace.constant';
import { BillingProviderInvoiceFilterSchema } from '@service/billing/business/helper/billing.business.dto';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

export const WorkspaceAccessSubscriptionFilterSchema = z.object({
  statuses: z
    .array(z.nativeEnum(BILLING_PROVIDER_SUBSCRIPTION_STATUS))
    .optional(),
});

export const WorkspaceEmailInviteCodeSchema = z.string().uuid();

export const WorkspaceEmailInviteSortInputDtoSchema = SortInputDtoSchema.extend(
  {
    field: z.nativeEnum(WORKSPACE_INVITE_SORT_FIELD),
  }
);

export type WorkspaceEmailInviteSortInputDto = z.infer<
  typeof WorkspaceEmailInviteSortInputDtoSchema
>;

// -----------------------------------------------------------------
// Create Workspace and Member by User
// -----------------------------------------------------------------

export const CreateWorkspaceAndMemberInputDtoSchema = z.object({
  workspaceName: z.string(),
  workspaceUrl: z.string().url().optional(),
  billingEmail: z.string().email(),
  userId: z.string(),
  assignDefaultWorkspace: z.boolean().optional(),
});

export type CreateWorkspaceAndMemberInputDto = z.infer<
  typeof CreateWorkspaceAndMemberInputDtoSchema
>;

export type CreateWorkspaceAndMemberOutputDto = {
  workspace: WorkspaceEntity;
  workspaceMembership: WorkspaceMembership;
  billingProvider: CustomerDto;
};

export type CreateWorkspaceAndMemberErrorDto =
  BusinessResultInputContextErrorDto<CreateWorkspaceAndMemberInputDto>;

// -----------------------------------------------------------------
// Find Workspace Owner
// -----------------------------------------------------------------

export const FindWorkspaceOwnerInputDtoSchema = z.object({
  workspaceId: z.string(),
});

export type FindWorkspaceOwnerInputDto = z.infer<
  typeof FindWorkspaceOwnerInputDtoSchema
>;

export type FindWorkspaceOwnerOutputDto = {
  owner: WorkspaceOwner;
};

export type FindWorkspaceOwnerErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceOwnerInputDto>;

// -----------------------------------------------------------------
// Find All Workspace Owners by Workspace IDs
// -----------------------------------------------------------------

export const FindAllWorkspaceOwnersByWorkspaceIdsInputDtoSchema = z.object({
  workspaceIds: z.array(z.string()),
});

export type FindAllWorkspaceOwnersByWorkspaceIdsInputDto = z.infer<
  typeof FindAllWorkspaceOwnersByWorkspaceIdsInputDtoSchema
>;

export type FindAllWorkspaceOwnersByWorkspaceIdsOutputDto = {
  owners: WorkspaceOwner[];
  ownerMap: Map<string, WorkspaceOwner>;
};

export type FindAllWorkspaceOwnersByWorkspaceIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllWorkspaceOwnersByWorkspaceIdsInputDto>;

// -----------------------------------------------------------------
// Assign Workspace Owner
// -----------------------------------------------------------------

export const AssignWorkspaceOwnerInputDtoSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
});

export type AssignWorkspaceOwnerInputDto = z.infer<
  typeof AssignWorkspaceOwnerInputDtoSchema
>;

export type AssignWorkspaceOwnerOutputDto = {
  owner: WorkspaceOwner;
};

export type AssignWorkspaceOwnerErrorDto =
  BusinessResultInputContextErrorDto<AssignWorkspaceOwnerInputDto>;

// -----------------------------------------------------------------
// Assign Workspace Member Role
// -----------------------------------------------------------------

export const AssignWorkspaceMemberRoleInputDtoSchema = z.object({
  workspaceId: z.string(),
  workspaceMemberId: z.string(),
  role: z.nativeEnum(ROLE),
});

export type AssignWorkspaceMemberRoleInputDto = z.infer<
  typeof AssignWorkspaceMemberRoleInputDtoSchema
>;

export type AssignWorkspaceMemberRoleOutputDto = {
  workspaceId: string;
  workspaceMemberId: string;
  role: ROLE;
};

export type AssignWorkspaceMemberRoleErrorDto =
  BusinessResultInputContextErrorDto<AssignWorkspaceMemberRoleInputDto>;

// -----------------------------------------------------------------
// Assign Default Workspace
// -----------------------------------------------------------------

export const AssignDefaultWorkspaceInputDtoSchema = z.object({
  userId: z.string(),
  workspaceId: z.string(),
});

export type AssignDefaultWorkspaceInputDto = z.infer<
  typeof AssignDefaultWorkspaceInputDtoSchema
>;

export type AssignDefaultWorkspaceOutputDto = {
  workspace: WorkspaceEntity;
};

export type AssignDefaultWorkspaceErrorDto =
  BusinessResultInputContextErrorDto<AssignDefaultWorkspaceInputDto>;

// -----------------------------------------------------------------
// Find Workspace Membership by ID
// -----------------------------------------------------------------

export const FindWorkspaceMembershipByIdInputDtoSchema = z.object({
  workspaceMemberId: z.string(),
});

export type FindWorkspaceMembershipByIdInputDto = z.infer<
  typeof FindWorkspaceMembershipByIdInputDtoSchema
>;

export type FindWorkspaceMembershipByIdOutputDto = {
  workspaceMembership: WorkspaceMembership;
};

export type FindWorkspaceMembershipByIdErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceMembershipByIdInputDto>;

// -----------------------------------------------------------------
// Remove Default Workspace
// -----------------------------------------------------------------

export const RemoveDefaultWorkspaceInputDtoSchema = z.object({
  userId: z.string(),
});

export type RemoveDefaultWorkspaceInputDto = z.infer<
  typeof RemoveDefaultWorkspaceInputDtoSchema
>;

export type RemoveDefaultWorkspaceOutputDto = {
  workspace: WorkspaceEntity;
};

export type RemoveDefaultWorkspaceErrorDto =
  BusinessResultInputContextErrorDto<RemoveDefaultWorkspaceInputDto>;

// -----------------------------------------------------------------
// Add User to Workspace
// -----------------------------------------------------------------

export const AddUserToWorkspaceInputDtoSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  role: z.nativeEnum(ROLE),
  assignDefaultWorkspace: z.boolean().optional(),
});

export type AddUserToWorkspaceInputDto = z.infer<
  typeof AddUserToWorkspaceInputDtoSchema
>;

export type AddUserToWorkspaceOutputDto = {
  isDefault: boolean;
  workspaceMembership: WorkspaceMembership;
};

export type AddUserToWorkspaceErrorDto =
  BusinessResultInputContextErrorDto<AddUserToWorkspaceInputDto>;

// -----------------------------------------------------------------
// Remove Workspace Membership
// -----------------------------------------------------------------

export const RemoveWorkspaceMembershipInputDtoSchema = z.object({
  workspaceId: z.string(),
  workspaceMemberId: z.string(),
});

export type RemoveWorkspaceMembershipInputDto = z.infer<
  typeof RemoveWorkspaceMembershipInputDtoSchema
>;

export type RemoveWorkspaceMembershipOutputDto = {
  workspaceMembership: WorkspaceMembership;
};

export type RemoveWorkspaceMembershipErrorDto =
  BusinessResultInputContextErrorDto<RemoveWorkspaceMembershipInputDto>;

// -----------------------------------------------------------------
// Update Workspace Member Role
// -----------------------------------------------------------------

export const UpdateWorkspaceMemberRoleInputDtoSchema = z.object({
  workspaceId: z.string(),
  workspaceMemberId: z.string(),
  role: z.nativeEnum(ROLE),
});

export type UpdateWorkspaceMemberRoleInputDto = z.infer<
  typeof UpdateWorkspaceMemberRoleInputDtoSchema
>;

export type UpdateWorkspaceMemberRoleOutputDto = {
  workspaceMembership: WorkspaceMembership;
};

export type UpdateWorkspaceMemberRoleErrorDto =
  BusinessResultInputContextErrorDto<UpdateWorkspaceMemberRoleInputDto>;

// -----------------------------------------------------------------
// Find Workspace Member Role by Workspace Id and Member Id
// -----------------------------------------------------------------

export const FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDtoSchema =
  z.object({
    workspaceId: z.string(),
    workspaceMemberId: z.string(),
  });

export type FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDto = z.infer<
  typeof FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDtoSchema
>;

export type FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDto>;

// -----------------------------------------------------------------
// Find All Workspace Member Roles by Workspace Ids and Member Ids
// -----------------------------------------------------------------

export const FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDtoSchema =
  z.object({
    workspaceMembers: z.array(
      z.object({
        workspaceId: z.string(),
        workspaceMemberId: z.string(),
      })
    ),
  });

export type FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDto =
  z.infer<
    typeof FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDtoSchema
  >;

export type FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdOutputDto = {
  roleMap: Map<string, ROLE>;
  roles: {
    workspaceId: string;
    workspaceMemberId: string;
    role: ROLE;
  }[];
};

export type FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdErrorDto =
  BusinessResultInputContextErrorDto<FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDto>;

// -----------------------------------------------------------------
// Find Workspace Membership by Workspace Id and User Id
// -----------------------------------------------------------------

export const FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDtoSchema =
  z.object({
    workspaceId: z.string(),
    userId: z.string(),
  });

export type FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDto = z.infer<
  typeof FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDtoSchema
>;

export type FindWorkspaceMembershipByWorkspaceIdAndUserIdErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDto>;

// -----------------------------------------------------------------
// Find Workspace by User Default
// -----------------------------------------------------------------

export const FindWorkspaceByUserDefaultInputDtoSchema = z.object({
  userId: z.string(),
});

export type FindWorkspaceByUserDefaultInputDto = z.infer<
  typeof FindWorkspaceByUserDefaultInputDtoSchema
>;

export type FindWorkspaceByUserDefaultErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceByUserDefaultInputDto>;

// -----------------------------------------------------------------
// Find Workspace and Membership by User Default
// -----------------------------------------------------------------

export const FindWorkspaceAndMembershipByUserDefaultInputDtoSchema = z.object({
  userId: z.string(),
});

export type FindWorkspaceAndMembershipByUserDefaultInputDto = z.infer<
  typeof FindWorkspaceAndMembershipByUserDefaultInputDtoSchema
>;

export type FindWorkspaceAndMembershipByUserDefaultOutputDto = {
  workspace: WorkspaceEntity;
  workspaceMembership: WorkspaceMembership;
};

export type FindWorkspaceAndMembershipByUserDefaultErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceAndMembershipByUserDefaultInputDto>;

// -----------------------------------------------------------------
// Find All Workspaces and Memberships by User ID
// -----------------------------------------------------------------

export const FindAllWorkspacesAndMembershipsByUserIdInputDtoSchema = z.object({
  userId: z.string(),
});

export type FindAllWorkspacesAndMembershipsByUserIdInputDto = z.infer<
  typeof FindAllWorkspacesAndMembershipsByUserIdInputDtoSchema
>;

export type FindAllWorkspacesAndMembershipsByUserIdOutputDto = {
  workspaces: {
    isDefault: boolean;
    workspace: WorkspaceEntity;
    workspaceMembership: WorkspaceMembership;
  }[];
};

export type FindAllWorkspacesAndMembershipsByUserIdErrorDto =
  BusinessResultInputContextErrorDto<FindAllWorkspacesAndMembershipsByUserIdInputDto>;

// -----------------------------------------------------------------
// Cursor Paginate Workspace Memberships
// -----------------------------------------------------------------

export const CursorPaginateWorkspaceMembershipsInputDtoSchema = z.object({
  sort: z.array(WorkspaceMemberSortInputDtoSchema).optional(),
  pagination: CursorPaginationInputDtoSchema,
  filter: z
    .object({
      workspaceId: z.string().optional(),
    })
    .optional(),
});

export type CursorPaginateWorkspaceMembershipsInputDto = z.infer<
  typeof CursorPaginateWorkspaceMembershipsInputDtoSchema
>;

export type CursorPaginateWorkspaceMembershipsOutputDto =
  CursorPaginationOutputDto<WorkspaceMembership>;

export type CursorPaginateWorkspaceMembershipsErrorDto =
  BusinessResultInputContextErrorDto<CursorPaginateWorkspaceMembershipsInputDto>;

// -----------------------------------------------------------------
// Cursor Paginate Workspace Memberships by Workspace ID
// -----------------------------------------------------------------

export type CursorPaginateWorkspaceMembershipsByWorkspaceIdInputDto = {
  workspaceId: string;
  sort?: WorkspaceMemberSortInputDto[];
  pagination: CursorPaginationInputDto;
  filter?: Omit<
    CursorPaginateWorkspaceMembershipsInputDto['filter'],
    'workspaceId'
  >;
};

// -----------------------------------------------------------------
// Update Workspace Details
// -----------------------------------------------------------------

export const UpdateWorkspaceDetailsInputDtoSchema = z.object({
  workspaceId: z.string(),
  workspaceName: z.string().min(1).optional(),
  workspaceUrl: z.string().url().optional(),
});

export type UpdateWorkspaceDetailsInputDto = z.infer<
  typeof UpdateWorkspaceDetailsInputDtoSchema
>;

export type UpdateWorkspaceDetailsErrorDto =
  BusinessResultInputContextErrorDto<UpdateWorkspaceDetailsInputDto>;

// -----------------------------------------------------------------
// Find Workspace by ID
// -----------------------------------------------------------------

export const FindWorkspaceByIdInputDtoSchema = z.object({
  id: z.string(),
});

export type FindWorkspaceByIdInputDto = z.infer<
  typeof FindWorkspaceByIdInputDtoSchema
>;

export type FindWorkspaceByIdErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceByIdInputDto>;

// -----------------------------------------------------------------
// Create Workspace Billing Provider
// -----------------------------------------------------------------

export const CreateWorkspaceBillingProviderInputDtoSchema = z.object({
  email: z.string().email(),
  workspaceId: z.string(),
  provider: z.nativeEnum(BILLING_PROVIDER),
});

export type CreateWorkspaceBillingProviderInputDto = z.infer<
  typeof CreateWorkspaceBillingProviderInputDtoSchema
>;

export type CreateWorkspaceBillingProviderOutputDto = CustomerDto;

export type CreateWorkspaceBillingProviderErrorDto =
  BusinessResultInputContextErrorDto<CreateWorkspaceBillingProviderInputDto>;

// -----------------------------------------------------------------
// Find Workspace Billing Provider
// -----------------------------------------------------------------

export const FindWorkspaceBillingProviderInputDtoSchema = z.object({
  workspaceId: z.string(),
});

export type FindWorkspaceBillingProviderInputDto = z.infer<
  typeof FindWorkspaceBillingProviderInputDtoSchema
>;

export type FindWorkspaceBillingProviderOutputDto = CustomerDto;

export type FindWorkspaceBillingProviderErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceBillingProviderInputDto>;

// -----------------------------------------------------------------
// Find All Workspace Billing Provider Connections by Workspace IDs
// -----------------------------------------------------------------

export const FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDtoSchema =
  z.object({
    workspaceIds: z.array(z.string()),
  });

export type FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDto =
  z.infer<
    typeof FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDtoSchema
  >;
export type FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsOutputDto =
  {
    connections: CustomerConnectionEntity[];
    connectionMap: Map<string, CustomerConnectionEntity>;
  };

export type FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDto>;

// -----------------------------------------------------------------
// Find Workspace Checkout Session by ID
// -----------------------------------------------------------------

export const FindWorkspaceCheckoutSessionByIdInputDtoSchema = z.object({
  sessionId: z.string(),
  workspaceId: z.string(),
});

export type FindWorkspaceCheckoutSessionByIdInputDto = z.infer<
  typeof FindWorkspaceCheckoutSessionByIdInputDtoSchema
>;

export type FindWorkspaceCheckoutSessionByIdOutputDto = {
  session: ProviderCheckoutSession;
};

export type FindWorkspaceCheckoutSessionByIdErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceCheckoutSessionByIdInputDto>;

// -----------------------------------------------------------------
// Find Workspace Billing Provider Connection
// -----------------------------------------------------------------

export const FindWorkspaceBillingProviderConnectionInputDtoSchema = z.object({
  workspaceId: z.string(),
});

export type FindWorkspaceBillingProviderConnectionInputDto = z.infer<
  typeof FindWorkspaceBillingProviderConnectionInputDtoSchema
>;

export type FindWorkspaceBillingProviderConnectionOutputDto = {
  connection: CustomerConnectionEntity;
};

export type FindWorkspaceBillingProviderConnectionErrorDto =
  BusinessResultInputContextErrorDto<FindWorkspaceBillingProviderConnectionInputDto>;

// -----------------------------------------------------------------
// Find All Workspace Access Subscriptions by Workspace IDs
// -----------------------------------------------------------------

export const FindAllAccessSubscriptionsByWorkspaceIdsInputDtoSchema = z.object({
  workspaceIds: z.array(z.string()),
  filter: WorkspaceAccessSubscriptionFilterSchema.optional(),
});

export type FindAllAccessSubscriptionsByWorkspaceIdsInputDto = z.infer<
  typeof FindAllAccessSubscriptionsByWorkspaceIdsInputDtoSchema
>;

export type FindAllAccessSubscriptionsByWorkspaceIdsOutputDto = {
  subscriptions: WorkspaceAccessSubscription[];
  subscriptionMap: Map<string, WorkspaceAccessSubscription>;
};

export type FindAllAccessSubscriptionsByWorkspaceIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllAccessSubscriptionsByWorkspaceIdsInputDto>;

// -----------------------------------------------------------------
// Extract Primary Subscription Connections
// -----------------------------------------------------------------

export type ExtractPrimarySubscriptionConnectionsInputDto = {
  connections: SubscriptionConnectionEntity[];
};

export type ExtractPrimarySubscriptionConnectionsOutputDto = {
  connection: SubscriptionConnectionEntity;
};

export type ExtractPrimarySubscriptionConnectionsErrorDto =
  BusinessResultInputContextErrorDto<ExtractPrimarySubscriptionConnectionsInputDto>;

// -----------------------------------------------------------------
// Find All Primary Subscription Connections by Workspace IDs
// -----------------------------------------------------------------

export const FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDtoSchema =
  z.object({
    workspaceIds: z.array(z.string()),
  });

export type FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDto =
  z.infer<
    typeof FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDtoSchema
  >;

export type FindAllPrimarySubscriptionConnectionsByWorkspaceIdsOutputDto = {
  connections: SubscriptionConnectionEntity[];
  connectionMap: Map<string, SubscriptionConnectionEntity>;
};

export type FindAllPrimarySubscriptionConnectionsByWorkspaceIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDto>;

// -----------------------------------------------------------------
// Find All Access Subscription Plans
// -----------------------------------------------------------------

export type FindAllAccessSubscriptionPlansOutputDto = {
  plans: SubscriptionPlan[];
};

export type FindAllAccessSubscriptionPlansErrorDto =
  BusinessResultContextErrorDto;

// -----------------------------------------------------------------
// Create Access Subscription Checkout Session
// -----------------------------------------------------------------

export const CreateAccessSubscriptionCheckoutSessionInputDtoSchema = z.object({
  workspaceId: z.string(),
  planId: z.string(),
  quantity: z.number().int().positive(),
});

export type CreateAccessSubscriptionCheckoutSessionInputDto = z.infer<
  typeof CreateAccessSubscriptionCheckoutSessionInputDtoSchema
>;

export type CreateAccessSubscriptionCheckoutSessionOutputDto = {
  session: ProviderCheckoutSession;
};

export type CreateAccessSubscriptionCheckoutSessionErrorDto =
  BusinessResultInputContextErrorDto<CreateAccessSubscriptionCheckoutSessionInputDto>;

// -----------------------------------------------------------------
// Find Access Subscription by Workspace ID
// -----------------------------------------------------------------

export const FindAccessSubscriptionByWorkspaceIdInputDtoSchema = z.object({
  workspaceId: z.string(),
});

export type FindAccessSubscriptionByWorkspaceIdInputDto = z.infer<
  typeof FindAccessSubscriptionByWorkspaceIdInputDtoSchema
>;

export type FindAccessSubscriptionByWorkspaceIdOutputDto = {
  subscription: WorkspaceAccessSubscription;
};

export type FindAccessSubscriptionByWorkspaceIdErrorDto =
  BusinessResultInputContextErrorDto<FindAccessSubscriptionByWorkspaceIdInputDto>;

// -----------------------------------------------------------------
// Cancel Access Subscription at Period End
// -----------------------------------------------------------------

export const CancelAccessSubscriptionAtPeriodEndInputDtoSchema = z.object({
  workspaceId: z.string(),
});

export type CancelAccessSubscriptionAtPeriodEndInputDto = z.infer<
  typeof CancelAccessSubscriptionAtPeriodEndInputDtoSchema
>;

export type CancelAccessSubscriptionAtPeriodEndOutputDto = {
  subscription: WorkspaceAccessSubscription;
};

export type CancelAccessSubscriptionAtPeriodEndErrorDto =
  BusinessResultInputContextErrorDto<CancelAccessSubscriptionAtPeriodEndInputDto>;

// -----------------------------------------------------------------
// Resume Cancelled Access Subscription
// -----------------------------------------------------------------

export const ResumeCancelledAccessSubscriptionInputDtoSchema = z.object({
  workspaceId: z.string(),
});

export type ResumeCancelledAccessSubscriptionInputDto = z.infer<
  typeof ResumeCancelledAccessSubscriptionInputDtoSchema
>;

export type ResumeCancelledAccessSubscriptionOutputDto = {
  subscription: WorkspaceAccessSubscription;
};

export type ResumeCancelledAccessSubscriptionErrorDto =
  BusinessResultInputContextErrorDto<ResumeCancelledAccessSubscriptionInputDto>;

// -----------------------------------------------------------------
// Create Payment Method Management Session
// -----------------------------------------------------------------

export const CreatePaymentMethodManagementSessionInputDtoSchema = z.object({
  workspaceId: z.string(),
  returnPath: z.nativeEnum(APP_PATH).optional(),
});

export type CreatePaymentMethodManagementSessionInputDto = z.infer<
  typeof CreatePaymentMethodManagementSessionInputDtoSchema
>;

export type CreatePaymentMethodManagementSessionOutputDto = {
  session: ProviderBillingManagementSession;
};

export type CreatePaymentMethodManagementSessionErrorDto =
  BusinessResultInputContextErrorDto<CreatePaymentMethodManagementSessionInputDto>;

// -----------------------------------------------------------------
// Change Access Subscription Plan
// -----------------------------------------------------------------

export const ChangeAccessSubscriptionPlanInputDtoSchema = z.object({
  workspaceId: z.string(),
  planId: z.string(),
});

export type ChangeAccessSubscriptionPlanInputDto = z.infer<
  typeof ChangeAccessSubscriptionPlanInputDtoSchema
>;

export type ChangeAccessSubscriptionPlanOutputDto = {
  subscription: WorkspaceAccessSubscription;
};

export type ChangeAccessSubscriptionPlanErrorDto =
  BusinessResultInputContextErrorDto<ChangeAccessSubscriptionPlanInputDto>;

// -----------------------------------------------------------------
// Cursor Paginate Workspace Invoices
// -----------------------------------------------------------------

export const CursorPaginateWorkspaceInvoicesInputDtoSchema = z.object({
  workspaceId: z.string(),
  pagination: CursorPaginationInputDtoSchema,
  filter: BillingProviderInvoiceFilterSchema.optional(),
});

export type CursorPaginateWorkspaceInvoicesInputDto = z.infer<
  typeof CursorPaginateWorkspaceInvoicesInputDtoSchema
>;

export type CursorPaginateWorkspaceInvoicesOutputDto =
  CursorPaginationOutputDto<ProviderInvoice>;

export type CursorPaginateWorkspaceInvoicesErrorDto =
  BusinessResultInputContextErrorDto<CursorPaginateWorkspaceInvoicesInputDto>;

// -----------------------------------------------------------------
// Find Effective Workspace Email Invite by ID
// -----------------------------------------------------------------

export const FindEffectiveWorkspaceEmailInviteByIdInputDtoSchema = z.object({
  inviteId: z.string(),
});

export type FindEffectiveWorkspaceEmailInviteByIdInputDto = z.infer<
  typeof FindEffectiveWorkspaceEmailInviteByIdInputDtoSchema
>;

export type FindEffectiveWorkspaceEmailInviteByIdOutputDto = {
  invite: WorkspaceInviteEntity;
};

export type FindEffectiveWorkspaceEmailInviteByIdErrorDto =
  BusinessResultInputContextErrorDto<FindEffectiveWorkspaceEmailInviteByIdInputDto>;

// -----------------------------------------------------------------
// Find Effective Workspace Email Invite by Code and User ID
// -----------------------------------------------------------------

export const FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDtoSchema =
  z.object({
    code: z.string(),
    userId: z.string(),
  });

export type FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDto = z.infer<
  typeof FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDtoSchema
>;

export type FindEffectiveWorkspaceEmailInviteByCodeAndUserIdOutputDto = {
  invite: WorkspaceInviteEntity;
  workspace: WorkspaceEntity;
};

export type FindEffectiveWorkspaceEmailInviteByCodeAndUserIdErrorDto =
  BusinessResultInputContextErrorDto<FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDto>;

// -----------------------------------------------------------------
// Cursor Paginate Workspace Email Invites
// -----------------------------------------------------------------

export const CursorPaginateWorkspaceEmailInvitesInputDtoSchema = z.object({
  sort: z.array(WorkspaceEmailInviteSortInputDtoSchema).optional(),
  pagination: CursorPaginationInputDtoSchema,
  filter: z
    .object({
      workspaceId: z.string().optional(),
      expired: z.boolean().optional(),
      declined: z.boolean().optional(),
      accepted: z.boolean().optional(),
    })
    .optional(),
});

export type CursorPaginateWorkspaceEmailInvitesInputDto = z.infer<
  typeof CursorPaginateWorkspaceEmailInvitesInputDtoSchema
>;

export type CursorPaginateWorkspaceEmailInvitesOutputDto =
  CursorPaginationOutputDto<WorkspaceInviteEntity>;

export type CursorPaginateWorkspaceEmailInvitesErrorDto =
  BusinessResultInputContextErrorDto<CursorPaginateWorkspaceEmailInvitesInputDto>;

// -----------------------------------------------------------------
// Cursor Paginate Workspace Email Invites by Workspace ID
// -----------------------------------------------------------------

export type CursorPaginateWorkspaceEmailInvitesByWorkspaceIdInputDto = {
  workspaceId: string;
  sort?: WorkspaceEmailInviteSortInputDto[];
  pagination: CursorPaginationInputDto;
  filter?: Omit<
    CursorPaginateWorkspaceEmailInvitesInputDto['filter'],
    'workspaceId'
  >;
};

// -----------------------------------------------------------------
// Create Workspace Email Invite
// -----------------------------------------------------------------

export const CreateWorkspaceEmailInviteInputDtoSchema = z.object({
  workspaceId: z.string(),
  email: z.string().email(),
});

export type CreateWorkspaceEmailInviteInputDto = z.infer<
  typeof CreateWorkspaceEmailInviteInputDtoSchema
>;

export type CreateWorkspaceEmailInviteOutputDto = {
  code: string;
  invite: WorkspaceInviteEntity;
};

export type CreateWorkspaceEmailInviteErrorDto =
  BusinessResultInputContextErrorDto<CreateWorkspaceEmailInviteInputDto>;

// -----------------------------------------------------------------
// Send Workspace Email Invite
// -----------------------------------------------------------------

export const SendWorkspaceEmailInviteInputDtoSchema = z.object({
  workspaceId: z.string(),
  email: z.string().email(),
});

export type SendWorkspaceEmailInviteInputDto = z.infer<
  typeof SendWorkspaceEmailInviteInputDtoSchema
>;

export type SendWorkspaceEmailInviteOutputDto = {
  code: string;
  invite: WorkspaceInviteEntity;
};

export type SendWorkspaceEmailInviteErrorDto =
  BusinessResultInputContextErrorDto<SendWorkspaceEmailInviteInputDto>;

// -----------------------------------------------------------------
// Expire Workspace Email Invite
// -----------------------------------------------------------------

export const ExpireWorkspaceEmailInviteInputDtoSchema = z.object({
  workspaceId: z.string(),
  inviteId: z.string(),
});

export type ExpireWorkspaceEmailInviteInputDto = z.infer<
  typeof ExpireWorkspaceEmailInviteInputDtoSchema
>;

export type ExpireWorkspaceEmailInviteOutputDto = {
  invite: WorkspaceInviteEntity;
};

export type ExpireWorkspaceEmailInviteErrorDto =
  BusinessResultInputContextErrorDto<ExpireWorkspaceEmailInviteInputDto>;

// -----------------------------------------------------------------
// Verify Workspace Email Invite
// -----------------------------------------------------------------

export const VerifyWorkspaceEmailInviteInputDtoSchema = z.object({
  inviteId: z.string(),
});

export type VerifyWorkspaceEmailInviteInputDto = z.infer<
  typeof VerifyWorkspaceEmailInviteInputDtoSchema
>;

export type VerifyWorkspaceEmailInviteOutputDto = {
  invite: WorkspaceInviteEntity;
};

export type VerifyWorkspaceEmailInviteErrorDto =
  BusinessResultInputContextErrorDto<VerifyWorkspaceEmailInviteInputDto>;

// -----------------------------------------------------------------
// Accept Workspace Email Invite
// -----------------------------------------------------------------

export const AcceptWorkspaceEmailInviteInputDtoSchema = z.object({
  inviteId: z.string(),
  userId: z.string(),
});

export type AcceptWorkspaceEmailInviteInputDto = z.infer<
  typeof AcceptWorkspaceEmailInviteInputDtoSchema
>;

export type AcceptWorkspaceEmailInviteOutputDto = {
  invite: WorkspaceInviteEntity;
  workspaceMembership: WorkspaceMembership;
};

export type AcceptWorkspaceEmailInviteErrorDto =
  BusinessResultInputContextErrorDto<AcceptWorkspaceEmailInviteInputDto>;

// -----------------------------------------------------------------
// Decline Workspace Email Invite
// -----------------------------------------------------------------

export const DeclineWorkspaceEmailInviteInputDtoSchema = z.object({
  inviteId: z.string(),
  userId: z.string(),
});

export type DeclineWorkspaceEmailInviteInputDto = z.infer<
  typeof DeclineWorkspaceEmailInviteInputDtoSchema
>;

export type DeclineWorkspaceEmailInviteOutputDto = {
  invite: WorkspaceInviteEntity;
};

export type DeclineWorkspaceEmailInviteErrorDto =
  BusinessResultInputContextErrorDto<DeclineWorkspaceEmailInviteInputDto>;
