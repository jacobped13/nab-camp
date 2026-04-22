import { useQueryClient } from "@tanstack/react-query";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithCustomToken,
  type User,
} from "firebase/auth";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { type AuthContextType } from "@/app/providers/auth-provider/consts";
import { AuthContext } from "@/hooks/use-auth";
import {
  clearLocalStorageSegment,
  SESSION_LOCAL_STORAGE_KEYS,
} from "@/lib/consts/local-storage-keys";
import { handleError } from "@/network/error";
import { auth } from "@/network/firebase";
import { useAuthMutations } from "@/network/modules/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryCache = useQueryClient();
  const { sendCode, acceptCode } = useAuthMutations();

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await auth.signOut();
    queryCache.clear();
    clearLocalStorageSegment(SESSION_LOCAL_STORAGE_KEYS);
  }, [queryCache]);

  const loginWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    return signInWithRedirect(auth, provider);
  }, []);

  const sendEmailCode = useCallback(
    async (email: string) => {
      try {
        const data = await sendCode.mutateAsync({ email });
        return data;
      } catch (error) {
        handleError(error);
      }
    },
    [sendCode],
  );

  const resendEmailCode = useCallback(
    async (email: string) => {
      try {
        await sendCode.mutateAsync({ email });
        toast.success("Code resent successfully. Please check your email.");
      } catch (error) {
        handleError(error);
      }
    },
    [sendCode],
  );

  const acceptEmailCode = useCallback(
    async (email: string, code: string) => {
      try {
        const response = await acceptCode.mutateAsync({ email, code });
        await signInWithCustomToken(auth, response.token);
      } catch (error) {
        handleError(error);
      }
    },
    [acceptCode],
  );

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setAuthUser(user);
      setLoading(false);
    });
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      _loading: loading,
      authUser,
      sendEmailCode,
      resendEmailCode,
      acceptEmailCode,
      loginWithGoogle,
      logout,
    }),
    [
      authUser,
      loading,
      sendEmailCode,
      acceptEmailCode,
      loginWithGoogle,
      logout,
      resendEmailCode,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
