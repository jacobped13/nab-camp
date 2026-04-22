import { Permissions } from "./permissions";
import { User } from "./user";
import {
  Workspace,
  WorkspaceMember,
  WorkspaceAccessSubscription,
  WorkspaceOwner,
} from "./workspace";

// -----------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------

export enum ACCOUNT_STATE {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  REGISTRATION = "REGISTRATION",
}

export enum REGISTRATION_STATE {
  REGISTER_USER = "REGISTER_USER",
  REGISTER_WORKSPACE = "REGISTER_WORKSPACE",
  REGISTER_PAYMENT_PLAN = "REGISTER_PAYMENT_PLAN",
}

export type AccountWorkspaceDetails = {
  workspace: Workspace;
  membership: WorkspaceMember;
  subscription: WorkspaceAccessSubscription | null;
  owner: WorkspaceOwner | null;
};

export type Account = {
  state: ACCOUNT_STATE;
  registrationState: REGISTRATION_STATE | null;
  user: User | null;
  defaultWorkspace: AccountWorkspaceDetails | null;
  availableWorkspaces: AccountWorkspaceDetails[];
  permissions: Permissions;
};

// -----------------------------------------------------------------
// Find Current Account Contracts
// -----------------------------------------------------------------

export type FindCurrentAccountResponseBody = {
  account: Account;
};
