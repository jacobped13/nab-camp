import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { ResourceStakeholderRole } from '@prisma/client';
import {
  ANY_RESOURCE_ID,
  AUTHORIZATION_STAKEHOLDER_TYPE,
  PERMISSION,
  ROLE,
} from '../common/authorization.constant';
import {
  ResourceDto,
  ResourceStakeholderDto,
  ResourceStakeholderRoleDto,
  StakeholderDto,
} from '../common/authorization.dto';
import { ResourceStakeholderRoleEntity } from './helper/authorization.data.model';
import { mapResourceStakeholderRoleEntity } from './helper/authorization.data.util';

export const findOrCreateResourceStakeholderRoles = async (
  resourceStakeholderRoles: ResourceStakeholderRoleDto[]
): Promise<ResourceStakeholderRoleEntity[]> => {
  const currentDate = new Date();

  return mapResourceStakeholderRoleEntity(
    await prisma.$transaction(async (tx) => {
      return await Promise.all(
        resourceStakeholderRoles.map(async (resourceStakeholderRole) => {
          return await tx.resourceStakeholderRole.upsert({
            where: {
              stakeholderId_stakeholderType_resourceId_resourceType_roleName: {
                stakeholderId: resourceStakeholderRole.stakeholderId,
                stakeholderType: resourceStakeholderRole.stakeholderType,
                resourceId: resourceStakeholderRole.resourceId,
                resourceType: resourceStakeholderRole.resourceType,
                roleName: resourceStakeholderRole.role,
              },
            },
            update: {},
            create: {
              stakeholderId: resourceStakeholderRole.stakeholderId,
              stakeholderType: resourceStakeholderRole.stakeholderType,
              resourceId: resourceStakeholderRole.resourceId,
              resourceType: resourceStakeholderRole.resourceType,
              roleName: resourceStakeholderRole.role,
              createdAt: currentDate,
              updatedAt: currentDate,
            },
          });
        })
      );
    })
  ) as ResourceStakeholderRoleEntity[];
};

