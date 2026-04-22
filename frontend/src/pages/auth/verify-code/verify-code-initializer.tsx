import { AuthErrorBoundary } from "@/app/layouts/error-boundaries/auth-error-boundary";
import { AuthPage } from "@/pages/auth/shared/auth-page";
import { VerifyCodePage } from "@/pages/auth/verify-code/verify-code-page";

export const VerifyCodeInitializer = () => {
  return (
    <AuthErrorBoundary>
      <AuthPage>
        <VerifyCodePage />
      </AuthPage>
    </AuthErrorBoundary>
  );
};
