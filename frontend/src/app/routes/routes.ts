const ROOT_PATH = "/";

const ACCOUNT_PATH = `${ROOT_PATH}account`;
const AUTH_PATH = `${ROOT_PATH}auth`;
const SCANS_PATH = `${ROOT_PATH}scans`;

const SETTINGS_PATH = `${ROOT_PATH}settings`;

const WORKSPACE_SETTINGS_PATH = `${SETTINGS_PATH}/workspace`;
const USER_SETTINGS_PATH = `${SETTINGS_PATH}/user`;

export enum Routes {
  // Root
  Home = ROOT_PATH,
  
  // Scans
  Scans = SCANS_PATH,



  // Account
  Account = ACCOUNT_PATH,
  AccountRegistration = `${ACCOUNT_PATH}/registration`,
  AccountInactive = `${ACCOUNT_PATH}/inactive`,
  AccountAcceptInvite = `${ACCOUNT_PATH}/accept-invite`,

  // Auth
  Auth = AUTH_PATH,
  AuthLogin = `${AUTH_PATH}/login`,
  AuthSignup = `${AUTH_PATH}/signup`,
  AuthVerifyCode = `${AUTH_PATH}/verify-code`,

  // Base Settings
  Settings = SETTINGS_PATH,

  // User Settings
  UserSettings = USER_SETTINGS_PATH,
  UserProfile = `${USER_SETTINGS_PATH}/profile`,
  UserPreferences = `${USER_SETTINGS_PATH}/preferences`,

  // Workspace Settings
  WorkspaceSettings = WORKSPACE_SETTINGS_PATH,
  WorkspaceDetails = `${WORKSPACE_SETTINGS_PATH}/details`,

  WorkspaceBilling = `${WORKSPACE_SETTINGS_PATH}/billing`,
  WorkspaceInvoices = `${WORKSPACE_SETTINGS_PATH}/billing/invoices`,
}
