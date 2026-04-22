import { DataMapper, Nullable } from '@common';
import { Permission, ResourceStakeholderRole, Role } from '@prisma/client';
import {
  AUTHORIZATION_RESOURCE_TYPE,
  AUTHORIZATION_STAKEHOLDER_TYPE,
  PERMISSION,
  ROLE,
} from '../../common/authorization.constant';
import {
  PermissionEntity,
  ResourceStakeholderRoleEntity,
  RoleEntity,
} from './authorization.data.model';

// -----------------------------------------------------------------
// Permission Entity Mapper
// -----------------------------------------------------------------

class PermissionEntityMapper extends DataMapper<Permission, PermissionEntity> {
  override mapInputObject(source: Permission): PermissionEntity {
    return new PermissionEntity(
      source.id,
      source.name as PERMISSION,
      source.description,
      source.createdAt,
      source.updatedAt
    );
  }
}
const permissionEntityMapper = new PermissionEntityMapper();

/**
 * Maps an ORM permission record to a normalized {@link PermissionEntity}.
 */
export const mapPermissionEntity = (
  permission: Nullable<Permission> | Permission[]
) => {
  return permissionEntityMapper.map(permission);
};

// -----------------------------------------------------------------
// Role Entity Mapper
// -----------------------------------------------------------------

export class RoleEntityMapper extends DataMapper<Role, RoleEntity> {
  override mapInputObject(source: Role): RoleEntity {
    return new RoleEntity(
      source.id,
      source.name as ROLE,
      source.description,
      source.createdAt,
      source.updatedAt
    );
  }
}

const roleEntityMapper = new RoleEntityMapper();

/**
 * Maps an ORM role record to a normalized {@link RoleEntity}.
 */
export const mapRoleEntity = (role: Nullable<Role> | Role[]) => {
  return roleEntityMapper.map(role);
};

// -----------------------------------------------------------------
// Resource Stakeholder Role Entity Mapper
// -----------------------------------------------------------------

export class ResourceStakeholderRoleEntityMapper extends DataMapper<
  ResourceStakeholderRole,
  ResourceStakeholderRoleEntity
> {
  override mapInputObject(
    source: ResourceStakeholderRole
  ): ResourceStakeholderRoleEntity {
    return new ResourceStakeholderRoleEntity(
      source.id,
      source.stakeholderId,
      source.stakeholderType as AUTHORIZATION_STAKEHOLDER_TYPE,
      source.resourceId,
      source.resourceType as AUTHORIZATION_RESOURCE_TYPE,
      source.roleName as ROLE,
      source.createdAt,
      source.updatedAt
    );
  }
}

const resourceStakeholderRoleEntityMapper =
  new ResourceStakeholderRoleEntityMapper();

/**
 * Maps an ORM resource stakeholder role record to a normalized {@link ResourceStakeholderRoleEntity}.
 */
export const mapResourceStakeholderRoleEntity = (
  resourceStakeholderRole:
    | Nullable<ResourceStakeholderRole>
    | ResourceStakeholderRole[]
) => {
  return resourceStakeholderRoleEntityMapper.map(resourceStakeholderRole);
};
