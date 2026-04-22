import { CHECKOUT_SESSION_STATUS } from "@shared/api-contracts/billing";
import { TIMING } from "@shared/lib/timing";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";

import { useTheme } from "@/app/providers/theme-provider/theme-provider";
import { handleError } from "@/network/error";
import { useAccountQuery } from "@/network/modules/account";
import {
  useBillingMutations,
  useCheckoutStatusQuery,
} from "@/network/modules/billing";
import {
  stripeDarkVariables,
  stripeLightVariables,
  stripePromise,
} from "@/network/stripe";
import { PaymentRegistration } from "@/pages/account/registration/pages/payment-registration/payment-registration";
import { OnboardingPage } from "@/pages/account/shared/onboarding-page";

const ACCOUNT_POLLING_INTERVAL = TIMING.SECOND.IN_MILLISECONDS * 2;

type PaymentRegistrationInitializerProps = {
  sessionId: string | null;
  planId: string;
  title: string;
  header: string;
};

export const PaymentRegistrationInitializer = ({
  sessionId,
  planId,
  title,
  header,
}: PaymentRegistrationInitializerProps) => {
  const { createCheckoutSession } = useBillingMutations();
  const { isDarkMode } = useTheme();

  const { data, isLoading } = useCheckoutStatusQuery(sessionId ?? "");

  const [paymentElementLoading, setPaymentElementLoading] =
    useState<boolean>(true);

  const blockChildrenFromRendering = useMemo(() => {
    if (isLoading) return true;

    return data?.session.status === CHECKOUT_SESSION_STATUS.COMPLETED;
  }, [data, isLoading]);

  useAccountQuery({
    enabled: !!blockChildrenFromRendering,
    pollingInterval: ACCOUNT_POLLING_INTERVAL,
  });

  const fetchClientSecret = useCallback(async () => {
    try {
      const data = await createCheckoutSession.mutateAsync({
        planId,
      });
      return data.session.token;
    } catch (error) {
      handleError(error);
      return "";
    }
  }, [planId, createCheckoutSession]);

  const stripeTheme = useMemo(() => {
    return isDarkMode ? stripeDarkVariables : stripeLightVariables;
  }, [isDarkMode]);

  return (
    <OnboardingPage
      title={title}
      header={header}
      loadingOverlay={paymentElementLoading}
      loading={blockChildrenFromRendering}
    >
      <CheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          elementsOptions: {
            appearance: {
              theme: "stripe",
              labels: "above",
              variables: stripeTheme,
            },
          },
        }}
      >
        <PaymentRegistration
          setPaymentElementLoading={setPaymentElementLoading}
        />
      </CheckoutProvider>
    </OnboardingPage>
  );
};
