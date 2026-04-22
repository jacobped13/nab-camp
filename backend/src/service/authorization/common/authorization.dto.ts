import {
  AUTHORIZATION_RESOURCE_TYPE,
  AUTHORIZATION_STAKEHOLDER_TYPE,
  PERMISSION,
  ROLE,
  WORKSPACE_PERMISSION,
} from './authorization.constant';

export type PermissionDto = {
  [key in PERMISSION]: boolean;
};

export type WorkspacePermissionDto = {
  [key in WORKSPACE_PERMISSION]: boolean;
};

export type StakeholderDto = {
  stakeholderId: string;
  stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE;
};

export type ResourceDto = {
  resourceId: string;
  resourceType: AUTHORIZATION_RESOURCE_TYPE;
};

export type StakeholderRoleDto = {
  stakeholderId: string;
  stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE;
  roles: ROLE[];
};

export type ResourceStakeholderDto = {
  resourceId: string;
  resourceType: AUTHORIZATION_RESOURCE_TYPE;
  stakeholderId: string;
  stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE;
};

export type ResourceStakeholderRoleDto = {
  resourceId: string;
  resourceType: AUTHORIZATION_RESOURCE_TYPE;
  stakeholderId: string;
  stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE;
  role: ROLE;
};
