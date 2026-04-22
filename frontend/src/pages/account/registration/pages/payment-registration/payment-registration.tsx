import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { DATA_TEST_IDS } from "@/e2e/consts";

type PaymentRegistrationProps = {
  setPaymentElementLoading: (loading: boolean) => void;
};

export const PaymentRegistration = ({
  setPaymentElementLoading,
}: PaymentRegistrationProps) => {
  const checkout = useCheckout();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await checkout.confirm();
      if (result.type === "error") {
        toast.error(
          result.error.message || "Payment failed. Please try again.",
        );
        return;
      } else {
        // Do nothing, redirect is handled by Stripe and the polling in the parent component
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [checkout]);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 divide-x-0 md:divide-x divide-gray-300">
      <div className="flex flex-col gap-1">
        {checkout.lineItems.map((item) => (
          <div key={item.id} className="text-md">
            {item.name}
          </div>
        ))}
        <div className="text-3xl font-semibold">
          {checkout.total.total.amount}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="text-md">Payment method</h4>
        <PaymentElement
          onReady={() => setPaymentElementLoading(false)}
          options={{
            layout: "tabs",
            terms: {
              card: "never",
            },
          }}
        />
        <Button
          variant="default"
          onClick={onSubmit}
          disabled={!checkout.canConfirm}
          loading={isLoading}
          data-testid={DATA_TEST_IDS.REGISTRATION.PAYMENT.SUBMIT_BUTTON}
        >
          Pay
        </Button>
      </div>
    </div>
  );
};
