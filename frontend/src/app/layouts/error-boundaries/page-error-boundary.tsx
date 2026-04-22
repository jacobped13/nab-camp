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
  title: string;
  children: React.ReactNode;
};

export const PageErrorBoundary = ({
  title,
  children,
}: PageErrorBoundaryProps) => {
  const handleError = useCallback(
    (error: Error) => {
      console.error(`Error in ${title} page:`, error);
    },
    [title],
  );

  return (
    <ErrorBoundary
      onError={handleError}
      fallbackRender={({ resetErrorBoundary }) => (
        <div className="flex items-center justify-center flex-col h-full p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>
                The {title} page encountered an error.
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
                Reload page
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
