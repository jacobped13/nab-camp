import { DataMapper, Nullable } from '@common';
import {
  Workspace as WorkspaceResponse,
  WORKSPACE_MEMBER_ROLE,
  WorkspaceMember as WorkspaceMemberResponse,
  WorkspaceAccessSubscription as WorkspaceAccessSubscriptionResponse,
  WORKSPACE_EMAIL_INVITE_SORT_FIELD as API_WORKSPACE_EMAIL_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_SORT_FIELD as API_WORKSPACE_MEMBER_SORT_FIELD,
  WorkspaceEmailInvite as WorkspaceEmailInviteResponse,
  WorkspaceOwner as WorkspaceOwnerResponse,
} from '@api-contracts/workspace';
import { SORT_DIRECTION as API_SORT_DIRECTION } from '@api-contracts/common';
import {
  WorkspaceAccessSubscription,
  WorkspaceEntity,
  WorkspaceMembership,
  WorkspaceInviteEntity,
  WorkspaceOwner,
  WORKSPACE_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_SORT_FIELD,
  WorkspaceInviteSortInputDto,
  WorkspaceMemberSortInputDto,
} from '@service/workspace';
import { ROLE } from '@service/authorization';
import { SUBSCRIPTION_STATUS, SubscriptionPlan } from '@api-contracts/billing';
import { BILLING_PROVIDER_SUBSCRIPTION_STATUS } from '@service/billing';
import { mapSubscriptionPlanResponse } from '@api/route/billing/helper/billing.util';
import { SORT_DIRECTION } from '@lib/util/pagination.util';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

export const transformSortDirection = (
  direction: API_SORT_DIRECTION
): Nullable<SORT_DIRECTION> => {
  const targetDirection = Object.values(SORT_DIRECTION).find(
    (v) => v === (direction as unknown as SORT_DIRECTION)
  );

  return targetDirection ?? null;
};

// -----------------------------------------------------------------
// Workspace Response Mapper
// -----------------------------------------------------------------

class WorkspaceResponseMapper extends DataMapper<
  WorkspaceEntity,
  WorkspaceResponse
> {
  override mapInputObject(source: WorkspaceEntity): WorkspaceResponse {
    return {
      id: source.id,
      name: source.name,
      url: source.url,
      createdAt: source.createdAt.getTime(),
      updatedAt: source.updatedAt.getTime(),
    };
  }
}

const workspaceResponseMapper = new WorkspaceResponseMapper();

/**
 * Maps a workspace entity to an API {@link WorkspaceResponse}.
 */
export const mapWorkspaceResponse = (
  user: Nullable<WorkspaceEntity> | WorkspaceEntity[]
) => {
  return workspaceResponseMapper.map(user);
};

// -----------------------------------------------------------------
// Workspace Member Role Transformer
// -----------------------------------------------------------------

const ROLE_TO_WORKSPACE_MEMBER_ROLE_MAP: Partial<
  Record<ROLE, WORKSPACE_MEMBER_ROLE>
> = {
  [ROLE.WORKSPACE_ADMIN]: WORKSPACE_MEMBER_ROLE.WORKSPACE_ADMIN,
  [ROLE.WORKSPACE_MEMBER]: WORKSPACE_MEMBER_ROLE.WORKSPACE_MEMBER,
};

const WORKSPACE_MEMBER_ROLE_TO_ROLE_MAP: Partial<
  Record<WORKSPACE_MEMBER_ROLE, ROLE>
> = Object.fromEntries(
  Object.entries(ROLE_TO_WORKSPACE_MEMBER_ROLE_MAP).map(
    ([role, workspaceMemberRole]) => [workspaceMemberRole, role]
  )
);

const transformRoleToWorkspaceMemberRole = (
  role: ROLE
): Nullable<WORKSPACE_MEMBER_ROLE> => {
  return ROLE_TO_WORKSPACE_MEMBER_ROLE_MAP[role] ?? null;
};

const transformOrThrowRoleToWorkspaceMemberRole = (
  role: ROLE
): WORKSPACE_MEMBER_ROLE => {
  const workspaceMemberRole = transformRoleToWorkspaceMemberRole(role);

  if (!workspaceMemberRole) {
    throw new Error(`Invalid role: ${role}`);
  }

  return workspaceMemberRole;
};

const transformWorkspaceMemberRoleToRole = (
  workspaceMemberRole: WORKSPACE_MEMBER_ROLE
): Nullable<ROLE> => {
  return WORKSPACE_MEMBER_ROLE_TO_ROLE_MAP[workspaceMemberRole] ?? null;
};

export const transformOrThrowWorkspaceMemberRoleToRole = (
  workspaceMemberRole: WORKSPACE_MEMBER_ROLE
): ROLE => {
  const role = transformWorkspaceMemberRoleToRole(workspaceMemberRole);

  if (!role) {
    throw new Error(`Invalid workspace member role: ${workspaceMemberRole}`);
  }

  return role;
};

