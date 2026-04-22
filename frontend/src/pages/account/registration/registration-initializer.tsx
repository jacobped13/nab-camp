import { REGISTRATION_STATE } from "@shared/api-contracts/account";
import { useMemo, useState } from "react";

import { useAccount } from "@/hooks/use-account";
import { useSearchParams } from "@/hooks/use-search-params";
import { PaymentRegistrationInitializer } from "@/pages/account/registration/pages/payment-registration/payment-registration-initializer";
import { PlanRegistrationInitializer } from "@/pages/account/registration/pages/plan-registration/plan-registration-initializer";
import { WorkspaceRegistration } from "@/pages/account/registration/pages/workspace-registration";
import { UserRegistration } from "@/pages/account/shared/user-registration";

export const RegistrationInitializer = () => {
  const { registrationState } = useAccount();
  const {
    values: { planId, sessionId },
  } = useSearchParams();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(planId);

  const showPaymentRegistration = useMemo(() => {
    return Boolean(selectedPlanId || sessionId);
  }, [sessionId, selectedPlanId]);

  const { Outlet } = useMemo(() => {
    switch (registrationState) {
      case REGISTRATION_STATE.REGISTER_USER: {
        return {
          Outlet: UserRegistration,
        };
      }
      case REGISTRATION_STATE.REGISTER_WORKSPACE: {
        return {
          Outlet: WorkspaceRegistration,
        };
      }
      case REGISTRATION_STATE.REGISTER_PAYMENT_PLAN: {
        if (showPaymentRegistration) {
          return {
            Outlet: () => (
              <PaymentRegistrationInitializer
                sessionId={sessionId}
                planId={selectedPlanId!}
                title="Registration"
                header="Last step, we promise!"
              />
            ),
          };
        }
        return {
          Outlet: () => (
            <PlanRegistrationInitializer handleSelectPlan={setSelectedPlanId} />
          ),
        };
      }
    }
  }, [registrationState, showPaymentRegistration, selectedPlanId, sessionId]);

  return <Outlet />;
};
