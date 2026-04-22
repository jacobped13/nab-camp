import { SUBSCRIPTION_STATUS } from "@shared/api-contracts/billing";
import {
  type Workspace,
  WORKSPACE_MEMBER_ROLE,
  type WorkspaceAccessSubscription,
  type WorkspaceOwner,
} from "@shared/api-contracts/workspace";
import { isEmpty } from "lodash-es";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { cn } from "@/lib/utils/classname";
import { handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";

type WorkspaceSwitcherProps = {
  showCreateWorkspace: boolean;
};

export const MAP_ROLE_TO_LABEL: Record<string, string> = {
  [WORKSPACE_MEMBER_ROLE.WORKSPACE_ADMIN]: "Admin",
  [WORKSPACE_MEMBER_ROLE.WORKSPACE_MEMBER]: "Member",
};

const INACTIVE_ACCOUNT_STATES = new Set([
  SUBSCRIPTION_STATUS.CANCELLED,
  SUBSCRIPTION_STATUS.INACTIVE,
  SUBSCRIPTION_STATUS.PAUSED,
]);

export const WorkspaceSwitcher = ({
  showCreateWorkspace,
}: WorkspaceSwitcherProps) => {
  const { defaultWorkspace, user, availableWorkspaces, refresh } = useAccount();
  const { assignDefault, removeDefault } = useWorkspaceMutations();
  const { isMobile } = useSidebar();

  const allWorkspaces = useMemo(() => {
    if (defaultWorkspace.workspace.id) {
      return [defaultWorkspace, ...availableWorkspaces];
    }

    return availableWorkspaces;
  }, [defaultWorkspace, availableWorkspaces]);

  const computeStatusColor = useCallback(
    (workspace: Workspace, subscription: WorkspaceAccessSubscription) => {
      if (defaultWorkspace.workspace.id === workspace.id)
        return "text-green-500";
      if (INACTIVE_ACCOUNT_STATES.has(subscription.status))
        return "text-red-500";

      return "text-muted-foreground";
    },
    [defaultWorkspace],
  );

  const computeRoleLabel = useCallback(
    (role: WORKSPACE_MEMBER_ROLE, owner: WorkspaceOwner) => {
      if (user.id === owner.id) {
        return "Workspace Owner";
      }
      return MAP_ROLE_TO_LABEL[role] || "Member";
    },
    [user],
  );

  const handleWorkspaceChange = useCallback(
    async (workspaceId: string) => {
      try {
        await assignDefault.mutateAsync({ workspaceId });
        await refresh();
        toast.success("Default workspace switched successfully.");
      } catch (error) {
        handleError(error);
      }
    },
    [assignDefault, refresh],
  );

  const handleAddWorkspace = useCallback(async () => {
    try {
      await removeDefault.mutateAsync();
      await refresh();
    } catch (error) {
      handleError(error);
    }
  }, [removeDefault, refresh]);

  if (isEmpty(allWorkspaces)) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-testid={DATA_TEST_IDS.NAVIGATION.WORKSPACE_SWITCHER}
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {defaultWorkspace.workspace.name || "Select Workspace"}
                </span>
                <span className="truncate text-xs">
                  {computeRoleLabel(
                    defaultWorkspace.membership.role,
                    defaultWorkspace.owner,
                  )}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-(--radix-dropdown-menu-trigger-width) max-w-screen rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground font-medium">
              Select Workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allWorkspaces.map(
              ({ workspace, subscription, membership, owner }) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace.id)}
                  className={cn("flex justify-between items-center p-2")}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={cn(
                        "flex items-center justify-center text-2xl",
                        computeStatusColor(workspace, subscription),
                      )}
                    >
                      •
                    </div>
                    <div className="w-full flex justify-between items-center gap-16">
                      <div>
                        <div className="font-medium text-sm text-nowrap truncate">
                          {workspace.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {computeRoleLabel(membership.role, owner)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {subscription.plan.name}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ),
            )}
            {showCreateWorkspace && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAddWorkspace}>
                  <PlusIcon />
                  Create Workspace
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
