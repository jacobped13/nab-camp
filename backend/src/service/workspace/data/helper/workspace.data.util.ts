import { DataMapper, Nullable } from '@common';
import { set } from 'lodash-es';
import {
  UserDefaultWorkspace,
  Workspace,
  WorkspaceMember,
  WorkspaceInvite,
  Prisma,
} from '@prisma/client';
import {
  UserDefaultWorkspaceEntity,
  WorkspaceEntity,
  WorkspaceMemberEntity,
  WorkspaceInviteEntity,
} from './workspace.data.model';
import {
  WORKSPACE_INVITE_TARGET_TYPE,
  WORKSPACE_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_SORT_FIELD,
} from '@service/workspace/common/workspace.constant';
import { SORT_DIRECTION } from '@lib/util/pagination.util';
import {
  WorkspaceInviteSortInputDto,
  WorkspaceMemberSortInputDto,
} from '@service/workspace/common/workspace.dto';

// -----------------------------------------------------------------
// User Default Workspace Data Mapper
// -----------------------------------------------------------------

class UserDefaultWorkspaceDataMapper extends DataMapper<
  UserDefaultWorkspace,
  UserDefaultWorkspaceEntity
> {
  override mapInputObject(
    source: UserDefaultWorkspace
  ): UserDefaultWorkspaceEntity {
    return new UserDefaultWorkspaceEntity(
      source.id,
      source.userId,
      source.workspaceId,
      source.createdAt,
      source.updatedAt
    );
  }
}

const userDefaultWorkspaceDataMapper = new UserDefaultWorkspaceDataMapper();

/**
 * Maps an ORM user default workspace record to a normalized {@link UserDefaultWorkspaceEntity}.
 */
export const mapUserDefaultWorkspaceEntity = (
  userDefaultWorkspace: Nullable<UserDefaultWorkspace> | UserDefaultWorkspace[]
) => {
  return userDefaultWorkspaceDataMapper.map(userDefaultWorkspace);
};

// -----------------------------------------------------------------
// Workspace Entity Mapper
// -----------------------------------------------------------------

class WorkspaceEntityMapper extends DataMapper<Workspace, WorkspaceEntity> {
  override mapInputObject(source: Workspace): WorkspaceEntity {
    return new WorkspaceEntity(
      source.id,
      source.name,
      source.url,
      source.createdAt,
      source.updatedAt
    );
  }
}

const workspaceEntityMapper = new WorkspaceEntityMapper();

/**
 * Maps an ORM workspace record to a normalized {@link WorkspaceEntity}.
 */
export const mapWorkspaceEntity = (
  workspace: Nullable<Workspace> | Workspace[]
) => {
  return workspaceEntityMapper.map(workspace);
};

// -----------------------------------------------------------------
// Workspace Member Entity Mapper
// -----------------------------------------------------------------

class WorkspaceMemberEntityMapper extends DataMapper<
  WorkspaceMember,
  WorkspaceMemberEntity
> {
  override mapInputObject(source: WorkspaceMember): WorkspaceMemberEntity {
    return new WorkspaceMemberEntity(
      source.id,
      source.workspaceId,
      source.userId,
      source.createdAt,
      source.updatedAt
    );
  }
}

const workspaceMemberEntityMapper = new WorkspaceMemberEntityMapper();

/**
 * Maps an ORM workspace member record to a normalized {@link WorkspaceMemberEntity}.
 */
export const mapWorkspaceMemberEntity = (
  workspaceMember: Nullable<WorkspaceMember> | WorkspaceMember[]
) => {
  return workspaceMemberEntityMapper.map(workspaceMember);
};

// -----------------------------------------------------------------
// Workspace Invite Entity Mapper
// -----------------------------------------------------------------

class WorkspaceInviteEntityMapper extends DataMapper<
  WorkspaceInvite,
  WorkspaceInviteEntity
> {
  override mapInputObject(source: WorkspaceInvite): WorkspaceInviteEntity {
    return new WorkspaceInviteEntity(
      source.id,
      source.workspaceId,
      source.targetId,
      source.targetType as WORKSPACE_INVITE_TARGET_TYPE,
      source.codeHash,
      source.acceptedAt,
      source.declinedAt,
      source.expireAt,
      source.createdAt,
      source.updatedAt
    );
  }
}

