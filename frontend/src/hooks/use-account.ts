import { createContext, useContext } from "react";

import { type AccountContextType } from "@/app/providers/account-provider/consts";

export const AccountContext = createContext<AccountContextType>(null!);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