// -----------------------------------------------------------------
// Workspace Member Response Mapper
// -----------------------------------------------------------------

const WORKSPACE_MEMBER_SORT_FIELD_MAP: Partial<
  Record<API_WORKSPACE_MEMBER_SORT_FIELD, WORKSPACE_MEMBER_SORT_FIELD>
> = {
  [API_WORKSPACE_MEMBER_SORT_FIELD.CREATED_AT]:
    WORKSPACE_MEMBER_SORT_FIELD.CREATED_AT,
  [API_WORKSPACE_MEMBER_SORT_FIELD.EMAIL]: WORKSPACE_MEMBER_SORT_FIELD.EMAIL,
  [API_WORKSPACE_MEMBER_SORT_FIELD.FIRST_NAME]:
    WORKSPACE_MEMBER_SORT_FIELD.FIRST_NAME,
  [API_WORKSPACE_MEMBER_SORT_FIELD.LAST_NAME]:
    WORKSPACE_MEMBER_SORT_FIELD.LAST_NAME,
};

export const transformWorkspaceMemberSortField = (
  field: API_WORKSPACE_MEMBER_SORT_FIELD
): Nullable<WORKSPACE_MEMBER_SORT_FIELD> => {
  const targetField = WORKSPACE_MEMBER_SORT_FIELD_MAP[field];
  return targetField ?? null;
};

export const transformWorkspaceMemberSort = (
  sortDirection: API_SORT_DIRECTION,
  sortField: API_WORKSPACE_MEMBER_SORT_FIELD
): Nullable<WorkspaceMemberSortInputDto> => {
  const transformedSortField = transformWorkspaceMemberSortField(sortField);
  const transformedSortDirection = transformSortDirection(sortDirection);

  if (!transformedSortField || !transformedSortDirection) {
    return null;
  }

  return {
    field: transformedSortField,
    direction: transformedSortDirection,
  };
};

export const transformOrThrowWorkspaceMemberSort = (
  sortDirection: API_SORT_DIRECTION,
  sortField: API_WORKSPACE_MEMBER_SORT_FIELD
): WorkspaceMemberSortInputDto => {
  const transformedSort = transformWorkspaceMemberSort(
    sortDirection,
    sortField
  );

  if (!transformedSort) {
    throw new Error(
      `Invalid workspace member sort: ${sortDirection}, ${sortField}`
    );
  }

  return transformedSort;
};

class WorkspaceMemberResponseMapper extends DataMapper<
  WorkspaceMembership,
  WorkspaceMemberResponse
> {
  override mapInputObject(
    source: WorkspaceMembership
  ): WorkspaceMemberResponse {
    return {
      id: source.id,
      role: transformOrThrowRoleToWorkspaceMemberRole(source.role),
      workspaceId: source.workspaceId,
      userId: source.userId,
      email: source.email,
      firstName: source.firstName,
      lastName: source.lastName,
      createdAt: source.createdAt.getTime(),
      updatedAt: source.updatedAt.getTime(),
    };
  }
}

const workspaceMemberResponseMapper = new WorkspaceMemberResponseMapper();

/**
 * Maps a workspace member entity to an API {@link WorkspaceMemberResponse}.
 */
export const mapWorkspaceMemberResponse = (
  source: Nullable<WorkspaceMembership> | WorkspaceMembership[]
) => {
  return workspaceMemberResponseMapper.map(source);
};

// -----------------------------------------------------------------
// Workspace Access Subscription Response Mapper
// -----------------------------------------------------------------

const transformSubscriptionStatus = (
  status: BILLING_PROVIDER_SUBSCRIPTION_STATUS
): Nullable<SUBSCRIPTION_STATUS> => {
  const targetStatus = Object.values(SUBSCRIPTION_STATUS).find(
    (v) => v === (status as unknown as SUBSCRIPTION_STATUS)
  );

  return targetStatus ?? null;
};

const transformOrThrowSubscriptionStatus = (
  status: BILLING_PROVIDER_SUBSCRIPTION_STATUS
): SUBSCRIPTION_STATUS => {
  const targetStatus = transformSubscriptionStatus(status);

  if (!targetStatus) {
    throw new Error(`Invalid subscription status: ${status}`);
  }

  return targetStatus;
};

class WorkspaceAccessSubscriptionResponseMapper extends DataMapper<
  WorkspaceAccessSubscription,
  WorkspaceAccessSubscriptionResponse
> {
  override mapInputObject(
    source: WorkspaceAccessSubscription
  ): WorkspaceAccessSubscriptionResponse {
    return {
      id: source.id,
      status: transformOrThrowSubscriptionStatus(source.status),
      currentPeriodStartAt: source.currentPeriodStartAt.getTime(),
      currentPeriodEndAt: source.currentPeriodEndAt.getTime(),
      cancelAt: source.cancelAt ? source.cancelAt.getTime() : null,
      plan: mapSubscriptionPlanResponse(source.plan) as SubscriptionPlan,
    };
  }
}

