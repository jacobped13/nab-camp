import { type SubscriptionPlan } from "@shared/api-contracts/billing";
import { useMemo } from "react";

import { useSubscriptionPlansQuery } from "@/network/modules/billing";
import { PlanRegistration } from "@/pages/account/registration/pages/plan-registration/plan-registration";
import { OnboardingPage } from "@/pages/account/shared/onboarding-page";

type PlanRegistrationInitializerProps = {
  handleSelectPlan: (planId: string) => void;
};

export const PlanRegistrationInitializer = ({
  handleSelectPlan,
}: PlanRegistrationInitializerProps) => {
  const { isLoading, data } = useSubscriptionPlansQuery();

  const plans: SubscriptionPlan[] = useMemo(() => {
    return data?.plans || [];
  }, [data]);

  return (
    <OnboardingPage
      title="Registration"
      header="Which plan best suits your needs?"
      loading={isLoading}
    >
      <PlanRegistration plans={plans} handleSelectPlan={handleSelectPlan} />
    </OnboardingPage>
  );
};
