import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { PERMISSION } from '@service/authorization';

const LOG_PREFIX = 'Seed :: Authorization :: Permission';

const generatePermissionSeeds = (): Prisma.PermissionCreateArgs['data'][] => {
  const currentDate = new Date();

  return [
    // -----------------------------------------------------------------
    // User Permissions
    // -----------------------------------------------------------------
    {
      name: PERMISSION.USER_VIEW,
      description: 'Enables the ability to view a user',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.USER_EDIT,
      description: 'Enables the ability to edit a user',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.USER_DELETE,
      description: 'Enables the ability to delete a user',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    // -----------------------------------------------------------------
    // Workspace Permissions
    // -----------------------------------------------------------------
    {
      name: PERMISSION.WORKSPACE_VIEW,
      description: 'Enables the ability to view a workspace',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_EDIT,
      description: 'Enables the ability to edit a workspace',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_DELETE,
      description: 'Enables the ability to delete a workspace',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_CREATE,
      description: 'Enables the ability to view workspace members',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_BILLING_MANAGE,
      description: 'Enables the ability to manage workspace billing',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_INVOICE_VIEW,
      description: 'Enables the ability to view workspace invoices',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_MEMBER_VIEW,
      description: 'Enables the ability to view workspace members',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_MEMBER_ROLE_CHANGE,
      description: 'Enables the ability to change workspace member roles',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_MEMBER_DELETE,
      description: 'Enables the ability to delete workspace members',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_EMAIL_INVITE_VIEW,
      description: 'Enables the ability to view workspace email invites',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_EMAIL_INVITE_CREATE,
      description: 'Enables the ability to create workspace email invites',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
    {
      name: PERMISSION.WORKSPACE_EMAIL_INVITE_DELETE,
      description: 'Enables the ability to delete workspace email invites',
      createdAt: currentDate,
      updatedAt: currentDate,
    },
  ];
};

export const plantPermissionSeeds = async () => {
  try {
    await prisma.$transaction(async (tx) => {
      const seeds = generatePermissionSeeds();

      await Promise.all(
        seeds.map((seed) => {
          return tx.permission.upsert({
            where: {
              name: seed.name,
            },
            // Leaving the `update` empty to avoid updating existing records
            update: {},
            create: seed,
          });
        })
      );
    });
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantPermissionSeeds :: An unknown error occurred`,
      error
    );
  }
};
