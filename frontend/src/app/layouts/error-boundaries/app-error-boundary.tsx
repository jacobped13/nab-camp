import { useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";

type PageErrorBoundaryProps = {
  children: React.ReactNode;
};

export const AppErrorBoundary = ({ children }: PageErrorBoundaryProps) => {
  const handleError = useCallback((error: Error) => {
    console.error(`Error in global error boundary:`, error);
  }, []);

  return (
    <ErrorBoundary
      onError={handleError}
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="flex items-center justify-center flex-col w-screen h-screen">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                The app encountered an unexpected error.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  resetErrorBoundary();
                  globalThis.location.reload();
                }}
              >
                Reload app
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
