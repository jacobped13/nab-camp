import { PERMISSION, ROLE } from '../../common/authorization.constant';
import {
  AUTHORIZATION_STAKEHOLDER_TYPE,
  AUTHORIZATION_RESOURCE_TYPE,
} from '../../common/authorization.constant';

/**
 * Represents a permission entity in the system.
 */
export class PermissionEntity {
  constructor(
    public readonly id: string,
    public readonly name: PERMISSION,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a role entity in the system.
 */
export class RoleEntity {
  constructor(
    public readonly id: string,
    public readonly name: ROLE,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a permission entity in the system.
 */
export class ResourceStakeholderRoleEntity {
  constructor(
    public readonly id: string,
    public readonly stakeholderId: string,
    public readonly stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE,
    public readonly resourceId: string,
    public readonly resourceType: AUTHORIZATION_RESOURCE_TYPE,
    public readonly role: ROLE,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