const workspaceAccessSubscriptionResponseMapper =
  new WorkspaceAccessSubscriptionResponseMapper();

/**
 * Maps a workspace access subscription entity to an API {@link WorkspaceAccessSubscriptionResponse}.
 */
export const mapWorkspaceAccessSubscriptionResponse = (
  source: Nullable<WorkspaceAccessSubscription> | WorkspaceAccessSubscription[]
) => {
  return workspaceAccessSubscriptionResponseMapper.map(source);
};

// -----------------------------------------------------------------
// Workspace Email Invite Response Mapper
// -----------------------------------------------------------------

const WORKSPACE_EMAIL_INVITE_SORT_FIELD_MAP: Partial<
  Record<API_WORKSPACE_EMAIL_INVITE_SORT_FIELD, WORKSPACE_INVITE_SORT_FIELD>
> = {
  [API_WORKSPACE_EMAIL_INVITE_SORT_FIELD.CREATED_AT]:
    WORKSPACE_INVITE_SORT_FIELD.CREATED_AT,
  [API_WORKSPACE_EMAIL_INVITE_SORT_FIELD.EXPIRE_AT]:
    WORKSPACE_INVITE_SORT_FIELD.EXPIRE_AT,
  [API_WORKSPACE_EMAIL_INVITE_SORT_FIELD.EMAIL]:
    WORKSPACE_INVITE_SORT_FIELD.TARGET_ID,
};

export const transformWorkspaceEmailInviteSortField = (
  field: API_WORKSPACE_EMAIL_INVITE_SORT_FIELD
): Nullable<WORKSPACE_INVITE_SORT_FIELD> => {
  const targetField = WORKSPACE_EMAIL_INVITE_SORT_FIELD_MAP[field];
  return targetField ?? null;
};

export const transformWorkspaceEmailInviteSort = (
  sortDirection: API_SORT_DIRECTION,
  sortField: API_WORKSPACE_EMAIL_INVITE_SORT_FIELD
): Nullable<WorkspaceInviteSortInputDto> => {
  const transformedSortField =
    transformWorkspaceEmailInviteSortField(sortField);
  const transformedSortDirection = transformSortDirection(sortDirection);

  if (!transformedSortField || !transformedSortDirection) {
    return null;
  }

  return {
    field: transformedSortField,
    direction: transformedSortDirection,
  };
};

export const transformOrThrowWorkspaceEmailInviteSort = (
  sortDirection: API_SORT_DIRECTION,
  sortField: API_WORKSPACE_EMAIL_INVITE_SORT_FIELD
): WorkspaceInviteSortInputDto => {
  const transformedSort = transformWorkspaceEmailInviteSort(
    sortDirection,
    sortField
  );

  if (!transformedSort) {
    throw new Error(
      `Invalid workspace email invite sort: ${sortDirection}, ${sortField}`
    );
  }

  return transformedSort;
};

class WorkspaceEmailInviteResponseMapper extends DataMapper<
  WorkspaceInviteEntity,
  WorkspaceEmailInviteResponse
> {
  override mapInputObject(
    source: WorkspaceInviteEntity
  ): WorkspaceEmailInviteResponse {
    return {
      id: source.id,
      workspaceId: source.workspaceId,
      email: source.targetId,
      expireAt: source.expireAt.getTime(),
      createdAt: source.createdAt.getTime(),
      declinedAt: source.declinedAt?.getTime() ?? null,
    };
  }
}

const workspaceEmailInviteResponseMapper =
  new WorkspaceEmailInviteResponseMapper();

/**
 * Maps a workspace invite entity to an API {@link WorkspaceEmailInvite}.
 */
export const mapWorkspaceEmailInviteResponse = (
  source: Nullable<WorkspaceInviteEntity> | WorkspaceInviteEntity[]
) => {
  return workspaceEmailInviteResponseMapper.map(source);
};

// -----------------------------------------------------------------
// Workspace Owner Response Mapper
// -----------------------------------------------------------------

class WorkspaceOwnerResponseMapper extends DataMapper<
  WorkspaceOwner,
  WorkspaceOwnerResponse
> {
  override mapInputObject(source: WorkspaceOwner): WorkspaceOwnerResponse {
    return {
      id: source.id,
      workspaceId: source.workspaceId,
    };
  }
}

const workspaceOwnerResponseMapper = new WorkspaceOwnerResponseMapper();

/**
 * Maps a workspace owner entity to an API {@link WorkspaceOwner}.
 */
export const mapWorkspaceOwnerResponse = (
  source: Nullable<WorkspaceOwner> | WorkspaceOwner[]
) => {
  return workspaceOwnerResponseMapper.map(source);
};
