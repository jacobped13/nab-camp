import { Nullable } from '@common';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  CursorPaginationInputDto,
  CursorPaginationOutputDto,
  PAGINATION_DIRECTION,
} from '@lib/util/pagination.util';
import {
  WorkspaceMemberWorkspaceAggregate,
  WorkspaceMemberUserAggregate,
  WorkspaceMemberWorkspaceUserAggregate,
} from './helper/workspace.data.dto';
import {
  mapUserDefaultWorkspaceEntity,
  mapWorkspaceEntity,
  mapWorkspaceInviteEntity,
  mapWorkspaceMemberEntity,
  transformOrThrowWorkspaceInviteSortDtoToPrismaSort,
  transformOrThrowWorkspaceMemberSortDtoToPrismaSort,
} from './helper/workspace.data.util';
import {
  UserDefaultWorkspaceEntity,
  WorkspaceEntity,
  WorkspaceInviteEntity,
  WorkspaceMemberEntity,
} from './helper/workspace.data.model';
import { WORKSPACE_INVITE_TARGET_TYPE } from '../common/workspace.constant';
import {
  WorkspaceInviteSortInputDto,
  WorkspaceMemberSortInputDto,
} from '../common/workspace.dto';
import { Prisma, User, WorkspaceMember } from '@prisma/client';
import { mapUserEntity } from '@service/user/data/helper/user.data.util';
import { UserEntity } from '@service/user';

export const upsertUserDefaultWorkspace = async (
  userId: string,
  workspaceId: string
): Promise<WorkspaceEntity> => {
  const currentDate = new Date();

  return mapWorkspaceEntity(
    await prisma.$transaction(async (tx) => {
      // Step 1: Upsert the user default workspace
      const userDefaultWorkspace = await prisma.userDefaultWorkspace.upsert({
        where: {
          userId: userId,
        },
        update: {
          workspaceId: workspaceId,
          updatedAt: currentDate,
        },
        create: {
          userId: userId,
          workspaceId: workspaceId,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      // Step 2: Find the workspace associated with the user default workspace
      const workspace = await tx.workspace.findUnique({
        where: {
          id: userDefaultWorkspace.workspaceId,
        },
      });

      return workspace!;
    })
  ) as WorkspaceEntity;
};

export const findUserDefaultWorkspace = (
  userId: string
): Promise<Nullable<WorkspaceEntity>> => {
  return prisma.$transaction(async (tx) => {
    // Step 1: Find the user default workspace
    const userDefaultWorkspace = await tx.userDefaultWorkspace.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userDefaultWorkspace) {
      return null;
    }

    // Step 2: Find the workspace associated with the user default workspace
    const workspace = await tx.workspace.findUnique({
      where: {
        id: userDefaultWorkspace.workspaceId,
      },
    });

    if (!workspace) {
      return null;
    }

    return mapWorkspaceEntity(workspace) as WorkspaceEntity;
  });
};

export const removeUserDefaultWorkspace = async (
  userId: string
): Promise<UserDefaultWorkspaceEntity> => {
  return mapUserDefaultWorkspaceEntity(
    await prisma.userDefaultWorkspace.delete({
      where: {
        userId: userId,
      },
    })
  ) as UserDefaultWorkspaceEntity;
};

export const findAllWorkspaceMembersByWorkspaceId = async (
  workspaceId: string
): Promise<WorkspaceMemberEntity[]> => {
  return mapWorkspaceMemberEntity(
    await prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspaceId,
      },
    })
  ) as WorkspaceMemberEntity[];
};

export const findWorkspaceMemberByWorkspaceIdAndUserId = async (
  workspaceId: string,
  userId: string
): Promise<Nullable<WorkspaceMemberUserAggregate>> => {
  const workspaceMemberAggregate = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspaceId,
        userId: userId,
      },
    },
    include: {
      user: true,
    },
  });

  if (!workspaceMemberAggregate) {
    return null;
  }

  return {
    user: mapUserEntity(workspaceMemberAggregate.user) as UserEntity,
    workspaceMember: mapWorkspaceMemberEntity(
      workspaceMemberAggregate
    ) as WorkspaceMemberEntity,
  };
};

