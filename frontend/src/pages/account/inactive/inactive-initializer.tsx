import { useMemo, useState } from "react";

import { useAccount } from "@/hooks/use-account";
import { useSearchParams } from "@/hooks/use-search-params";
import { InactivePage } from "@/pages/account/inactive/inactive-page";
import { PaymentRegistrationInitializer } from "@/pages/account/registration/pages/payment-registration/payment-registration-initializer";
import { OnboardingPage } from "@/pages/account/shared/onboarding-page";

export const InactiveInitializer = () => {
  const {
    values: { sessionId },
  } = useSearchParams();
  const { defaultWorkspace } = useAccount();

  const selectedPlanId = defaultWorkspace.subscription.plan.id;

  const [showReactivation, setShowReactivation] = useState<boolean>(false);

  const showPaymentRegistration = useMemo(() => {
    return Boolean(showReactivation && selectedPlanId);
  }, [selectedPlanId, showReactivation]);

  if (showPaymentRegistration) {
    return (
      <PaymentRegistrationInitializer
        planId={selectedPlanId}
        sessionId={sessionId}
        title="Reactivation"
        header="Let's get your new billing information"
      />
    );
  }

  return (
    <OnboardingPage
      title="Inactive Account"
      header="Well, this is awkward..."
      loading={false}
    >
      <InactivePage setShowReactivation={setShowReactivation} />
    </OnboardingPage>
  );
};
