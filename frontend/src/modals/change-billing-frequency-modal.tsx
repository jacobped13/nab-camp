import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { type SubscriptionPlan } from "@shared/api-contracts/billing";
import { Clock, CreditCard } from "lucide-react";
import { useCallback, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/alert-dialog";
import { Button } from "@/components/button";
import { useAccount } from "@/hooks/use-account";
import { centsToDollars } from "@/lib/utils/currency";
import { handleError } from "@/network/error";
import { useBillingMutations } from "@/network/modules/billing";
import { PLAN_FREQUENCY_LABELS } from "@/pages/account/shared/plan-cards";

type ChangeBillingFrequencyModalProps = {
  closeModal: () => void;
  onSuccess: () => void;
  newPlan: SubscriptionPlan;
};

export const ChangeBillingFrequencyModal = ({
  closeModal,
  onSuccess,
  newPlan,
}: ChangeBillingFrequencyModalProps) => {
  const {
    refresh,
    defaultWorkspace: {
      subscription: {
        plan: { frequency: currentFrequency, name: currentPlanName },
      },
    },
  } = useAccount();
  const { changeSubscriptionPlan } = useBillingMutations();

  const { frequency: newFrequency } = newPlan;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await changeSubscriptionPlan.mutateAsync({
        planId: newPlan.id,
      });
      await refresh();
      closeModal();
      onSuccess();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [changeSubscriptionPlan, newPlan, closeModal, onSuccess, refresh]);

  return (
    <AlertDialog open onOpenChange={() => closeModal()}>
      <AlertDialogContent className="sm:max-w-md space-y-6">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/25">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-xl text-center">
            Change Billing Frequency
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground">
            You're switching from {PLAN_FREQUENCY_LABELS[currentFrequency]} to{" "}
            {PLAN_FREQUENCY_LABELS[newFrequency]} billing for your{" "}
            {currentPlanName} plan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Current Plan
              </span>
              <span className="text-sm font-semibold">{currentPlanName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Current Frequency
              </span>
              <span className="text-sm font-semibold">
                {PLAN_FREQUENCY_LABELS[currentFrequency]}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                New Frequency
              </span>
              <span className="text-sm font-semibold">
                {PLAN_FREQUENCY_LABELS[newFrequency]}
              </span>
            </div>

            <hr className="text-muted-foreground" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Amount Due Today
                </span>
              </div>
              <span className="text-lg font-bold">
                {centsToDollars(newPlan.amount)}
              </span>
            </div>
          </div>

          {newPlan.amount > 0 && (
            <p className="text-xs text-gray-500 text-center">
              This amount will be charged to your default payment method
              immediately. You will lose any remaining credit on your current
              plan.
            </p>
          )}
        </div>

        <AlertDialogFooter className="flex gap-2">
          <Button
            disabled={isSubmitting}
            className="w-full basis-1/2"
            variant="secondary"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            loading={isSubmitting}
            onClick={handleSubmit}
            className="w-full basis-1/2"
          >
            Save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
