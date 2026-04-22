import { PERMISSION } from '@api-contracts/permissions';
import {
  PermissionDto,
  WorkspacePermissionDto,
} from '../../common/authorization.dto';
import { toWorkspacePermissionDto } from '@service/authorization/common/authorization.util';

/**
 * Represents the default permissions for an actor.
 * This includes all permissions set to false by default.
 */
export const DEFAULT_PERMISSIONS: PermissionDto = Object.keys(
  PERMISSION
).reduce((acc, key) => {
  acc[key as keyof PermissionDto] = false;
  return acc;
}, {} as PermissionDto);

/**
 * Represents the default workspace permissions for an actor.
 * This includes all permissions set to false by default.
 */
export const DEFAULT_WORKSPACE_PERMISSIONS: WorkspacePermissionDto =
  toWorkspacePermissionDto(DEFAULT_PERMISSIONS);