const workspaceInviteEntityMapper = new WorkspaceInviteEntityMapper();

/**
 * Maps an ORM workspace invite record to a normalized {@link WorkspaceInviteEntity}.
 */
export const mapWorkspaceInviteEntity = (
  workspaceInvite: Nullable<WorkspaceInvite> | WorkspaceInvite[]
) => {
  return workspaceInviteEntityMapper.map(workspaceInvite);
};

// -----------------------------------------------------------------
// Transformers
// -----------------------------------------------------------------

/**
 * Mapping between the sort direction and the prisma direction.
 */
const SORT_DIRECTION_TO_PRISMA_DIRECTION: Record<
  SORT_DIRECTION,
  Prisma.SortOrder
> = {
  [SORT_DIRECTION.ASC]: 'asc',
  [SORT_DIRECTION.DESC]: 'desc',
};

/**
 * Mapping between the workspace invite sort field and the prisma field.
 */
const WORKSPACE_INVITE_SORT_FIELD_TO_PRISMA_FIELD: Partial<
  Record<WORKSPACE_INVITE_SORT_FIELD, string>
> = {
  [WORKSPACE_INVITE_SORT_FIELD.CREATED_AT]: 'createdAt',
  [WORKSPACE_INVITE_SORT_FIELD.EXPIRE_AT]: 'expireAt',
  [WORKSPACE_INVITE_SORT_FIELD.TARGET_ID]: 'targetId',
};

/**
 * Transforms a workspace invite sort DTO to a Prisma sort object.
 *
 * @returns The Prisma sort object or null if the sort is invalid.
 */
export const transformWorkspaceInviteSortDtoToPrismaSort = (
  sort: WorkspaceInviteSortInputDto
): Nullable<Prisma.WorkspaceInviteOrderByWithRelationInput> => {
  const sortDirection = SORT_DIRECTION_TO_PRISMA_DIRECTION[sort.direction];
  const sortField = WORKSPACE_INVITE_SORT_FIELD_TO_PRISMA_FIELD[sort.field];

  if (!sortDirection || !sortField) {
    return null;
  }

  return set({}, sortField, sortDirection);
};

/**
 * Transforms a workspace invite sort DTO to a Prisma sort object.
 *
 * @returns The Prisma sort object or throws an error if the sort is invalid.
 */
export const transformOrThrowWorkspaceInviteSortDtoToPrismaSort = (
  sort: WorkspaceInviteSortInputDto
): Prisma.WorkspaceInviteOrderByWithRelationInput => {
  const transformedSort = transformWorkspaceInviteSortDtoToPrismaSort(sort);

  if (!transformedSort) {
    throw new Error('Invalid workspace invite sort');
  }

  return transformedSort;
};

const WORKSPACE_MEMBER_SORT_FIELD_TO_PRISMA_FIELD: Partial<
  Record<WORKSPACE_MEMBER_SORT_FIELD, string>
> = {
  [WORKSPACE_MEMBER_SORT_FIELD.CREATED_AT]: 'createdAt',
  [WORKSPACE_MEMBER_SORT_FIELD.EMAIL]: 'user.email',
  [WORKSPACE_MEMBER_SORT_FIELD.FIRST_NAME]: 'user.firstName',
  [WORKSPACE_MEMBER_SORT_FIELD.LAST_NAME]: 'user.lastName',
};

export const transformWorkspaceMemberSortDtoToPrismaSort = (
  sort: WorkspaceMemberSortInputDto
): Nullable<Prisma.WorkspaceMemberOrderByWithRelationInput> => {
  const sortDirection = SORT_DIRECTION_TO_PRISMA_DIRECTION[sort.direction];
  const sortField = WORKSPACE_MEMBER_SORT_FIELD_TO_PRISMA_FIELD[sort.field];

  if (!sortDirection || !sortField) {
    return null;
  }

  return set({}, sortField, sortDirection);
};

export const transformOrThrowWorkspaceMemberSortDtoToPrismaSort = (
  sort: WorkspaceMemberSortInputDto
): Prisma.WorkspaceMemberOrderByWithRelationInput => {
  const transformedSort = transformWorkspaceMemberSortDtoToPrismaSort(sort);

  if (!transformedSort) {
    throw new Error('Invalid workspace member sort');
  }

  return transformedSort;
};