export const createUniqueResourceStakeholderRole = async (
  stakeholder: StakeholderDto,
  resource: ResourceDto,
  role: ROLE
): Promise<ResourceStakeholderRoleEntity> => {
  return mapResourceStakeholderRoleEntity(
    await prisma.$transaction(async (tx) => {
      const resourceId = resource.resourceId;
      const resourceType = resource.resourceType;
      const stakeholderId = stakeholder.stakeholderId;
      const stakeholderType = stakeholder.stakeholderType;

      // Step 1: Find all roles to be deleted
      const rolesToDelete = await tx.resourceStakeholderRole.findMany({
        where: {
          stakeholderId: stakeholderId,
          stakeholderType: stakeholderType,
          resourceId: resourceId,
          resourceType: resourceType,
        },
      });

      const targetRoleIds = rolesToDelete.map((role) => role.id);

      // Step 2: Delete the roles
      if (targetRoleIds.length) {
        await tx.resourceStakeholderRole.deleteMany({
          where: {
            id: {
              in: targetRoleIds,
            },
          },
        });
      }

      // Step 3: Create new role
      const currentDate = new Date();

      const newRole = await tx.resourceStakeholderRole.create({
        data: {
          stakeholderId: stakeholderId,
          stakeholderType: stakeholderType,
          resourceId: resourceId,
          resourceType: resourceType,
          roleName: role,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });

      return newRole;
    })
  ) as ResourceStakeholderRoleEntity;
};

export const deleteAllResourceStakeholderRolesByStakeholderAndResource = async (
  stakeholder: StakeholderDto,
  resource: ResourceDto
): Promise<ResourceStakeholderRoleEntity[]> => {
  return mapResourceStakeholderRoleEntity(
    await prisma.$transaction(async (tx) => {
      // Step 1: Find all roles to be deleted
      const rolesToDelete = await tx.resourceStakeholderRole.findMany({
        where: {
          stakeholderId: stakeholder.stakeholderId,
          stakeholderType: stakeholder.stakeholderType,
          resourceId: resource.resourceId,
          resourceType: resource.resourceType,
        },
      });

      const targetRoleIds = rolesToDelete.map((role) => role.id);

      // Step 2: Delete the roles
      if (targetRoleIds.length) {
        await tx.resourceStakeholderRole.deleteMany({
          where: {
            id: {
              in: rolesToDelete.map((role) => role.id),
            },
          },
        });
      }

      return rolesToDelete;
    })
  ) as ResourceStakeholderRoleEntity[];
};

export const findAllResourceStakeholderRolesByStakeholderAndResource = async (
  stakeholder: StakeholderDto,
  resource: ResourceDto
): Promise<ResourceStakeholderRoleEntity[]> => {
  return mapResourceStakeholderRoleEntity(
    await prisma.resourceStakeholderRole.findMany({
      where: {
        resourceId: resource.resourceId,
        resourceType: resource.resourceType,
        stakeholderId: stakeholder.stakeholderId,
        stakeholderType: stakeholder.stakeholderType,
      },
    })
  ) as ResourceStakeholderRoleEntity[];
};

export const findAllResourceStakeholderRolesByStakeholdersAndResource = async (
  stakeholders: StakeholderDto[],
  resource: ResourceDto
): Promise<ResourceStakeholderRoleEntity[]> => {
  return mapResourceStakeholderRoleEntity(
    await prisma.resourceStakeholderRole.findMany({
      where: {
        resourceId: resource.resourceId,
        resourceType: resource.resourceType,
        OR: stakeholders.map((stakeholder) => ({
          stakeholderId: stakeholder.stakeholderId,
          stakeholderType: stakeholder.stakeholderType,
        })),
      },
    })
  ) as ResourceStakeholderRoleEntity[];
};

export const findAllResourceStakeholderRolesByResourceStakeholders = async (
  resourceStakeholders: ResourceStakeholderDto[]
): Promise<ResourceStakeholderRoleEntity[]> => {
  return mapResourceStakeholderRoleEntity(
    await prisma.resourceStakeholderRole.findMany({
      where: {
        OR: resourceStakeholders.map((resourceStakeholder) => ({
          resourceId: resourceStakeholder.resourceId,
          resourceType: resourceStakeholder.resourceType,
          stakeholderId: resourceStakeholder.stakeholderId,
          stakeholderType: resourceStakeholder.stakeholderType,
        })),
      },
    })
  ) as ResourceStakeholderRoleEntity[];
};

export const findAllResourceStakeholderRolesByResourceRoleAndStakeholderType =
  async (
    resource: ResourceDto,
    stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE,
    role: ROLE
  ): Promise<ResourceStakeholderRoleEntity[]> => {
    return mapResourceStakeholderRoleEntity(
      await prisma.resourceStakeholderRole.findMany({
        where: {
          resourceId: resource.resourceId,
          resourceType: resource.resourceType,
          stakeholderType: stakeholderType,
          roleName: role,
        },
      })
    ) as ResourceStakeholderRoleEntity[];
  };

export const findAllResourceStakeholderRolesByResourceRolesAndStakeholderType =
  async (
    resource: ResourceDto[],
    stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE,
    role: ROLE
  ): Promise<ResourceStakeholderRoleEntity[]> => {
    return mapResourceStakeholderRoleEntity(
      await prisma.resourceStakeholderRole.findMany({
        where: {
          stakeholderType: stakeholderType,
          roleName: role,
          OR: resource.map((res) => ({
            resourceId: res.resourceId,
            resourceType: res.resourceType,
          })),
        },
      })
    ) as ResourceStakeholderRoleEntity[];
  };

export const validatePermissionByResourceStakeholders = async (
  stakeholders: StakeholderDto[],
  resource: ResourceDto,
  permission: PERMISSION
): Promise<boolean> => {
  return await prisma.$transaction(async (tx) => {
    // Step 1: Find all resource stakeholder roles for the given stakeholders
    const resourceStakeholderRoles: Pick<
      ResourceStakeholderRole,
      'roleName'
    >[] = await tx.resourceStakeholderRole.findMany({
      select: {
        roleName: true,
      },
      where: {
        resourceId: {
          in: [ANY_RESOURCE_ID, resource.resourceId],
        },
        resourceType: resource.resourceType,
        OR: stakeholders.map((stakeholder) => ({
          stakeholderId: stakeholder.stakeholderId,
          stakeholderType: stakeholder.stakeholderType,
        })),
      },
    });

    // Step 2: Arrange available roles
    const availableRoles = resourceStakeholderRoles.map(
      (role) => role.roleName
    );

    // Step 3: Find the roles that match the permission name
    const rolePermission = await tx.rolePermission.findFirst({
      where: {
        roleName: {
          in: availableRoles,
        },
        permissionName: permission,
      },
    });

    return !!rolePermission;
  });
};

export const findAllPermissionsByResourceStakeholders = async (
  resource: ResourceDto,
  stakeholders: StakeholderDto[]
): Promise<Set<PERMISSION>> => {
  const resourceStakeholderRoles =
    await prisma.resourceStakeholderRole.findMany({
      where: {
        resourceId: {
          in: [ANY_RESOURCE_ID, resource.resourceId],
        },
        resourceType: resource.resourceType,
        OR: stakeholders.map((stakeholder) => ({
          stakeholderId: stakeholder.stakeholderId,
          stakeholderType: stakeholder.stakeholderType,
        })),
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              select: {
                permissionName: true,
              },
            },
          },
        },
      },
    });

  const permissionSet: Set<PERMISSION> = new Set();

  for (const resourceStakeholderRole of resourceStakeholderRoles) {
    for (const rolePermission of resourceStakeholderRole.role.rolePermissions) {
      permissionSet.add(rolePermission.permissionName as PERMISSION);
    }
  }

  return permissionSet;
};
