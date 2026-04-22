import { SORT_DIRECTION } from "@shared/api-contracts/common";
import {
  WORKSPACE_EMAIL_INVITE_SORT_FIELD,
  type WorkspaceEmailInvite,
} from "@shared/api-contracts/workspace";
import { type SortingState } from "@tanstack/react-table";
import { isEmpty } from "lodash-es";

export enum INVITED_TEAM_TABLE_COLUMNS {
  ID = "id",
  EMAIL = "email",
  INVITED_AT = "invitedAt",
  EXPIRES_AT = "expiresAt",
  ACTIONS = "actions",
}

export type InvitedTeamTableProperties = {
  [INVITED_TEAM_TABLE_COLUMNS.ID]: string;
  [INVITED_TEAM_TABLE_COLUMNS.EMAIL]: string;
  [INVITED_TEAM_TABLE_COLUMNS.INVITED_AT]: number;
  [INVITED_TEAM_TABLE_COLUMNS.EXPIRES_AT]: number;
};

export const SORT_FIELD_MAPPER = {
  [INVITED_TEAM_TABLE_COLUMNS.EMAIL]: WORKSPACE_EMAIL_INVITE_SORT_FIELD.EMAIL,
  [INVITED_TEAM_TABLE_COLUMNS.INVITED_AT]:
    WORKSPACE_EMAIL_INVITE_SORT_FIELD.CREATED_AT,
  [INVITED_TEAM_TABLE_COLUMNS.EXPIRES_AT]:
    WORKSPACE_EMAIL_INVITE_SORT_FIELD.EXPIRE_AT,
};

export const mapSortStateToApiProperties = (sortingState: SortingState) => {
  if (isEmpty(sortingState)) {
    return {
      sortField: WORKSPACE_EMAIL_INVITE_SORT_FIELD.CREATED_AT,
      sortDirection: SORT_DIRECTION.DESC,
    };
  }

  const sort = sortingState[0];

  return {
    sortField: SORT_FIELD_MAPPER[sort.id as keyof typeof SORT_FIELD_MAPPER],
    sortDirection: sort.desc ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC,
  };
};

type MapToInviteTableStructure = {
  data: WorkspaceEmailInvite[];
};

export const mapToInviteTableStructure = ({
  data,
}: MapToInviteTableStructure): InvitedTeamTableProperties[] => {
  if (!data) return [];

  return data.map((item) => ({
    id: item.id,
    email: item.email,
    invitedAt: item.createdAt,
    expiresAt: item.expireAt,
  }));
};