export const findAllWorkspacesAndMemberByUserId = async (
  userId: string
): Promise<WorkspaceMemberWorkspaceUserAggregate[]> => {
  const workspaceMemberAggregates = await prisma.workspaceMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      workspace: true,
    },
  });

  return workspaceMemberAggregates.map((aggregate) => {
    const user = aggregate.user;
    const workspace = aggregate.workspace;
    const workspaceMember = aggregate;

    return {
      user: mapUserEntity(user) as UserEntity,
      workspace: mapWorkspaceEntity(workspace) as WorkspaceEntity,
      workspaceMember: mapWorkspaceMemberEntity(
        workspaceMember
      ) as WorkspaceMemberEntity,
    };
  });
};

export const findWorkspaceMemberById = async (
  id: string
): Promise<Nullable<WorkspaceMemberUserAggregate>> => {
  const workspaceMemberAggregate = await prisma.workspaceMember.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
    },
  });

  if (!workspaceMemberAggregate) {
    return null;
  }

  return {
    user: mapUserEntity(workspaceMemberAggregate.user) as UserEntity,
    workspaceMember: mapWorkspaceMemberEntity(
      workspaceMemberAggregate
    ) as WorkspaceMemberEntity,
  };
};

export const deleteWorkspaceMember = async (
  id: string
): Promise<WorkspaceMemberEntity> => {
  return mapWorkspaceMemberEntity(
    await prisma.workspaceMember.delete({
      where: {
        id: id,
      },
    })
  ) as WorkspaceMemberEntity;
};

