import { SUBSCRIPTION_STATUS } from "@shared/api-contracts/billing";
import { useCallback, useMemo, useState } from "react";

import { Routes } from "@/app/routes/routes";
import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { useAccount } from "@/hooks/use-account";
import { handleError } from "@/network/error";
import { useBillingMutations } from "@/network/modules/billing";

type InactivePageProps = {
  setShowReactivation: (show: boolean) => void;
};

export const InactivePage = ({ setShowReactivation }: InactivePageProps) => {
  const {
    defaultWorkspace: {
      subscription: { status },
    },
  } = useAccount();
  const { updatePaymentMethod } = useBillingMutations();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleReactivateSubscription = useCallback(async () => {
    setShowReactivation(true);
  }, [setShowReactivation]);

  const handleUpdatePaymentMethod = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const data = await updatePaymentMethod.mutateAsync({
        returnPath: Routes.WorkspaceBilling,
      });
      globalThis.location.href = data.session.url;
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [updatePaymentMethod]);

  const { title, description, ctaText, onCtaClick } = useMemo(() => {
    switch (status) {
      case SUBSCRIPTION_STATUS.CANCELLED: {
        return {
          title: "Your subscription has been cancelled.",
          description:
            "Your workspace subscription has been cancelled. You can reactivate it at any time.",
          ctaText: "Reactivate workspace",
          onCtaClick: handleReactivateSubscription,
        };
      }
      case SUBSCRIPTION_STATUS.INACTIVE: {
        return {
          title: "Your workspace is not active.",
          description:
            "Your payment method has been declined. Please update it to unlock your workspace.",
          ctaText: "Update payment method",
          onCtaClick: handleUpdatePaymentMethod,
        };
      }
      default: {
        throw new Error("Unandled subscription status");
      }
    }
  }, [status, handleReactivateSubscription, handleUpdatePaymentMethod]);

  return (
    <div className="flex flex-col gap-4 min-w-full w-96">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
      <Button loading={isSubmitting} className="w-full" onClick={onCtaClick}>
        {ctaText}
      </Button>
    </div>
  );
};
