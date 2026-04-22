import { type WORKSPACE_MEMBER_ROLE } from "@shared/api-contracts/workspace";
import {
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash, UserCog } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Routes } from "@/app/routes/routes";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import {
  InfiniteScrollTable,
  InfiniteScrollTableActionHeader,
  InfiniteScrollTableHeader,
} from "@/components/infinite-scroll-table";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { useAccount } from "@/hooks/use-account";
import { useAuthorization } from "@/hooks/use-authorization";
import { useModalContext } from "@/hooks/use-modal";
import { useNavigate } from "@/hooks/use-navigate";
import {
  ChangeUserRoleModal,
  type Members,
} from "@/modals/change-user-role-modal";
import { DeleteUsersModal } from "@/modals/delete-users-modal";
import { InviteUsersModal } from "@/modals/invite-users-modal";
import {
  ACTIVE_TEAM_TABLE_COLUMNS,
  type ActiveTeamTableProperties,
} from "@/pages/settings/workspace/team/team-page/consts";
import { RoleBadge } from "@/pages/settings/workspace/team/team-page/role-badge";

type TeamPageProps = {
  data: ActiveTeamTableProperties[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  sortingState: SortingState;
  setSorting: (sorting: SortingState) => void;
  refetch: () => void;
  rowSelection: RowSelectionState;
  setRowSelection: (rowSelection: RowSelectionState) => void;
  visibility: VisibilityState;
};

type HandleOpenDeleteUser = {
  ids: string[];
  names: string[];
  clearSelection?: () => void;
};

type HandleOpenChangeUserRole = {
  members: Members;
  clearSelection?: () => void;
};

export const TeamPage = ({
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  sortingState,
  setSorting,
  refetch,
  rowSelection,
  setRowSelection,
  visibility,
}: TeamPageProps) => {
  const {
    defaultWorkspace: {
      owner: { id: ownerId },
    },
    user: { id: userId },
  } = useAccount();

  const {
    membersFeatures: { changeMemberRole, deleteMembers, hasAnyMemberAction },
    invitesFeatures: { createInvites },
  } = useAuthorization();

  const navigate = useNavigate();
  const { openModal } = useModalContext();

  const enableRowSelection = useCallback(
    (row: Row<ActiveTeamTableProperties>) => {
      if (hasAnyMemberAction.allowed) {
        return (
          row.original.userId !== ownerId && row.original.userId !== userId
        );
      }
      return false;
    },
    [ownerId, hasAnyMemberAction, userId],
  );

  const handleOpenInviteUsersModal = useCallback(() => {
    openModal(InviteUsersModal, {
      onComplete: () => navigate({ route: Routes.WorkspaceInvites }),
    });
  }, [openModal, navigate]);

  const handleOpenChangeUserRoleModal = useCallback(
    ({ members, clearSelection }: HandleOpenChangeUserRole) => {
      openModal(ChangeUserRoleModal, {
        members,
        onComplete: () => {
          refetch();
          clearSelection?.();
        },
      });
    },
    [openModal, refetch],
  );

  const handleOpenDeleteUserModal = useCallback(
    ({ ids, names, clearSelection }: HandleOpenDeleteUser) => {
      openModal(DeleteUsersModal, {
        ids,
        names,
        onComplete: () => {
          refetch();
          clearSelection?.();
        },
      });
    },
    [openModal, refetch],
  );

  const columns: ColumnDef<ActiveTeamTableProperties>[] = useMemo(
    () => [
      {
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Name"
            column={column}
            enableSorting={true}
          />
        ),
        accessorKey: ACTIVE_TEAM_TABLE_COLUMNS.NAME,
      },
      {
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Email"
            column={column}
            enableSorting={true}
          />
        ),
        accessorKey: ACTIVE_TEAM_TABLE_COLUMNS.EMAIL,
      },
      {
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Date Joined"
            column={column}
            enableSorting={true}
          />
        ),
        accessorKey: ACTIVE_TEAM_TABLE_COLUMNS.CREATED_AT,
        cell: ({ cell }) => {
          const date = new Date(cell.getValue<number>());
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
      {
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Role"
            column={column}
            enableSorting={false}
          />
        ),
        accessorKey: ACTIVE_TEAM_TABLE_COLUMNS.ROLE,
        cell: ({ row, cell }) => {
          return (
            <RoleBadge
              userId={row.original.userId}
              role={cell.getValue<WORKSPACE_MEMBER_ROLE>()}
            />
          );
        },
      },

      {
        id: "actions",
        header: () => <InfiniteScrollTableActionHeader />,
        cell: ({ row }) => {
          const enabled = enableRowSelection(row);
          if (!enabled) return <div />;

          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="text-right">
                  <Button
                    variant="secondary"
                    className="h-8 w-8 p-0 flex justify-center items-center ml-auto"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenChangeUserRoleModal({
                        members: [
                          {
                            id: row.original.memberId,
                            role: row.original.role,
                            name: row.original.name,
                          },
                        ],
                      })
                    }
                  >
                    <UserCog />
                    Change role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      handleOpenDeleteUserModal({
                        ids: [row.original.memberId],
                        names: [row.original.name],
                      })
                    }
                  >
                    <Trash />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [
      handleOpenChangeUserRoleModal,
      handleOpenDeleteUserModal,
      enableRowSelection,
    ],
  );

  return (
    <InfiniteScrollTable<ActiveTeamTableProperties>
      data={data}
      columns={columns}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      selectionConfig={{
        rowSelection,
        onRowSelectionChange: setRowSelection,
        enableRowSelection,
        getRowId: (row) => row.memberId,
      }}
      bulkActions={[
        {
          onClick: async (selectedRows, clearSelection) => {
            handleOpenDeleteUserModal({
              ids: selectedRows.map((row) => row.memberId),
              names: selectedRows.map((row) => row.name),
              clearSelection,
            });
          },
          icon: <Trash className="h-4 w-4" />,
          tooltip: "Remove selected members",
          disabled: !deleteMembers.allowed,
        },
        {
          onClick: async (selectedRows, clearSelection) => {
            handleOpenChangeUserRoleModal({
              members: selectedRows.map((row) => ({
                id: row.memberId,
                role: row.role,
                name: row.name,
              })),
              clearSelection,
            });
          },
          icon: <UserCog className="h-4 w-4" />,
          tooltip: "Change role of selected members",
          disabled: !changeMemberRole.allowed,
        },
      ]}
      columnVisibilityConfig={{
        columnVisibility: visibility,
      }}
      sortingConfig={{
        sorting: sortingState,
        onSortingChange: setSorting,
      }}
      action={
        <>
          {createInvites.allowed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInviteUsersModal}
              data-testid={DATA_TEST_IDS.INVITE.OPEN_INVITE_MODAL_BUTTON}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Invite team members
              </div>
            </Button>
          )}
        </>
      }
    />
  );
};
