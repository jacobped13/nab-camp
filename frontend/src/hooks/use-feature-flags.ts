import { createContext, useContext } from "react";

import { type FeatureFlagContextType } from "@/app/providers/feature-flag-provider/consts";

export const FeatureFlagContext = createContext<FeatureFlagContextType>(null!);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider",
    );
  }
  return context;
};
