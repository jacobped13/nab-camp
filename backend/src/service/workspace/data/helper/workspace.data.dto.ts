import { UserEntity } from '@service/user';
import { WorkspaceEntity, WorkspaceMemberEntity } from './workspace.data.model';

export type WorkspaceMemberWorkspaceAggregate = {
  workspace: WorkspaceEntity;
  workspaceMember: WorkspaceMemberEntity;
};

export type WorkspaceMemberWorkspaceUserAggregate = {
  user: UserEntity;
  workspace: WorkspaceEntity;
  workspaceMember: WorkspaceMemberEntity;
};

export type WorkspaceMemberUserAggregate = {
  user: UserEntity;
  workspaceMember: WorkspaceMemberEntity;
};
