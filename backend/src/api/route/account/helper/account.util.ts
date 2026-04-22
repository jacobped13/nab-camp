import { DataMapper, Nullable } from '@common';
import { Account } from '@service/account';
import {
  Account as AccountResponse,
  AccountWorkspaceDetails,
} from '@api-contracts/account';
import { User as UserResponse } from '@api-contracts/user';
import {
  Workspace as WorkspaceResponse,
  WorkspaceMember as WorkspaceMemberResponse,
  WorkspaceAccessSubscription as WorkspaceAccessSubscriptionResponse,
  WorkspaceOwner as WorkspaceOwnerResponse,
} from '@api-contracts/workspace';
import { mapUserResponse } from '@api/route/user/helper/user.util';
import {
  mapWorkspaceResponse,
  mapWorkspaceMemberResponse,
  mapWorkspaceAccessSubscriptionResponse,
  mapWorkspaceOwnerResponse,
} from '@api/route/workspace/helper/workspace.util';

// -----------------------------------------------------------------
// Account Response Mapper
// -----------------------------------------------------------------

class AccountResponseMapper extends DataMapper<Account, AccountResponse> {
  override mapInputObject(source: Account): AccountResponse {
    // Map the default workspace
    let defaultWorkspace: Nullable<AccountWorkspaceDetails> = null;

    if (source.defaultWorkspace) {
      defaultWorkspace = {
        workspace: mapWorkspaceResponse(
          source.defaultWorkspace.workspace
        ) as WorkspaceResponse,
        membership: mapWorkspaceMemberResponse(
          source.defaultWorkspace.membership
        ) as WorkspaceMemberResponse,
        subscription: mapWorkspaceAccessSubscriptionResponse(
          source.defaultWorkspace.subscription
        ) as Nullable<WorkspaceAccessSubscriptionResponse>,
        owner: mapWorkspaceOwnerResponse(
          source.defaultWorkspace.owner
        ) as Nullable<WorkspaceOwnerResponse>,
      };
    }

    // Map the available workspaces
    const availableWorkspaces: AccountWorkspaceDetails[] =
      source.availableWorkspaces.map((workspaceDetails) => ({
        workspace: mapWorkspaceResponse(
          workspaceDetails.workspace
        ) as WorkspaceResponse,
        membership: mapWorkspaceMemberResponse(
          workspaceDetails.membership
        ) as WorkspaceMemberResponse,
        subscription: mapWorkspaceAccessSubscriptionResponse(
          workspaceDetails.subscription
        ) as Nullable<WorkspaceAccessSubscriptionResponse>,
        owner: mapWorkspaceOwnerResponse(
          workspaceDetails.owner
        ) as Nullable<WorkspaceOwnerResponse>,
      }));

    return {
      state: source.state,
      registrationState: source.registrationState,
      user: mapUserResponse(source.user) as Nullable<UserResponse>,
      defaultWorkspace: defaultWorkspace,
      availableWorkspaces: availableWorkspaces,
      permissions: source.permissions,
    };
  }
}

const accountResponseMapper = new AccountResponseMapper();

/**
 * Maps an account to an API {@link AcountResponse}.
 */
export const mapAccountResponse = (user: Nullable<Account> | Account[]) => {
  return accountResponseMapper.map(user);
};
