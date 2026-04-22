import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus, Trash } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

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
import { useAuthorization } from "@/hooks/use-authorization";
import { useModalContext } from "@/hooks/use-modal";
import { InviteUsersModal } from "@/modals/invite-users-modal";
import { handleBulkError, handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";
import {
  type InvitedTeamTableProperties,
  INVITED_TEAM_TABLE_COLUMNS,
} from "@/pages/settings/workspace/team/invites-page/consts";

type InvitesPageProps = {
  data: InvitedTeamTableProperties[];
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

export const InvitesPage = ({
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
}: InvitesPageProps) => {
  const {
    invitesFeatures: { deleteInvites, createInvites },
  } = useAuthorization();
  const { expireWorkspaceInvites } = useWorkspaceMutations();
  const { openModal } = useModalContext();

  const handleOpenInviteUsersModal = useCallback(() => {
    openModal(InviteUsersModal, {
      onComplete: refetch,
    });
  }, [openModal, refetch]);

  const handleRevokeInvitation = useCallback(
    async (inviteIds: string[]) => {
      try {
        const response = await expireWorkspaceInvites.mutateAsync({
          inviteIds,
        });
        handleBulkError({
          errors: response.errors,
        });
        toast.success("Invitation(s) revoked successfully");
        refetch();
      } catch (error) {
        handleError(error);
      }
    },
    [expireWorkspaceInvites, refetch],
  );

  const columns: ColumnDef<InvitedTeamTableProperties>[] = useMemo(
    () => [
      {
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Email"
            column={column}
            enableSorting={true}
          />
        ),
        accessorKey: INVITED_TEAM_TABLE_COLUMNS.EMAIL,
      },
      {
        header: ({ column }) => (
          <InfiniteScrollTableHeader
            name="Invited on"
            column={column}
            enableSorting={true}
          />
        ),
        accessorKey: INVITED_TEAM_TABLE_COLUMNS.INVITED_AT,
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
            name="Expires at"
            column={column}
            enableSorting={true}
          />
        ),
        accessorKey: INVITED_TEAM_TABLE_COLUMNS.EXPIRES_AT,
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
        id: INVITED_TEAM_TABLE_COLUMNS.ACTIONS,
        header: () => <InfiniteScrollTableActionHeader />,
        cell: ({ row }) => (
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
                  variant="destructive"
                  onClick={() => handleRevokeInvitation([row.original.id])}
                >
                  <Trash />
                  Revoke invitation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [handleRevokeInvitation],
  );

  return (
    <InfiniteScrollTable<InvitedTeamTableProperties>
      data={data}
      columns={columns}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      selectionConfig={{
        rowSelection,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row.id,
      }}
      bulkActions={[
        {
          onClick: async (selectedRows, clearSelection) => {
            handleRevokeInvitation(selectedRows.map((row) => row.id));
            clearSelection();
          },
          icon: <Trash className="h-4 w-4" />,
          tooltip: "Revoke selected invitations",
          disabled: !deleteInvites.allowed,
        },
      ]}
      sortingConfig={{
        sorting: sortingState,
        onSortingChange: setSorting,
      }}
      columnVisibilityConfig={{
        columnVisibility: visibility,
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
