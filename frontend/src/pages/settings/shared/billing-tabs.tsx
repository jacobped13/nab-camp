import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { Routes } from "@/app/routes/routes";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { useAuthorization } from "@/hooks/use-authorization";
import { useNavigate } from "@/hooks/use-navigate";

enum BillingPageTabs {
  BILLING = "BILLING",
  INVOICES = "INVOICES",
}

export const BillingTabs = () => {
  const {
    routes: { billingRoute, invoicesRoute },
  } = useAuthorization();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    if (location.pathname === Routes.WorkspaceBilling) {
      return BillingPageTabs.BILLING;
    }
    return BillingPageTabs.INVOICES;
  }, [location.pathname]);

  return (
    <Tabs value={activeTab} className="mb-4">
      <TabsList className="flex gap-2">
        <TabsTrigger
          disabled={!billingRoute.allowed}
          onClick={() => navigate({ route: Routes.WorkspaceBilling })}
          value={BillingPageTabs.BILLING}
        >
          Billing
        </TabsTrigger>
        <TabsTrigger
          disabled={!invoicesRoute.allowed}
          onClick={() => navigate({ route: Routes.WorkspaceInvoices })}
          value={BillingPageTabs.INVOICES}
        >
          Invoices
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
