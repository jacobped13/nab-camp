import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { ROLE } from '@service/authorization';

const LOG_PREFIX = 'Seed :: Authorization :: Role';

const generateRoleSeeds = (): Prisma.RoleCreateArgs['data'][] => {
  const currentDate = new Date();

  return [
    // -----------------------------------------------------------------
    // User Roles
    // -----------------------------------------------------------------
    {
      name: ROLE.USER_EDITOR,
      description: 'User Editor',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    // -----------------------------------------------------------------
    // Workspace Roles
    // -----------------------------------------------------------------
    {
      name: ROLE.WORKSPACE_ADMIN,
      description: 'Workspace Administrator',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: ROLE.WORKSPACE_MEMBER,
      description: 'Workspace Member',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: ROLE.WORKSPACE_OWNER,
      description: 'Workspace Owner',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: ROLE.WORKSPACE_CREATOR,
      description: 'Workspace Creator',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];
};

export const plantRoleSeeds = async () => {
  try {
    await prisma.$transaction(async (tx) => {
      const roleSeeds = generateRoleSeeds();

      await Promise.all(
        roleSeeds.map((role) => {
          return tx.role.upsert({
            where: {
              name: role.name,
            },
            // Leaving the `update` empty to avoid updating existing records
            update: {},
            create: role,
          });
        })
      );
    });
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantRoleSeeds :: An unknown error occurred`,
      error
    );
  }
};
