import { useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

type AuthErrorBoundaryProps = {
  children: React.ReactNode;
};

export const AuthErrorBoundary = ({ children }: AuthErrorBoundaryProps) => {
  const handleError = useCallback((error: Error) => {
    console.error(`Error authenticating:`, error);
  }, []);

  return (
    <ErrorBoundary onError={handleError} fallbackRender={() => children}>
      {children}
    </ErrorBoundary>
  );
};
