import { DEFAULT_WORKSPACE_PERMISSIONS } from '@service/authorization';
import { ACCOUNT_STATE, REGISTRATION_STATE } from './account.business.constant';
import { Account, AccountData } from './account.business.model';

/**
 * Represents the default account state.
 */
export const DEFAULT_ACCOUNT_DATA: AccountData = {
  user: null,
  defaultWorkspace: null,
  availableWorkspaces: [],
  permissions: DEFAULT_WORKSPACE_PERMISSIONS,
};

/**
 * Calculates the state of an account based on the provided account data.
 *
 * @return The state of the account.
 */
export const calculateAccountState = (
  accountData: AccountData
): ACCOUNT_STATE => {
  const hasUser = !!accountData.user;
  const hasDefaultWorkspace = !!accountData.defaultWorkspace;
  const hasAccessSubscription = !!accountData.defaultWorkspace?.subscription;
  const hasActiveAccessSubscription =
    !!accountData.defaultWorkspace?.subscription?.isServiceActive();

  // If a user does NOT exist, the account is in registration state
  if (!hasUser) {
    return ACCOUNT_STATE.REGISTRATION;
  }

  // If a user does NOT have a default workspace, the account is in the registration state
  if (!hasDefaultWorkspace) {
    return ACCOUNT_STATE.REGISTRATION;
  }

  // If the default workspace exists but does NOT have an access subscription, the account is in registration state
  if (!hasAccessSubscription) {
    return ACCOUNT_STATE.REGISTRATION;
  }

  // If the default workspace has an access subscription but it is NOT active, the account is inactive
  if (!hasActiveAccessSubscription) {
    return ACCOUNT_STATE.INACTIVE;
  }

  // Default to active state
  return ACCOUNT_STATE.ACTIVE;
};

/**
 * Calculates the registration state of an account.
 *
 * @returns The registration state of the account or null if no registration state is applicable.
 */
export const calculateRegistrationState = (
  accountData: AccountData
): REGISTRATION_STATE => {
  const hasUser = !!accountData.user;
  const hasDefaultWorkspace = !!accountData.defaultWorkspace;

  // If a user does NOT exist, the account is in registration state
  if (!hasUser) {
    return REGISTRATION_STATE.REGISTER_USER;
  }

  // If a workspace does NOT exist, the account is in the workspace registration state(s)
  if (!hasDefaultWorkspace) {
    return REGISTRATION_STATE.REGISTER_WORKSPACE;
  }

  return REGISTRATION_STATE.REGISTER_PAYMENT_PLAN;
};

/**
 * Factory class to create an account from account data.
 */
export class AccountDataFactory {
  public static with(accountData: AccountData): Account {
    const accountState = calculateAccountState(accountData);
    const registrationState = calculateRegistrationState(accountData);

    return {
      state: accountState,
      registrationState: registrationState,
      user: accountData.user,
      defaultWorkspace: accountData.defaultWorkspace,
      availableWorkspaces: accountData.availableWorkspaces,
      permissions: accountData.permissions,
    };
  }

  public static withDefault(): Account {
    return this.with(DEFAULT_ACCOUNT_DATA);
  }
}
