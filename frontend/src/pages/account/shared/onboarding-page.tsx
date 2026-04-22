import { type ReactNode } from "react";

import { PageErrorBoundary } from "@/app/layouts/error-boundaries/page-error-boundary";
import { PageMetaTitle } from "@/app/layouts/page-layouts/page-meta-title";
import { PageLoader, PageLoaderWithOverlay } from "@/components/loader";

type PageProps = {
  title: string;
  header: string;
  loading: boolean;
  loadingOverlay?: boolean;
  children: ReactNode;
};

export const OnboardingPage = ({
  title,
  header,
  loading,
  loadingOverlay = false,
  children,
}: PageProps) => {
  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <PageMetaTitle title={title} />
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="w-full text-left">
            <span className="text-2xl font-thin py-4">{header}</span>
          </div>
          <PageErrorBoundary title={title}>{children}</PageErrorBoundary>
        </div>
        {loadingOverlay && <PageLoaderWithOverlay />}
      </div>
    </>
  );
};
