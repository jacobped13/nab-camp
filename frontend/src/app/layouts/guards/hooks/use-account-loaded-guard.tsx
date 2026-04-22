import { type GuardResult } from "@/app/layouts/guards/types";
import { useAccount } from "@/hooks/use-account";

export const useAccountLoadedGuard = (): GuardResult => {
  const { _loading } = useAccount();

  if (_loading) {
    return { loading: true };
  }

  return { loading: false };
};
