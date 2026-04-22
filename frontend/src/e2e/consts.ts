export const DATA_TEST_IDS = {
  AUTH: {
    EMAIL_INPUT: "auth-email-input",
    EMAIL_SUBMIT_BUTTON: "auth-email-submit-button",
    GOOGLE_LOGIN_BUTTON: "auth-google-login-button",
    VERIFY_CODE_INPUT: "verify-code-input",
    VEFIFY_SUBMIT_BUTTON: "verify-code-submit-button",
    RESEND_CODE_BUTTON: "verify-code-resend-button",
  },
  REGISTRATION: {
    USER: {
      FIRSTNAME_INPUT: "registration-user-firstname-input",
      LASTNAME_INPUT: "registration-user-lastname-input",
      SUBMIT_BUTTON: "registration-user-submit-button",
    },
    WORKSPACE: {
      NAME_INPUT: "registration-workspace-name-input",
      URL_INPUT: "registration-workspace-url-input",
      SUBMIT_BUTTON: "registration-workspace-submit-button",
    },
    PLAN: {
      SUBMIT_BUTTON: "registration-plan-submit-button",
      PLAN_CARD: "registration-plan-card",
    },
    PAYMENT: {
      SUBMIT_BUTTON: "registration-payment-submit-button",
    },
  },
  NAVIGATION: {
    TOGGLE_BUTTON: "navigation-toggle-button",
    WORKSPACE_SWITCHER: "navigation-workspace-switcher",
    USER_MENU: "navigation-user-menu",
    LOGOUT_BUTTON: "navigation-logout-button",
    SETTINGS_BUTTON: "navigation-settings-button",
  },
  INVITE: {
    ACCEPT_BUTTON: "invite-accept-button",
    DECLINE_BUTTON: "invite-decline-button",
    OPEN_INVITE_MODAL_BUTTON: "invite-open-modal-button",
    SEND_INVITES_BUTTON: "invite-send-button",
    SEND_INVITES_INPUT: "invite-send-input",
  },
};

export const E2E_USERS = {
  Auth: {
    firstName: "Steph",
    lastName: "Curry",
    email: "e2e-auth@gmail.com",
    workspaceName: "Warriors Organization",
    workspaceUrl: "https://warriors.com",
  },
  Registration: {
    firstName: "LeBron",
    lastName: "James",
    email: "e2e-registration@gmail.com",
    workspaceName: "Cavaliers Organization",
    workspaceUrl: "https://cavs.com",
  },
  InviteAdmin: {
    firstName: "Michael",
    lastName: "Jordan",
    email: "e2e-inviter@gmail.com",
    workspaceName: "Bulls Organization",
    workspaceUrl: "https://bulls.com",
  },
  InviteMember: {
    firstName: "Kobe",
    lastName: "Bryant",
    email: "e2e-invited@gmail.com",
    workspaceName: "Lakers Organization",
    workspaceUrl: "https://lakers.com",
  },
};
