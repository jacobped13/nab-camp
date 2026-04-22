import {
  ACCOUNT_STATE,
  type AccountWorkspaceDetails,
  type FindCurrentAccountResponseBody,
  REGISTRATION_STATE,
} from "@shared/api-contracts/account";
import {
  BILLING_FREQUENCY,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
  SUBSCRIPTION_PLAN_TYPE,
  SUBSCRIPTION_STATUS,
  type SubscriptionPlan,
} from "@shared/api-contracts/billing";
import {
  PERMISSION,
  type Permissions,
} from "@shared/api-contracts/permissions";
import { type User } from "@shared/api-contracts/user";
import {
  type Workspace,
  WORKSPACE_MEMBER_ROLE,
  type WorkspaceAccessSubscription,
  type WorkspaceMember,
  type WorkspaceOwner,
} from "@shared/api-contracts/workspace";

import {
  type GuarunteedAccountWorkspaceDetails,
  type MappedAccountContext,
} from "@/app/providers/account-provider/consts";

const DEFAULT_USER: User = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const DEFAULT_WORKSPACE: Workspace = {
  id: "",
  name: "",
  url: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const DEFAULT_SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: "",
  familyKey: SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS,
  type: SUBSCRIPTION_PLAN_TYPE.ACCESS,
  setupType: SUBSCRIPTION_PLAN_SETUP_TYPE.MANUAL,
  frequency: BILLING_FREQUENCY.MONTHLY,
  amount: 0,
  name: "",
  description: "",
  features: [],
};

const DEFAULT_WORKSPACE_SUBSCRIPTION: WorkspaceAccessSubscription = {
  id: "",
  status: SUBSCRIPTION_STATUS.INACTIVE,
  currentPeriodStartAt: Date.now(),
  currentPeriodEndAt: Date.now(),
  cancelAt: null,
  plan: DEFAULT_SUBSCRIPTION_PLAN,
};

const DEFAULT_WORKSPACE_MEMBER: WorkspaceMember = {
  id: "",
  role: WORKSPACE_MEMBER_ROLE.WORKSPACE_MEMBER,
  userId: "",
  email: "",
  firstName: "",
  lastName: "",
  workspaceId: "",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const DEFAULT_WORKSPACE_OWNER: WorkspaceOwner = {
  id: "",
  workspaceId: "",
};

const DEFAULT_USER_PERMISSIONS = Object.fromEntries(
  Object.values(PERMISSION).map((perm) => [perm, false]),
) as Permissions;

export const mapAccountContext = (
  rawAccountContext: FindCurrentAccountResponseBody | undefined,
): MappedAccountContext => {
  const { account } = rawAccountContext ?? {};

  return {
    state: account?.state ?? ACCOUNT_STATE.INACTIVE,
    registrationState:
      account?.registrationState ?? REGISTRATION_STATE.REGISTER_USER,
    user: account?.user ?? DEFAULT_USER,
    defaultWorkspace: mapWorkspace(account?.defaultWorkspace),
    availableWorkspaces:
      account?.availableWorkspaces.map((workspace) =>
        mapWorkspace(workspace),
      ) ?? [],
    permissions: account?.permissions ?? DEFAULT_USER_PERMISSIONS,
  };
};

export const mapWorkspace = (
  workspace: AccountWorkspaceDetails | null | undefined,
): GuarunteedAccountWorkspaceDetails => {
  return {
    workspace: workspace?.workspace ?? DEFAULT_WORKSPACE,
    membership: workspace?.membership ?? DEFAULT_WORKSPACE_MEMBER,
    subscription: workspace?.subscription ?? DEFAULT_WORKSPACE_SUBSCRIPTION,
    owner: workspace?.owner ?? DEFAULT_WORKSPACE_OWNER,
  };
};
