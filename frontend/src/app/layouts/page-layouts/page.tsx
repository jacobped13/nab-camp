import { isEmpty } from "lodash-es";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";

import { PageErrorBoundary } from "@/app/layouts/error-boundaries/page-error-boundary";
import { PageMetaTitle } from "@/app/layouts/page-layouts/page-meta-title";
import { type Routes } from "@/app/routes/routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { PageLoader } from "@/components/loader";
import { Separator } from "@/components/separator";
import { SidebarTrigger } from "@/components/sidebar";
import { DATA_TEST_IDS } from "@/e2e/consts";

type BreadcrumbItemType = {
  label: string;
  to: Routes;
};

type PageProps = {
  title: string;
  loading: boolean;
  children: ReactNode;
  permission?: boolean;
  breadcrumbs?: BreadcrumbItemType[];
  subheader?: ReactNode;
};

export const Page = ({
  title,
  loading,
  children,
  permission = true,
  breadcrumbs = [],
  subheader,
}: PageProps) => {
  return (
    <>
      <PageMetaTitle title={title} />
      <div className="w-full h-full">
        {/* Header is 48px tall */}
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger
              data-testid={DATA_TEST_IDS.NAVIGATION.TOGGLE_BUTTON}
              className="-ml-1"
            />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <div>
              {isEmpty(breadcrumbs) ? (
                <Breadcrumb>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </Breadcrumb>
              ) : (
                <Breadcrumb className="flex items-center gap-2">
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <div key={breadcrumb.to}>
                        <BreadcrumbItem key={breadcrumb.to}>
                          <Link to={breadcrumb.to}>
                            <p className="hover:text-foreground transition-colors">
                              {breadcrumb.label}
                            </p>
                          </Link>
                        </BreadcrumbItem>

                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </div>
                    ))}
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
          </div>
        </header>
        {/* Subtract the header from the total page size */}
        <div className="w-full h-[calc(100%-48px)] p-6">
          <PageErrorBoundary title={title}>
            <PageContent
              subheader={subheader}
              loading={loading}
              permission={permission}
            >
              {children}
            </PageContent>
          </PageErrorBoundary>
        </div>
      </div>
    </>
  );
};

type PageContentProps = {
  loading: boolean;
  permission: boolean;
  children: ReactNode;
  subheader?: ReactNode;
};

const PageContent = ({
  loading,
  permission,
  children,
  subheader,
}: PageContentProps) => {
  if (!permission) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        {subheader && <div>{subheader}</div>}
        <PageLoader />
      </>
    );
  }

  return (
    <>
      {subheader && <div>{subheader}</div>}
      {children}
    </>
  );
};
