import { useMemo } from "react";

import { Page } from "@/app/layouts/page-layouts/page";
import { useAuthorization } from "@/hooks/use-authorization";
import { useWorkspaceInvoices } from "@/network/modules/billing";
import { BillingTabs } from "@/pages/settings/shared/billing-tabs";
import { mapToInvoiceTableStructure } from "@/pages/settings/workspace/billing/invoices-page/consts";
import { InvoicesPage } from "@/pages/settings/workspace/billing/invoices-page/invoices-page";

export const InvoicesPageInitializer = () => {
  const {
    routes: { invoicesRoute },
  } = useAuthorization();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useWorkspaceInvoices();

  const mappedData = useMemo(() => {
    return mapToInvoiceTableStructure({ data });
  }, [data]);

  return (
    <Page
      loading={isLoading}
      title="Invoices"
      subheader={<BillingTabs />}
      permission={invoicesRoute.allowed}
    >
      <InvoicesPage
        data={mappedData}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Page>
  );
};
