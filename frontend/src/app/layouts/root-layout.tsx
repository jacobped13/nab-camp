import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import { AppErrorBoundary } from "@/app/layouts/error-boundaries/app-error-boundary";
import { AccountProvider } from "@/app/providers/account-provider/account-provider";
import { AuthProvider } from "@/app/providers/auth-provider/auth-provider";
import { FeatureFlagProvider } from "@/app/providers/feature-flag-provider/feature-flag-provider";
import { ModalProvider } from "@/app/providers/modal-provider/modal-provider";
import { Toaster } from "@/components/sonner";

const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AccountProvider>
            <FeatureFlagProvider>
              <ModalProvider>
                <Outlet />
                <Toaster />
              </ModalProvider>
            </FeatureFlagProvider>
          </AccountProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};
