import { HomeIcon } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { Routes } from "@/app/routes/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/sidebar";
import { useAuthorization } from "@/hooks/use-authorization";

export const SettingsNavigation = () => {
  const { pathname } = useLocation();
  const {
    navigation: {
      workspaceDetailsNavigation,
      billingNavigation,
      teamsNavigation,
    },
  } = useAuthorization();

  const navigtion = useMemo(() => {
    return {
      navMain: [
        {
          title: "User",
          items: [
            {
              title: "Profile",
              to: Routes.UserProfile,
              show: true,
            },
            {
              title: "Preferences",
              to: Routes.UserPreferences,
              show: true,
            },
          ],
        },
        {
          title: "Workspace",
          items: [
            {
              title: "Details",
              to: Routes.WorkspaceDetails,
              show: workspaceDetailsNavigation.allowed,
            },
            {
              title: "Team",
              to: Routes.WorkspaceTeam,
              show: teamsNavigation.allowed,
            },
            {
              title: "Billing",
              to: Routes.WorkspaceBilling,
              show: billingNavigation.allowed,
            },
          ],
        },
      ],
    };
  }, [workspaceDetailsNavigation, billingNavigation, teamsNavigation]);

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenuButton asChild>
          <Link to={Routes.Home}>
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigtion.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => {
                      if (!item.show) return null;

                      const isActive = pathname.includes(item.to);
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link to={item.to}>{item.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
