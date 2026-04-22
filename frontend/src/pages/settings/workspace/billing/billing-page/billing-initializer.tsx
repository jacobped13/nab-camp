import { type FindSubscriptionPlanPathsByIdResponseBody } from "@shared/api-contracts/billing";
import { useMemo } from "react";

import { Page } from "@/app/layouts/page-layouts/page";
import { useAccount } from "@/hooks/use-account";
import { useAuthorization } from "@/hooks/use-authorization";
import { useUpgradeDowngradePlansQuery } from "@/network/modules/billing";
import { BillingTabs } from "@/pages/settings/shared/billing-tabs";
import { BillingPage } from "@/pages/settings/workspace/billing/billing-page/billing-page";

const DEFAULT_PLAN_PATHS: FindSubscriptionPlanPathsByIdResponseBody = {
  familyUpgrades: [],
  familyDowngrades: [],
  familySidegrades: [],
  priceUpgrades: [],
  priceDowngrades: [],
  priceSidegrades: [],
  frequencyUpgrades: [],
  frequencyDowngrades: [],
  frequencySidegrades: [],
};

export const BillingInitializer = () => {
  const {
    defaultWorkspace: {
      subscription: {
        plan: { id: planId },
      },
    },
  } = useAccount();
  const {
    routes: { billingRoute },
  } = useAuthorization();

  const { isLoading, data } = useUpgradeDowngradePlansQuery(planId);

  const planPaths: FindSubscriptionPlanPathsByIdResponseBody = useMemo(() => {
    if (!data) return DEFAULT_PLAN_PATHS;

    return data;
  }, [data]);

  return (
    <Page
      loading={isLoading}
      title="Billing"
      subheader={<BillingTabs />}
      permission={billingRoute.allowed}
    >
      <BillingPage planPaths={planPaths} />
    </Page>
  );
};