export const createWorkspaceMember = async (
  workspaceId: string,
  userId: string
): Promise<WorkspaceMemberEntity> => {
  const currentDate = new Date();

  return mapWorkspaceMemberEntity(
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspaceId,
        userId: userId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as WorkspaceMemberEntity;
};

export const createWorkspaceAndMember = async (
  name: string,
  url: Nullable<string>,
  userId: string
): Promise<WorkspaceMemberWorkspaceAggregate> => {
  return await prisma.$transaction(async (tx) => {
    const currentDate = new Date();

    const workspace = await tx.workspace.create({
      data: {
        name: name,
        url: url,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    const workspaceMember = await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: userId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    return {
      workspace: mapWorkspaceEntity(workspace) as WorkspaceEntity,
      workspaceMember: mapWorkspaceMemberEntity(
        workspaceMember
      ) as WorkspaceMemberEntity,
    };
  });
};

export const cursorPaginateWorkspaceMembers = async (
  pagination: CursorPaginationInputDto,
  sort?: WorkspaceMemberSortInputDto[],
  filter?: {
    workspaceId?: string;
  }
): Promise<CursorPaginationOutputDto<WorkspaceMemberUserAggregate>> => {
  // Arrange filter args
  const filterArgs: Prisma.WorkspaceMemberWhereInput = {
    workspaceId: filter?.workspaceId,
  };

  // Arrange sort args
  const sortArgs: Prisma.WorkspaceMemberOrderByWithRelationInput[] = [
    ...(sort?.map((sortOption) =>
      transformOrThrowWorkspaceMemberSortDtoToPrismaSort(sortOption)
    ) ?? []),
    // Default sort by ID in ascending order
    {
      id: 'asc',
    },
  ];

  // Arrange pagination args
  const cursorId = pagination.cursor ?? undefined;
  const skip = cursorId ? 1 : 0;
  const limit = pagination.limit ?? 0;
  const limitMultiplier =
    pagination.direction === PAGINATION_DIRECTION.FORWARD ? 1 : -1;
  const take = Math.abs(limit + 1) * limitMultiplier;

  const paginationArgs: Prisma.WorkspaceMemberFindManyArgs = {
    skip: skip,
    take: take,
    cursor: cursorId ? { id: cursorId } : undefined,
  };

  // Combine query args
  const queryArgs: Prisma.WorkspaceMemberFindManyArgs = {
    ...paginationArgs,
    orderBy: sortArgs,
    where: filterArgs,
    include: {
      user: true,
    },
  };

  // Execute the query
  const [targetNodes, totalCount] = await prisma.$transaction([
    prisma.workspaceMember.findMany(queryArgs),
    prisma.workspaceMember.count({ where: filterArgs }),
  ]);

  const nodes = targetNodes as (WorkspaceMember & { user: User })[];

  // Arrange pagination results
  const hasNextPage = nodes.length > limit;
  const hasPreviousPage = !!cursorId;

  // We included an extra item in the result set to determine if there is a next page or previous page
  // We need to remove the first or last item from the result set since we included an extra item

  if (hasNextPage && pagination.direction === PAGINATION_DIRECTION.FORWARD) {
    nodes.pop(); // Remove the last item
  }

  if (
    hasPreviousPage &&
    pagination.direction === PAGINATION_DIRECTION.BACKWARD
  ) {
    nodes.shift(); // Remove the first item
  }

  // Arrange start and end cursors
  const startCursor = nodes[0]?.id ?? null;
  const endCursor = nodes[nodes.length - 1]?.id ?? null;

  return {
    nodes: nodes.map((node) => ({
      user: mapUserEntity(node.user) as UserEntity,
      workspaceMember: mapWorkspaceMemberEntity(node) as WorkspaceMemberEntity,
    })),
    totalCount: totalCount,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
    startCursor: startCursor,
    endCursor: endCursor,
  };
};

export const updateWorkspace = async (
  workspaceId: string,
  name?: string,
  url?: Nullable<string>
): Promise<WorkspaceEntity> => {
  return mapWorkspaceEntity(
    await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name: name,
        url: url,
        updatedAt: new Date(),
      },
    })
  ) as WorkspaceEntity;
};

export const findWorkspaceById = async (
  id: string
): Promise<Nullable<WorkspaceEntity>> => {
  return mapWorkspaceEntity(
    await prisma.workspace.findUnique({
      where: {
        id: id,
      },
    })
  ) as Nullable<WorkspaceEntity>;
};

export const findWorkspaceInviteByHash = async (
  codeHash: string
): Promise<Nullable<WorkspaceInviteEntity>> => {
  return mapWorkspaceInviteEntity(
    await prisma.workspaceInvite.findUnique({
      where: {
        codeHash: codeHash,
      },
    })
  ) as Nullable<WorkspaceInviteEntity>;
};

export const findWorkspaceInviteById = async (
  inviteId: string
): Promise<Nullable<WorkspaceInviteEntity>> => {
  return mapWorkspaceInviteEntity(
    await prisma.workspaceInvite.findUnique({
      where: {
        id: inviteId,
      },
    })
  ) as Nullable<WorkspaceInviteEntity>;
};

export const findEffectiveWorkspaceEmailInviteById = async (
  inviteId: string
): Promise<Nullable<WorkspaceInviteEntity>> => {
  const workspaceInviteEntity = await findWorkspaceInviteById(inviteId);

  if (!workspaceInviteEntity) {
    return null;
  }

  if (!workspaceInviteEntity.isEmailInvite()) {
    return null;
  }

  if (!workspaceInviteEntity.isEffective()) {
    return null;
  }

  return workspaceInviteEntity;
};

export const findEffectiveWorkspaceEmailInviteByHash = async (
  codeHash: string
): Promise<Nullable<WorkspaceInviteEntity>> => {
  const workspaceInviteEntity = await findWorkspaceInviteByHash(codeHash);

  if (!workspaceInviteEntity) {
    return null;
  }

  if (!workspaceInviteEntity.isEmailInvite()) {
    return null;
  }

  if (!workspaceInviteEntity.isEffective()) {
    return null;
  }

  return workspaceInviteEntity;
};

export const cursorPaginateWorkspaceInvites = async (
  pagination: CursorPaginationInputDto,
  sort?: WorkspaceInviteSortInputDto[],
  filter?: {
    workspaceId?: string;
    targetType?: WORKSPACE_INVITE_TARGET_TYPE;
    expired?: boolean;
    declined?: boolean;
    accepted?: boolean;
  }
): Promise<CursorPaginationOutputDto<WorkspaceInviteEntity>> => {
  // Arrange filter args
  const filterArgs: Prisma.WorkspaceInviteWhereInput = {
    workspaceId: filter?.workspaceId,
    targetType: filter?.targetType,
  };

  if (filter?.expired !== undefined) {
    const currentDate = new Date();

    filterArgs.expireAt = filter.expired
      ? { lte: currentDate }
      : { gt: currentDate };
  }

  if (filter?.declined !== undefined) {
    filterArgs.declinedAt = filter.declined
      ? {
          not: null,
        }
      : null;
  }

  if (filter?.accepted !== undefined) {
    filterArgs.acceptedAt = filter.accepted
      ? {
          not: null,
        }
      : null;
  }

  // Arrange sort args
  const sortArgs: Prisma.WorkspaceInviteOrderByWithRelationInput[] = [
    ...(sort?.map((sortOption) =>
      transformOrThrowWorkspaceInviteSortDtoToPrismaSort(sortOption)
    ) ?? []),
    // Default sort by ID in ascending order
    {
      id: 'asc',
    },
  ];

  // Arrange pagination args
  const cursorId = pagination.cursor ?? undefined;
  const skip = cursorId ? 1 : 0;
  const limit = pagination.limit ?? 0;
  const limitMultiplier =
    pagination.direction === PAGINATION_DIRECTION.FORWARD ? 1 : -1;
  const take = Math.abs(limit + 1) * limitMultiplier;

  const paginationArgs: Prisma.WorkspaceInviteFindManyArgs = {
    skip: skip,
    take: take,
    cursor: cursorId ? { id: cursorId } : undefined,
  };

  // Combine query args
  const queryArgs: Prisma.WorkspaceInviteFindManyArgs = {
    ...paginationArgs,
    orderBy: sortArgs,
    where: filterArgs,
  };

  // Execute the query
  const [nodes, totalCount] = await prisma.$transaction([
    prisma.workspaceInvite.findMany(queryArgs),
    prisma.workspaceInvite.count({ where: filterArgs }),
  ]);

  // Arrange pagination results
  const hasNextPage = nodes.length > limit;
  const hasPreviousPage = !!cursorId;

  // We included an extra item in the result set to determine if there is a next page or previous page
  // We need to remove the first or last item from the result set since we included an extra item

  if (hasNextPage && pagination.direction === PAGINATION_DIRECTION.FORWARD) {
    nodes.pop(); // Remove the last item
  }

  if (
    hasPreviousPage &&
    pagination.direction === PAGINATION_DIRECTION.BACKWARD
  ) {
    nodes.shift(); // Remove the first item
  }

  // Arrange start and end cursors
  const startCursor = nodes[0]?.id ?? null;
  const endCursor = nodes[nodes.length - 1]?.id ?? null;

  return {
    nodes: mapWorkspaceInviteEntity(nodes) as WorkspaceInviteEntity[],
    totalCount: totalCount,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
    startCursor: startCursor,
    endCursor: endCursor,
  };
};

export const cursorPaginateWorkspaceEmailInvites = async (
  pagination: CursorPaginationInputDto,
  sort?: WorkspaceInviteSortInputDto[],
  filter?: {
    workspaceId?: string;
    expired?: boolean;
    declined?: boolean;
    accepted?: boolean;
  }
): Promise<CursorPaginationOutputDto<WorkspaceInviteEntity>> => {
  return cursorPaginateWorkspaceInvites(pagination, sort, {
    ...filter,
    targetType: WORKSPACE_INVITE_TARGET_TYPE.EMAIL,
  });
};

export const createWorkspaceInvite = async (
  workspaceId: string,
  targetId: string,
  targetType: WORKSPACE_INVITE_TARGET_TYPE,
  codeHash: string,
  expireAt: Date
) => {
  const currentDate = new Date();

  return mapWorkspaceInviteEntity(
    await prisma.workspaceInvite.create({
      data: {
        workspaceId: workspaceId,
        targetId: targetId,
        targetType: targetType,
        codeHash: codeHash,
        expireAt: expireAt,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as WorkspaceInviteEntity;
};

export const createWorkspaceEmailInvite = async (
  workspaceId: string,
  email: string,
  codeHash: string,
  expireAt: Date
): Promise<WorkspaceInviteEntity> => {
  return createWorkspaceInvite(
    workspaceId,
    email,
    WORKSPACE_INVITE_TARGET_TYPE.EMAIL,
    codeHash,
    expireAt
  );
};

export const expireWorkspaceInvite = async (
  inviteId: string
): Promise<WorkspaceInviteEntity> => {
  const currentDate = new Date();

  return mapWorkspaceInviteEntity(
    await prisma.workspaceInvite.update({
      where: {
        id: inviteId,
      },
      data: {
        expireAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as WorkspaceInviteEntity;
};

export const acceptWorkspaceInvite = async (
  inviteId: string
): Promise<WorkspaceInviteEntity> => {
  const currentDate = new Date();

  return mapWorkspaceInviteEntity(
    await prisma.workspaceInvite.update({
      where: {
        id: inviteId,
      },
      data: {
        acceptedAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as WorkspaceInviteEntity;
};

export const declineWorkspaceInvite = async (
  inviteId: string
): Promise<WorkspaceInviteEntity> => {
  const currentDate = new Date();

  return mapWorkspaceInviteEntity(
    await prisma.workspaceInvite.update({
      where: {
        id: inviteId,
      },
      data: {
        declinedAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as WorkspaceInviteEntity;
};
