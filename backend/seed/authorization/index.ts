import { plantPermissionSeeds } from './permission.seed';
import { plantRolePermissionSeeds } from './role-permission.seed';
import { plantRoleSeeds } from './role.seed';

export const plantAuthorizationSeeds = async () => {
  // Step 1: Permission seeds
  await plantPermissionSeeds();

  // Step 2: Plant role seeds
  await plantRoleSeeds();

  // Step 3: Plant role permission seeds
  await plantRolePermissionSeeds();
};
