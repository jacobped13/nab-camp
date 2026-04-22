import { AuthErrorBoundary } from "@/app/layouts/error-boundaries/auth-error-boundary";
import { LoginPage } from "@/pages/auth/login/login-page";
import { AuthPage } from "@/pages/auth/shared/auth-page";

export const LoginInitializer = () => {
  return (
    <AuthErrorBoundary>
      <AuthPage>
        <LoginPage />
      </AuthPage>
    </AuthErrorBoundary>
  );
};
