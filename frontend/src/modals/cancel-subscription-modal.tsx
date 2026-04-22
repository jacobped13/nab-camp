import { useCallback, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/alert-dialog";
import { Button } from "@/components/button";
import { useAccount } from "@/hooks/use-account";
import { handleError } from "@/network/error";
import { useBillingMutations } from "@/network/modules/billing";

type CancelSubscriptionModalProps = {
  closeModal: () => void;
};

export const CancelSubscriptionModal = ({
  closeModal,
}: CancelSubscriptionModalProps) => {
  const { refresh } = useAccount();
  const { cancelSubscription } = useBillingMutations();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCancelPlan = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await cancelSubscription.mutateAsync();
      await refresh();
      closeModal();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [cancelSubscription, refresh, closeModal]);

  return (
    <AlertDialog open onOpenChange={() => closeModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel your subscription at the end of the current billing
            period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Plan</AlertDialogCancel>
          <Button
            loading={isSubmitting}
            variant="destructive"
            onClick={handleCancelPlan}
          >
            Cancel Subscription
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
