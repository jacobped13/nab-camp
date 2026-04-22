import { Link } from "react-router-dom";

import { AppNavigationTabs } from "@/app/navigation/app-navigation/app-navigation-tabs";
import { AppNavigationUser } from "@/app/navigation/app-navigation/app-navigation-user";
import { WorkspaceSwitcher } from "@/app/navigation/app-navigation/app-navigation-workspace";
import { Routes } from "@/app/routes/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/sidebar";
import { CompanyLogo } from "@/pages/auth/shared/company-logo";

type AppNavigationProps = {
  showCreateWorkspace: boolean;
  tabsDisabled: boolean;
};

export const AppNavigation = ({
  tabsDisabled,
  showCreateWorkspace,
}: AppNavigationProps) => {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="flex flex-col gap-4">
        <Link to={Routes.Home} className="p-2">
          <CompanyLogo className="h-4.5" />
        </Link>
        <WorkspaceSwitcher showCreateWorkspace={showCreateWorkspace} />
      </SidebarHeader>
      <SidebarContent>
        <AppNavigationTabs disabled={tabsDisabled} />
      </SidebarContent>
      <SidebarFooter>
        <AppNavigationUser />
      </SidebarFooter>
    </Sidebar>
  );
};
