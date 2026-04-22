import { SORT_DIRECTION } from "@shared/api-contracts/common";
import {
  type WORKSPACE_MEMBER_ROLE,
  WORKSPACE_MEMBER_SORT_FIELD,
  type WorkspaceMember,
} from "@shared/api-contracts/workspace";
import { type SortingState } from "@tanstack/react-table";
import { isEmpty } from "lodash-es";

export enum ACTIVE_TEAM_TABLE_COLUMNS {
  MEMBER_ID = "memberId",
  USER_ID = "userId",
  CREATED_AT = "createdAt",
  NAME = "name",
  ROLE = "role",
  EMAIL = "email",
  ACTIONS = "actions",
}

export type ActiveTeamTableProperties = {
  [ACTIVE_TEAM_TABLE_COLUMNS.MEMBER_ID]: string;
  [ACTIVE_TEAM_TABLE_COLUMNS.USER_ID]: string;
  [ACTIVE_TEAM_TABLE_COLUMNS.CREATED_AT]: number;
  [ACTIVE_TEAM_TABLE_COLUMNS.NAME]: string;
  [ACTIVE_TEAM_TABLE_COLUMNS.EMAIL]: string;
  [ACTIVE_TEAM_TABLE_COLUMNS.ROLE]: WORKSPACE_MEMBER_ROLE;
};

export const SORT_FIELD_MAPPER = {
  [ACTIVE_TEAM_TABLE_COLUMNS.CREATED_AT]:
    WORKSPACE_MEMBER_SORT_FIELD.CREATED_AT,
  [ACTIVE_TEAM_TABLE_COLUMNS.NAME]: WORKSPACE_MEMBER_SORT_FIELD.FIRST_NAME,
  [ACTIVE_TEAM_TABLE_COLUMNS.EMAIL]: WORKSPACE_MEMBER_SORT_FIELD.EMAIL,
};

export const mapSortStateToApiProperties = (sortingState: SortingState) => {
  if (isEmpty(sortingState)) {
    return {
      sortField: WORKSPACE_MEMBER_SORT_FIELD.EMAIL,
      sortDirection: SORT_DIRECTION.DESC,
    };
  }

  const sort = sortingState[0];

  return {
    sortField: SORT_FIELD_MAPPER[sort.id as keyof typeof SORT_FIELD_MAPPER],
    sortDirection: sort.desc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
  };
};

type MapToActiveTeamTableStructure = {
  data: WorkspaceMember[];
};

export const mapToActiveTeamTableStructure = ({
  data,
}: MapToActiveTeamTableStructure): ActiveTeamTableProperties[] => {
  if (!data) return [];

  return data.map((item) => ({
    [ACTIVE_TEAM_TABLE_COLUMNS.MEMBER_ID]: item.id,
    [ACTIVE_TEAM_TABLE_COLUMNS.USER_ID]: item.userId,
    [ACTIVE_TEAM_TABLE_COLUMNS.CREATED_AT]: item.createdAt,
    [ACTIVE_TEAM_TABLE_COLUMNS.NAME]: `${item.firstName} ${item.lastName}`,
    [ACTIVE_TEAM_TABLE_COLUMNS.EMAIL]: item.email,
    [ACTIVE_TEAM_TABLE_COLUMNS.ROLE]: item.role,
  }));
};
