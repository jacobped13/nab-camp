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

  billingFeatures: ReturnType<typeof useBillingAuthorization>;
};

export const useAuthorization = () => {
  const navigation = useNavigationAuthorization();
  const routes = useRoutesAuthorization();
  const workspaceFeatures = useWorkspaceAuthorization();

  const billingFeatures = useBillingAuthorization();

  return {
    navigation,
    routes,
    workspaceFeatures,

    billingFeatures,
  } satisfies UseAuthorizationBody;
};
