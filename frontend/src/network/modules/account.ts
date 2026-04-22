import { type FindCurrentAccountResponseBody } from "@shared/api-contracts/account";
import { useQuery } from "@tanstack/react-query";

import { get } from "@/network/base";
import { QUERY_KEYS } from "@/network/query-keys";

type UseAccountQueryArgs = {
  enabled: boolean;
  pollingInterval?: number;
};

export const useAccountQuery = ({
  enabled,
  pollingInterval,
}: UseAccountQueryArgs) => {
  return useQuery({
    queryKey: QUERY_KEYS.ACCOUNT,
    queryFn: () => get<FindCurrentAccountResponseBody>("/account/current"),
    enabled,
    refetchInterval: pollingInterval || false,
  });
};
