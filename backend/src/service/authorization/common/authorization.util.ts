import { WORKSPACE_PERMISSION } from './authorization.constant';
import { PermissionDto, WorkspacePermissionDto } from './authorization.dto';

/**
 * Converts a {@link PermissionDto permission DTO} to a {@link WorkspacePermissionDto workspace permission DTO}.
 *
 * @param permissions The permissions to convert.
 * @returns The converted WorkspacePermissionDto.
 */
export const toWorkspacePermissionDto = (
  permissions: PermissionDto
): WorkspacePermissionDto => {
  return Object.entries(permissions).reduce((acc, [key, value]) => {
    if (key in WORKSPACE_PERMISSION) {
      acc[key as keyof WorkspacePermissionDto] = value;
    }
    return acc;
  }, {} as WorkspacePermissionDto);
};
