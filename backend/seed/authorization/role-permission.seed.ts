import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { PERMISSION, ROLE } from '@service/authorization';

const LOG_PREFIX = 'Seed :: Authorization :: RolePermission';

const generateRolePermissionSeeds =
  (): Prisma.RolePermissionCreateArgs['data'][] => {
    const currentDate = new Date();

    return [
      // -----------------------------------------------------------------
      // User Owner Role
      // -----------------------------------------------------------------
      {
        roleName: ROLE.USER_EDITOR,
        permissionName: PERMISSION.USER_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.USER_EDITOR,
        permissionName: PERMISSION.USER_EDIT,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.USER_EDITOR,
        permissionName: PERMISSION.USER_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      // -----------------------------------------------------------------
      // Workspace Owner Role
      // -----------------------------------------------------------------
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_EDIT,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_BILLING_MANAGE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_INVOICE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_MEMBER_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_MEMBER_ROLE_CHANGE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_MEMBER_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_EMAIL_INVITE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_EMAIL_INVITE_CREATE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_OWNER,
        permissionName: PERMISSION.WORKSPACE_EMAIL_INVITE_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      // -----------------------------------------------------------------
      // Workspace Admin Role
      // -----------------------------------------------------------------
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_EDIT,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_BILLING_MANAGE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_INVOICE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_MEMBER_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_MEMBER_ROLE_CHANGE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_MEMBER_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_EMAIL_INVITE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_EMAIL_INVITE_CREATE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_ADMIN,
        permissionName: PERMISSION.WORKSPACE_EMAIL_INVITE_DELETE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      // -----------------------------------------------------------------
      // Workspace Member Role
      // -----------------------------------------------------------------
      {
        roleName: ROLE.WORKSPACE_MEMBER,
        permissionName: PERMISSION.WORKSPACE_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        roleName: ROLE.WORKSPACE_MEMBER,
        permissionName: PERMISSION.WORKSPACE_MEMBER_VIEW,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      // -----------------------------------------------------------------
      // Workspace Creator Role
      // -----------------------------------------------------------------
      {
        roleName: ROLE.WORKSPACE_CREATOR,
        permissionName: PERMISSION.WORKSPACE_CREATE,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ];
  };

export const plantRolePermissionSeeds = async () => {
  try {
    await prisma.$transaction(async (tx) => {
      const seeds = generateRolePermissionSeeds();

      await Promise.all(
        seeds.map((seed) => {
          return tx.rolePermission.upsert({
            where: {
              roleName_permissionName: {
                roleName: seed.roleName!,
                permissionName: seed.permissionName!,
              },
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
      `${LOG_PREFIX} :: plantPermissionRoleSeeds :: An unknown error occurred`,
      error
    );
  }
};
