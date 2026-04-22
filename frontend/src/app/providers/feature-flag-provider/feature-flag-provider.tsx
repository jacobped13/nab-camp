import {
  LDProvider,
  useFlags,
  useLDClient,
} from "launchdarkly-react-client-sdk";
import { isEqual } from "lodash-es";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  ANONYMOUS_LD_CONTEXT,
  type FeatureFlagBaseIdentificationData,
  type FeatureFlagContextType,
} from "@/app/providers/feature-flag-provider/consts";
import { mapAccountToLDIdentificationData } from "@/app/providers/feature-flag-provider/utils";
import { useAccount } from "@/hooks/use-account";
import { FeatureFlagContext } from "@/hooks/use-feature-flags";

type FeatureFlagProviderProps = {
  children: ReactNode;
};

export const FeatureFlagProvider = ({ children }: FeatureFlagProviderProps) => {
  return (
    <LDProvider clientSideID={import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID}>
      <FeatureFlagInternal>{children}</FeatureFlagInternal>
    </LDProvider>
  );
};

export const FeatureFlagInternal = ({ children }: FeatureFlagProviderProps) => {
  const flags = useFlags();
  const ldClient = useLDClient();
  const account = useAccount();

  const identificationData =
    useRef<FeatureFlagBaseIdentificationData>(ANONYMOUS_LD_CONTEXT);

  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (ldClient) {
      ldClient.waitUntilReady().then(() => {
        setIsLoading(false);
      });
    }
  }, [ldClient]);

  useEffect(() => {
    const identifyUser = async () => {
      const data = mapAccountToLDIdentificationData(account);

      // if ldClient is not ready, we can't identify the user
      if (!ldClient) return;

      // if the account is not ready, we can't identify the user
      if (!account.user.id) return;

      // if the changes to account don't change the identification data, we don't need to identify again
      if (isEqual(data, identificationData.current)) return;

      try {
        identificationData.current = data;
        await ldClient.identify(data);
        setIsAnonymous(data.anonymous);
      } catch {
        identificationData.current = ANONYMOUS_LD_CONTEXT;
        console.error("Failed to identify user with LaunchDarkly");
      }
    };

    identifyUser();
  }, [ldClient, account]);

  const value: FeatureFlagContextType = useMemo(() => {
    return {
      _loading: isLoading,
      _isAnonymous: isAnonymous,
      flags,
    };
  }, [isLoading, isAnonymous, flags]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
