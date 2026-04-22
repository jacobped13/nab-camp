import {
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { Page } from "@/app/layouts/page-layouts/page";
import { useAuthorization } from "@/hooks/use-authorization";
import { useWorkspaceInvites } from "@/network/modules/workspace";
import { TeamTabs } from "@/pages/settings/shared/team-tabs";
import {
  INVITED_TEAM_TABLE_COLUMNS,
  mapSortStateToApiProperties,
  mapToInviteTableStructure,
} from "@/pages/settings/workspace/team/invites-page/consts";
import { InvitesPage } from "@/pages/settings/workspace/team/invites-page/invites-page";

export const InvitesPageInitializer = () => {
  const {
    routes: { invitesRoute },
    invitesFeatures: { deleteInvites },
  } = useAuthorization();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: INVITED_TEAM_TABLE_COLUMNS.INVITED_AT,
      desc: true,
    },
  ]);

  const visibility = useMemo<VisibilityState>(
    () => ({
      [INVITED_TEAM_TABLE_COLUMNS.EMAIL]: true,
      [INVITED_TEAM_TABLE_COLUMNS.INVITED_AT]: true,
      [INVITED_TEAM_TABLE_COLUMNS.EXPIRES_AT]: true,
      [INVITED_TEAM_TABLE_COLUMNS.ACTIONS]: deleteInvites.allowed,
    }),
    [deleteInvites],
  );

  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useWorkspaceInvites({ ...mapSortStateToApiProperties(sorting) });

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const mappedData = useMemo(() => {
    return mapToInviteTableStructure({ data });
  }, [data]);

  return (
    <Page
      title="Team"
      subheader={<TeamTabs />}
      loading={isLoading}
      permission={invitesRoute.allowed}
    >
      <InvitesPage
        data={mappedData}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sortingState={sorting}
        setSorting={setSorting}
        refetch={handleRefetch}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        visibility={visibility}
      />
    </Page>
  );
};
