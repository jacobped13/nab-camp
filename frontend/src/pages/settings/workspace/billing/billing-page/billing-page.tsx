import {
  type FindSubscriptionPlanPathsByIdResponseBody,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
} from "@shared/api-contracts/billing";
import { useMemo } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { useAccount } from "@/hooks/use-account";
import { ChangePlanCard } from "@/pages/settings/workspace/billing/billing-page/change-plan-card";
import { CurrentPlanCard } from "@/pages/settings/workspace/billing/billing-page/current-plan-card";
import { PlanActions } from "@/pages/settings/workspace/billing/billing-page/plan-actions";

type BillingPageProps = {
  planPaths: FindSubscriptionPlanPathsByIdResponseBody;
};

export const BillingPage = ({ planPaths }: BillingPageProps) => {
  const {
    defaultWorkspace: {
      subscription: {
        plan: { setupType },
      },
    },
  } = useAccount();

  const accountIsManuallyBilled = useMemo(() => {
    return setupType === SUBSCRIPTION_PLAN_SETUP_TYPE.MANUAL;
  }, [setupType]);

  if (accountIsManuallyBilled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Self serve billing is not available.</CardTitle>
          <CardDescription>
            This is a managed account. For billing questions, invoice requests,
            or plan changes, please reach out to us.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PlanActions />
      </div>
      <CurrentPlanCard />
      <ChangePlanCard
        upgradeablePlans={planPaths.familyUpgrades}
        downgradeablePlans={planPaths.familyDowngrades}
        frequencyUpgrades={planPaths.frequencyUpgrades}
        frequencyDowngrades={planPaths.frequencyDowngrades}
        frequencySidegrades={planPaths.frequencySidegrades}
      />
    </div>
  );
};
