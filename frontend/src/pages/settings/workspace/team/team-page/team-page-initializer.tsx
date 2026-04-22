import {
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { Page } from "@/app/layouts/page-layouts/page";
import { useAuthorization } from "@/hooks/use-authorization";
import { useWorkspaceMembers } from "@/network/modules/workspace";
import { TeamTabs } from "@/pages/settings/shared/team-tabs";
import {
  ACTIVE_TEAM_TABLE_COLUMNS,
  mapSortStateToApiProperties,
  mapToActiveTeamTableStructure,
} from "@/pages/settings/workspace/team/team-page/consts";
import { TeamPage } from "@/pages/settings/workspace/team/team-page/team-page";

export const TeamPageInitializer = () => {
  const {
    routes: { teamsRoute },
    membersFeatures: { hasAnyMemberAction },
  } = useAuthorization();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: ACTIVE_TEAM_TABLE_COLUMNS.EMAIL,
      desc: true,
    },
  ]);

  const {
    data,
    totalCount,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useWorkspaceMembers({ ...mapSortStateToApiProperties(sorting) });

  const isSinglePersonWorkspace = useMemo(() => {
    return totalCount === 1;
  }, [totalCount]);

  const visibility = useMemo<VisibilityState>(
    () => ({
      [ACTIVE_TEAM_TABLE_COLUMNS.NAME]: true,
      [ACTIVE_TEAM_TABLE_COLUMNS.EMAIL]: true,
      [ACTIVE_TEAM_TABLE_COLUMNS.CREATED_AT]: true,
      [ACTIVE_TEAM_TABLE_COLUMNS.ROLE]: true,
      [ACTIVE_TEAM_TABLE_COLUMNS.ACTIONS]:
        hasAnyMemberAction.allowed && !isSinglePersonWorkspace,
    }),
    [hasAnyMemberAction, isSinglePersonWorkspace],
  );

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const mappedData = useMemo(() => {
    return mapToActiveTeamTableStructure({ data });
  }, [data]);

  return (
    <Page
      title="Team"
      subheader={<TeamTabs />}
      loading={isLoading}
      permission={teamsRoute.allowed}
    >
      <TeamPage
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
