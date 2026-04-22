import { useAccount } from "@/hooks/use-account";

enum EntityType {
  PERMISSIONS = "permissions",
  ENTITLEMENTS = "entitlements",
  FEATURE_FLAGS = "featureFlags",
}

enum ConditionalOptions {
  AND = "AND",
  OR = "OR",
}

type AuthResult = {
  allowed: boolean;
  failed?: EntityType;
};

type AuthEntity = {
  values: boolean[];
  logic: ConditionalOptions;
};

type AuthRule = {
  permissions?: AuthEntity;
  entitlements?: AuthEntity;
  featureFlags?: AuthEntity;
};

const handleAndOrOperation = (
  values: boolean[],
  conditional: ConditionalOptions,
): boolean => {
  if (conditional === ConditionalOptions.AND) {
    return values.every(Boolean);
  } else if (conditional === ConditionalOptions.OR) {
    return values.some(Boolean);
  }
  return false;
};

const checkAuthorization = (rule: AuthRule): AuthResult => {
  if (rule.permissions) {
    const permissionsPassed = handleAndOrOperation(
      rule.permissions.values,
      rule.permissions.logic,
    );

    if (!permissionsPassed) {
      return { allowed: false, failed: EntityType.PERMISSIONS };
    }
  }

  if (rule.entitlements) {
    const entitlementsPassed = handleAndOrOperation(
      rule.entitlements.values,
      rule.entitlements.logic,
    );

    if (!entitlementsPassed) {
      return { allowed: false, failed: EntityType.ENTITLEMENTS };
    }
  }

  if (rule.featureFlags) {
    const flagsPassed = handleAndOrOperation(
      rule.featureFlags.values,
      rule.featureFlags.logic,
    );

    if (!flagsPassed) {
      return { allowed: false, failed: EntityType.FEATURE_FLAGS };
    }
  }

  return { allowed: true };
};

export const useNavigationAuthorization = () => {
  const {
    permissions: {
      WORKSPACE_VIEW,
      WORKSPACE_MEMBER_VIEW,
      WORKSPACE_EMAIL_INVITE_VIEW,
      WORKSPACE_BILLING_MANAGE,
      WORKSPACE_INVOICE_VIEW,
    },
  } = useAccount();

  return {
    workspaceDetailsNavigation: checkAuthorization({
      permissions: {
        values: [WORKSPACE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    teamsNavigation: checkAuthorization({
      permissions: {
        values: [WORKSPACE_MEMBER_VIEW, WORKSPACE_EMAIL_INVITE_VIEW],
        logic: ConditionalOptions.OR,
      },
    }),
    billingNavigation: checkAuthorization({
      permissions: {
        values: [WORKSPACE_BILLING_MANAGE, WORKSPACE_INVOICE_VIEW],
        logic: ConditionalOptions.OR,
      },
    }),
  };
};

export const useRoutesAuthorization = () => {
  const {
    permissions: {
      WORKSPACE_BILLING_MANAGE,
      WORKSPACE_INVOICE_VIEW,
      WORKSPACE_MEMBER_VIEW,
      WORKSPACE_EMAIL_INVITE_VIEW,
      WORKSPACE_VIEW,
    },
  } = useAccount();

  return {
    billingRoute: checkAuthorization({
      permissions: {
        values: [WORKSPACE_BILLING_MANAGE],
        logic: ConditionalOptions.AND,
      },
    }),
    invoicesRoute: checkAuthorization({
      permissions: {
        values: [WORKSPACE_INVOICE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    teamsRoute: checkAuthorization({
      permissions: {
        values: [WORKSPACE_MEMBER_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    invitesRoute: checkAuthorization({
      permissions: {
        values: [WORKSPACE_EMAIL_INVITE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    workspaceDetailsRoute: checkAuthorization({
      permissions: {
        values: [WORKSPACE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
  };
};

export const useWorkspaceAuthorization = () => {
  const {
    permissions: { WORKSPACE_VIEW, WORKSPACE_EDIT },
  } = useAccount();

  return {
    viewWorkspace: checkAuthorization({
      permissions: {
        values: [WORKSPACE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    editWorkspace: checkAuthorization({
      permissions: {
        values: [WORKSPACE_EDIT],
        logic: ConditionalOptions.AND,
      },
    }),
  };
};

export const useMembersAuthorization = () => {
  const {
    permissions: {
      WORKSPACE_MEMBER_VIEW,
      WORKSPACE_MEMBER_DELETE,
      WORKSPACE_MEMBER_ROLE_CHANGE,
    },
  } = useAccount();

  return {
    viewMembers: checkAuthorization({
      permissions: {
        values: [WORKSPACE_MEMBER_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    deleteMembers: checkAuthorization({
      permissions: {
        values: [WORKSPACE_MEMBER_DELETE],
        logic: ConditionalOptions.AND,
      },
    }),
    changeMemberRole: checkAuthorization({
      permissions: {
        values: [WORKSPACE_MEMBER_ROLE_CHANGE],
        logic: ConditionalOptions.AND,
      },
    }),
    hasAnyMemberAction: checkAuthorization({
      permissions: {
        values: [WORKSPACE_MEMBER_DELETE, WORKSPACE_MEMBER_ROLE_CHANGE],
        logic: ConditionalOptions.OR,
      },
    }),
  };
};

export const useInvitesAuthorization = () => {
  const {
    permissions: {
      WORKSPACE_EMAIL_INVITE_VIEW,
      WORKSPACE_EMAIL_INVITE_CREATE,
      WORKSPACE_EMAIL_INVITE_DELETE,
    },
  } = useAccount();

  return {
    viewInvites: checkAuthorization({
      permissions: {
        values: [WORKSPACE_EMAIL_INVITE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
    createInvites: checkAuthorization({
      permissions: {
        values: [WORKSPACE_EMAIL_INVITE_CREATE],
        logic: ConditionalOptions.AND,
      },
    }),
    deleteInvites: checkAuthorization({
      permissions: {
        values: [WORKSPACE_EMAIL_INVITE_DELETE],
        logic: ConditionalOptions.AND,
      },
    }),
  };
};

export const useBillingAuthorization = () => {
  const {
    permissions: { WORKSPACE_BILLING_MANAGE, WORKSPACE_INVOICE_VIEW },
  } = useAccount();

  return {
    manageBilling: checkAuthorization({
      permissions: {
        values: [WORKSPACE_BILLING_MANAGE],
        logic: ConditionalOptions.AND,
      },
    }),
    viewBillingInvoices: checkAuthorization({
      permissions: {
        values: [WORKSPACE_INVOICE_VIEW],
        logic: ConditionalOptions.AND,
      },
    }),
  };
};

type UseAuthorizationBody = {
  navigation: ReturnType<typeof useNavigationAuthorization>;
  routes: ReturnType<typeof useRoutesAuthorization>;
  workspaceFeatures: ReturnType<typeof useWorkspaceAuthorization>;
  membersFeatures: ReturnType<typeof useMembersAuthorization>;
  invitesFeatures: ReturnType<typeof useInvitesAuthorization>;
  billingFeatures: ReturnType<typeof useBillingAuthorization>;
};

export const useAuthorization = () => {
  const navigation = useNavigationAuthorization();
  const routes = useRoutesAuthorization();
  const workspaceFeatures = useWorkspaceAuthorization();
  const membersFeatures = useMembersAuthorization();
  const invitesFeatures = useInvitesAuthorization();
  const billingFeatures = useBillingAuthorization();

  return {
    navigation,
    routes,
    workspaceFeatures,
    membersFeatures,
    invitesFeatures,
    billingFeatures,
  } satisfies UseAuthorizationBody;
};
