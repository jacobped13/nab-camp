import { Nullable } from '@common';
import { UserEntity } from '@service/user';
import {
  WorkspaceEntity,
  WorkspaceAccessSubscription,
  WorkspaceMembership,
  WorkspaceOwner,
} from '@service/workspace';
import { ACCOUNT_STATE, REGISTRATION_STATE } from './account.business.constant';
import { WorkspacePermissionDto } from '@service/authorization';

export type AccountWorkspaceDetails = {
  workspace: WorkspaceEntity;
  membership: WorkspaceMembership;
  subscription: Nullable<WorkspaceAccessSubscription>;
  owner: Nullable<WorkspaceOwner>;
};

export type Account = {
  state: ACCOUNT_STATE;
  registrationState: Nullable<REGISTRATION_STATE>;
  user: Nullable<UserEntity>;
  defaultWorkspace: Nullable<AccountWorkspaceDetails>;
  availableWorkspaces: AccountWorkspaceDetails[];
  permissions: WorkspacePermissionDto;
};

export type AccountData = Omit<Account, 'state' | 'registrationState'>;
