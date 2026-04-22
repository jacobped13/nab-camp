import { LogOutIcon, MoreVerticalIcon } from "lucide-react";
import { useMemo } from "react";

import { Avatar, AvatarFallback } from "@/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/sidebar";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { useAccount } from "@/hooks/use-account";
import { useAuth } from "@/hooks/use-auth";

export const AppNavigationUser = () => {
  const { user } = useAccount();
  const { logout } = useAuth();
  const { isMobile } = useSidebar();

  const hasUser = useMemo(() => {
    return !!user && !!user.firstName && !!user.lastName;
  }, [user]);

  const avatarName = useMemo(() => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }, [user]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {hasUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                data-testid={DATA_TEST_IDS.NAVIGATION.USER_MENU}
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarFallback className="rounded-lg">
                    {avatarName}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${user.firstName} ${user.lastName}`}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                User
              </DropdownMenuLabel>
              <DropdownMenuItem
                data-testid={DATA_TEST_IDS.NAVIGATION.LOGOUT_BUTTON}
                onClick={logout}
              >
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton
            className="flex gap-2 text-muted-foreground text-xs"
            onClick={logout}
          >
            <LogOutIcon className="w-4 h-4" />
            Log out
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
