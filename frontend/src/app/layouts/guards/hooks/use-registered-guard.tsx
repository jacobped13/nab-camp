import { ACCOUNT_STATE } from "@shared/api-contracts/account";

import { type GuardResult } from "@/app/layouts/guards/types";
import { Routes } from "@/app/routes/routes";
import { useAccount } from "@/hooks/use-account";

export const useRegisteredGuard = (): GuardResult => {
  const { _loading, state } = useAccount();

  if (_loading) {
    return { loading: true };
  }

  if (state === ACCOUNT_STATE.REGISTRATION) {
    return {
      loading: false,
      redirect: {
        route: Routes.AccountRegistration,
        clearParams: false,
      },
    };
  }

  return { loading: false };
};
