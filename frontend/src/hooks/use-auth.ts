import { createContext, useContext } from "react";

import { type AuthContextType } from "@/app/providers/auth-provider/consts";

export const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
