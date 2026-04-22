import { AuthErrorBoundary } from "@/app/layouts/error-boundaries/auth-error-boundary";
import { AuthPage } from "@/pages/auth/shared/auth-page";
import { SignUpPage } from "@/pages/auth/sign-up/sign-up-page";

export const SignUpInitializer = () => {
  return (
    <AuthErrorBoundary>
      <AuthPage>
        <SignUpPage />
      </AuthPage>
    </AuthErrorBoundary>
  );
};
