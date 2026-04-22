import { type ReactNode, useCallback, useMemo } from "react";

import { type AccountContextType } from "@/app/providers/account-provider/consts";
import { mapAccountContext } from "@/app/providers/account-provider/utils";
import { AccountContext } from "@/hooks/use-account";
import { useAuth } from "@/hooks/use-auth";
import { useAccountQuery } from "@/network/modules/account";

type AccountProviderProps = {
  children: ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { authUser } = useAuth();
  const { isLoading, data, refetch } = useAccountQuery({ enabled: !!authUser });

  const handleRefetch = useCallback(async () => {
    const response = await refetch();
    return mapAccountContext(response.data);
  }, [refetch]);

  const value: AccountContextType = useMemo(() => {
    const mappedData = mapAccountContext(data);

    return {
      _loading: isLoading,
      refresh: handleRefetch,
      ...mappedData,
    };
  }, [isLoading, handleRefetch, data]);

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};
