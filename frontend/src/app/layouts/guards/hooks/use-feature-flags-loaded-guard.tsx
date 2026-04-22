import { type GuardResult } from "@/app/layouts/guards/types";
import { useFeatureFlags } from "@/hooks/use-feature-flags";

export const useFeatureFlagsLoadedGuard = (): GuardResult => {
  const { _loading } = useFeatureFlags();

  if (_loading) {
    return { loading: true };
  }

  return { loading: false };
};
