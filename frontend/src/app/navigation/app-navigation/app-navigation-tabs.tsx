import {
  ArrowRightIcon,
  Compass,
  Radar,
  Settings2Icon,
} from "lucide-react";
import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

import { Routes } from "@/app/routes/routes";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar";

const NAV_ITEMS = [
  {
    title: "Explore",
    url: Routes.Home,
    icon: Compass,
    rightIcon: null,
  },
  {
    title: "Scans",
    url: Routes.Scans,
    icon: Radar,
    rightIcon: null,
  },
  {
    title: "Settings",
    url: Routes.UserProfile,
    icon: Settings2Icon,
    rightIcon: ArrowRightIcon,
  },
];

type AppNavigationTabsProps = {
  disabled: boolean;
};

export const AppNavigationTabs = ({ disabled }: AppNavigationTabsProps) => {
  const { pathname } = useLocation();

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [disabled],
  );

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link onClick={handleLinkClick} key={item.url} to={item.url}>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    className="cursor-pointer"
                    disabled={disabled}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.rightIcon && <item.rightIcon className="ml-auto" />}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
