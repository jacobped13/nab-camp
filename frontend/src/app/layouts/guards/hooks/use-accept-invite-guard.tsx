import { type GuardResult } from "@/app/layouts/guards/types";
import { Routes } from "@/app/routes/routes";
import { useSearchParams } from "@/hooks/use-search-params";

export const useAcceptInviteGuard = (): GuardResult => {
  const {
    values: { inviteId },
  } = useSearchParams();

  if (inviteId) {
    return {
      loading: false,
      redirect: {
        route: Routes.AccountAcceptInvite,
        clearParams: false,
      },
    };
  }

  return { loading: false };
};
