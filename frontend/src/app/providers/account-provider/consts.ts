import {
  type ACCOUNT_STATE,
  type AccountWorkspaceDetails,
  type REGISTRATION_STATE,
} from "@shared/api-contracts/account";
import { type Permissions } from "@shared/api-contracts/permissions";
import { type User } from "@shared/api-contracts/user";
import {
  type WorkspaceAccessSubscription,
  type WorkspaceOwner,
} from "@shared/api-contracts/workspace";

export type GuarunteedAccountWorkspaceDetails = {
  workspace: AccountWorkspaceDetails["workspace"];
  membership: AccountWorkspaceDetails["membership"];
  subscription: WorkspaceAccessSubscription;
  owner: WorkspaceOwner;
};

export type MappedAccountContext = {
  state: ACCOUNT_STATE;
  registrationState: REGISTRATION_STATE;
  user: User;
  defaultWorkspace: GuarunteedAccountWorkspaceDetails;
  availableWorkspaces: GuarunteedAccountWorkspaceDetails[];
  permissions: Permissions;
};

export type AccountContextType = MappedAccountContext & {
  _loading: boolean;
  refresh: () => Promise<MappedAccountContext>;
};
