import { type GuardResult } from "@/app/layouts/guards/types";
import { useFeatureFlags } from "@/hooks/use-feature-flags";

export const useIdentifiedGuard = (): GuardResult => {
  const { _loading, _isAnonymous } = useFeatureFlags();

  if (_loading || _isAnonymous) {
    return { loading: true };
  }

  return { loading: false };
};
