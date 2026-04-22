import {
  BILLING_FREQUENCY,
  type SubscriptionPlan,
} from "@shared/api-contracts/billing";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { useAccount } from "@/hooks/use-account";
import { useModalContext } from "@/hooks/use-modal";
import { ChangeBillingFrequencyModal } from "@/modals/change-billing-frequency-modal";
import { ChangeBillingPlanModal } from "@/modals/change-billing-plan-modal";
import {
  PlanCards,
  PlanCardsVariants,
} from "@/pages/account/shared/plan-cards";

const getBillingFrequencyLabel = (frequency: BILLING_FREQUENCY): string => {
  return frequency.toLowerCase();
};

const getAvailablePlan = (
  currentPlan: SubscriptionPlan,
  frequencyUpgrades: SubscriptionPlan[],
  frequencyDowngrades: SubscriptionPlan[],
  frequencySidegrades: SubscriptionPlan[],
): SubscriptionPlan | undefined => {
  const frequencyChangePlans = [
    ...frequencyUpgrades,
    ...frequencyDowngrades,
    ...frequencySidegrades,
  ];

  const availablePlan = frequencyChangePlans.find(
    (plan) =>
      plan.familyKey === currentPlan.familyKey &&
      plan.frequency !== currentPlan.frequency,
  );

  return availablePlan;
};

type ChangePlanCardProps = {
  upgradeablePlans: SubscriptionPlan[];
  downgradeablePlans: SubscriptionPlan[];
  frequencyUpgrades: SubscriptionPlan[];
  frequencyDowngrades: SubscriptionPlan[];
  frequencySidegrades: SubscriptionPlan[];
};

export const ChangePlanCard = ({
  upgradeablePlans,
  downgradeablePlans,
  frequencyUpgrades,
  frequencyDowngrades,
  frequencySidegrades,
}: ChangePlanCardProps) => {
  const {
    defaultWorkspace: {
      subscription: { plan },
    },
  } = useAccount();
  const { openModal } = useModalContext();

  const [activeFrequency, setActiveFrequency] = useState(plan.frequency);

  const availablePlan = useCallback(
    () =>
      getAvailablePlan(
        plan,
        frequencyUpgrades,
        frequencyDowngrades,
        frequencySidegrades,
      ),
    [plan, frequencyUpgrades, frequencyDowngrades, frequencySidegrades],
  )();

  const handlePlanChange = useCallback(
    (plan: SubscriptionPlan) => {
      openModal(ChangeBillingPlanModal, {
        newPlan: plan,
        onSuccess: () => {},
      });
    },
    [openModal],
  );

  const handleFrequencyChange = useCallback(
    (frequency: BILLING_FREQUENCY) => {
      if (!availablePlan) return;

      openModal(ChangeBillingFrequencyModal, {
        newPlan: availablePlan,
        onSuccess: () => {
          setActiveFrequency(frequency);
          toast.success(
            `Billing frequency changed to ${getBillingFrequencyLabel(frequency)}`,
          );
        },
      });
    },
    [openModal, availablePlan],
  );

  const plans = useMemo(() => {
    const activePlan = {
      ...plan,
      variant: PlanCardsVariants.SELECTED,
    };

    const downgradeable = downgradeablePlans
      .map((plan) => ({
        ...plan,
        variant: PlanCardsVariants.DOWNGRADEABLE,
      }))
      .filter((plan) => plan.frequency === activePlan.frequency);

    const upgradeable = upgradeablePlans
      .map((plan) => ({
        ...plan,
        variant: PlanCardsVariants.UPGRADEABLE,
      }))
      .filter((plan) => plan.frequency === activePlan.frequency);

    return [...downgradeable, activePlan, ...upgradeable];
  }, [downgradeablePlans, plan, upgradeablePlans]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Your Plan</CardTitle>
        <CardDescription>
          Choose a plan that better fits your needs
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeFrequency}>
          <TabsList className="flex gap-2">
            <TabsTrigger
              onClick={() => handleFrequencyChange(BILLING_FREQUENCY.MONTHLY)}
              value={BILLING_FREQUENCY.MONTHLY}
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              onClick={() => handleFrequencyChange(BILLING_FREQUENCY.YEARLY)}
              value={BILLING_FREQUENCY.YEARLY}
            >
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <PlanCards plans={plans} onSelectPlan={handlePlanChange} />
      </CardContent>
    </Card>
  );
};
