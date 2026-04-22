import { AuthBase, AuthContext } from "@/pages/auth/shared/auth-base";

export const LoginPage = () => {
  return <AuthBase context={AuthContext.Login} />;
};
