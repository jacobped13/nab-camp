import {
  CreditCardIcon,
  PlayIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import { Routes } from "@/app/routes/routes";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { useAccount } from "@/hooks/use-account";
import { useModalContext } from "@/hooks/use-modal";
import { CancelSubscriptionModal } from "@/modals/cancel-subscription-modal";
import { handleError } from "@/network/error";
import { useBillingMutations } from "@/network/modules/billing";

export const PlanActions = () => {
  const { updatePaymentMethod } = useBillingMutations();

  const handleUpdatePaymentMethod = useCallback(async () => {
    try {
      const data = await updatePaymentMethod.mutateAsync({
        returnPath: Routes.Home,
      });
      globalThis.location.href = data.session.url;
    } catch (error) {
      handleError(error);
    }
  }, [updatePaymentMethod]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="text-right">
        <Button size="sm" variant="outline">
          <div className="flex items-center gap-2">
            <Settings2Icon className="w-4 h-4" />
            Plan Actions
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUpdatePaymentMethod}>
          <CreditCardIcon />
          Update Payment Method
        </DropdownMenuItem>
        <SubscriptionActionItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SubscriptionActionItem = () => {
  const {
    refresh,
    defaultWorkspace: {
      subscription: { cancelAt },
    },
  } = useAccount();
  const { resumeSubscription } = useBillingMutations();

  const { openModal } = useModalContext();

  const handleResumeSubscription = useCallback(async () => {
    try {
      await resumeSubscription.mutateAsync();
      await refresh();
      toast.success("Subscription resumed successfully.");
    } catch (error) {
      handleError(error);
    }
  }, [resumeSubscription, refresh]);

  const handleCancelSubscription = useCallback(() => {
    openModal(CancelSubscriptionModal, {});
  }, [openModal]);

  if (cancelAt) {
    return (
      <DropdownMenuItem onClick={handleResumeSubscription}>
        <PlayIcon />
        Resume Subscription
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem variant="destructive" onClick={handleCancelSubscription}>
      <Trash2Icon />
      Cancel Subscription
    </DropdownMenuItem>
  );
};
