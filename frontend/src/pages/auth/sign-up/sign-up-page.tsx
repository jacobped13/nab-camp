import { AuthBase, AuthContext } from "@/pages/auth/shared/auth-base";

export const SignUpPage = () => {
  return <AuthBase context={AuthContext.Signup} />;
};
