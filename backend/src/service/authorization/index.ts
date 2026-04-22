// -----------------------------------------------------------------
// Common
// -----------------------------------------------------------------

export {
  ANY_RESOURCE_ID,
  AUTHORIZATION_STAKEHOLDER_TYPE,
  AUTHORIZATION_RESOURCE_TYPE,
  PERMISSION,
  ROLE,
} from './common/authorization.constant';
export type {
  PermissionDto,
  ResourceDto,
  ResourceStakeholderDto,
  ResourceStakeholderRoleDto,
  StakeholderDto,
  StakeholderRoleDto,
  WorkspacePermissionDto,
} from './common/authorization.dto';
export { toWorkspacePermissionDto } from './common/authorization.util';

// -----------------------------------------------------------------
// Business Service
// -----------------------------------------------------------------

export * as authorizationBusinessService from './business/authorization.business.service';
export {
  DEFAULT_PERMISSIONS,
  DEFAULT_WORKSPACE_PERMISSIONS,
} from './business/helper/authorization.business.constant';
