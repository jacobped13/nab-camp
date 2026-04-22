import { createHash } from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { DataMapper, Nullable } from '@common';
import { ROLE } from '@service/authorization';
import {
  WorkspaceAccessSubscription,
  WorkspaceMembership,
} from './workspace.business.model';
import { WorkspaceMemberEntity } from '../../data/helper/workspace.data.model';
import {
  SubscriptionConnectionEntity,
  SubscriptionPlan,
} from '@service/billing';
import { SubscriptionItemConnectionEntity } from '@service/billing/data/helper/billing.data.model';
import { UserEntity } from '@service/user';

// -----------------------------------------------------------------
// Workspace Membership Mapper
// -----------------------------------------------------------------

type WorkspaceMembershipMapperInput = {
  user: UserEntity;
  member: WorkspaceMemberEntity;
  role: ROLE;
};

class WorkspaceMembershipMapper extends DataMapper<
  WorkspaceMembershipMapperInput,
  WorkspaceMembership
> {
  override mapInputObject(
    input: WorkspaceMembershipMapperInput
  ): WorkspaceMembership {
    const user = input.user;
    const member = input.member;
    const role = input.role;

    return new WorkspaceMembership(
      member.id,
      member.workspaceId,
      member.userId,
      user.email,
      user.firstName,
      user.lastName,
      role,
      member.createdAt,
      member.updatedAt
    );
  }
}

const workspaceMembershipMapper = new WorkspaceMembershipMapper();

/**
 * Maps a workspace member entity and role to a {@link WorkspaceMembership}.
 */
export const mapWorkspaceMembership = (
  input:
    | Nullable<WorkspaceMembershipMapperInput>
    | WorkspaceMembershipMapperInput[]
) => {
  return workspaceMembershipMapper.map(input);
};

// -----------------------------------------------------------------
// Workspace Access Subscription Mapper
// -----------------------------------------------------------------

export type WorkspaceAccessSubscriptionMapperInput = {
  workspaceId: string;
  subscriptionConnection: SubscriptionConnectionEntity;
  subscriptionItemConnection: SubscriptionItemConnectionEntity;
  subscriptionPlan: SubscriptionPlan;
};

export class WorkspaceAccessSubscriptionMapper extends DataMapper<
  WorkspaceAccessSubscriptionMapperInput,
  WorkspaceAccessSubscription
> {
  override mapInputObject(
    input: WorkspaceAccessSubscriptionMapperInput
  ): WorkspaceAccessSubscription {
    const subscriptionConnection = input.subscriptionConnection;
    const subscriptionItemConnection = input.subscriptionItemConnection;
    const subscriptionPlan = input.subscriptionPlan;

    return new WorkspaceAccessSubscription(
      subscriptionConnection.id,
      subscriptionConnection.status,
      subscriptionConnection.cancelAt,
      subscriptionItemConnection.id,
      subscriptionItemConnection.quantity,
      subscriptionItemConnection.currentPeriodStartAt,
      subscriptionItemConnection.currentPeriodEndAt,
      subscriptionPlan
    );
  }
}

const workspaceAccessSubscriptionMapper =
  new WorkspaceAccessSubscriptionMapper();

/**
 * Maps a workspace access subscription input to a {@link WorkspaceAccessSubscription}.
 *
 * @returns The mapped workspace access subscription.
 */
export const mapWorkspaceAccessSubscription = (
  input:
    | Nullable<WorkspaceAccessSubscriptionMapperInput>
    | WorkspaceAccessSubscriptionMapperInput[]
) => {
  return workspaceAccessSubscriptionMapper.map(input);
};

// -----------------------------------------------------------------
// Workspace Email Invitation
// -----------------------------------------------------------------

/**
 * Generates a random workspace invite code.
 *
 * @returns A random UUID v7 string representing the workspace invite code.
 */
export const generateWorkspaceInviteCode = (): string => {
  return uuidV4();
};

/**
 * Hashes the workspace invite code using SHA-256.
 *
 * @returns The hashed code as a hexadecimal string.
 */
export const hashWorkspaceInviteCode = (code: string): string => {
  return createHash('sha256').update(code).digest('hex');
};

/**
 * Checks if the provided workspace invite code is valid.
 *
 * @returns True if the code is valid, false otherwise.
 */
export const isValidWorkspaceInviteCode = (
  code: string,
  hashedCode: string
): boolean => {
  return hashWorkspaceInviteCode(code) === hashedCode;
};
