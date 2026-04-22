import { z } from 'zod';
import {
  BusinessResultContextErrorDto,
  BusinessResultInputContextErrorDto,
} from '@common';
import {
  AUTHORIZATION_STAKEHOLDER_TYPE,
  AUTHORIZATION_RESOURCE_TYPE,
  PERMISSION,
  ROLE,
} from '../../common/authorization.constant';
import {
  PermissionDto,
  ResourceStakeholderDto,
  StakeholderDto,
  StakeholderRoleDto,
} from '../../common/authorization.dto';

// -----------------------------------------------------------------
// Assign Stakeholder Roles to Resources
// -----------------------------------------------------------------

export const AssignStakeholderRolesToResourcesInputDtoSchema = z.object({
  resourceStakeholderRoles: z.array(
    z.object({
      stakeholderId: z.string(),
      stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
      resourceId: z.string(),
      resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
      role: z.nativeEnum(ROLE),
    })
  ),
});

export type AssignStakeholderRolesToResourcesInputDto = z.infer<
  typeof AssignStakeholderRolesToResourcesInputDtoSchema
>;

export type AssignStakeholderRolesToResourcesErrorDto =
  BusinessResultInputContextErrorDto<AssignStakeholderRolesToResourcesInputDto>;

// -----------------------------------------------------------------
// Assign Unique Stakeholder Role to Resource
// -----------------------------------------------------------------

export const AssignUniqueStakeholderRoleToResourceInputDtoSchema = z.object({
  stakeholderId: z.string(),
  stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
  resourceId: z.string(),
  resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
  role: z.nativeEnum(ROLE),
});

export type AssignUniqueStakeholderRoleToResourceInputDto = z.infer<
  typeof AssignUniqueStakeholderRoleToResourceInputDtoSchema
>;

export type AssignUniqueStakeholderRoleToResourceErrorDto =
  BusinessResultInputContextErrorDto<AssignUniqueStakeholderRoleToResourceInputDto>;

// -----------------------------------------------------------------
// Revoke Stakeholder Role from Resource
// -----------------------------------------------------------------

export const RevokeAllStakeholderRolesFromResourceInputDtoSchema = z.object({
  stakeholderId: z.string(),
  stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
  resourceId: z.string(),
  resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
});

export type RevokeAllStakeholderRolesFromResourceInputDto = z.infer<
  typeof RevokeAllStakeholderRolesFromResourceInputDtoSchema
>;

export type RevokeAllStakeholderRolesFromResourceErrorDto =
  BusinessResultInputContextErrorDto<RevokeAllStakeholderRolesFromResourceInputDto>;

// -----------------------------------------------------------------
// Validate Resource Access
// -----------------------------------------------------------------

export const ValidateResourceAccessInputDtoSchema = z.object({
  resourceId: z.string(),
  resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
  permission: z.nativeEnum(PERMISSION),
});

export type ValidateResourceAccessInputDto = z.infer<
  typeof ValidateResourceAccessInputDtoSchema
>;

export type ValidateResourceAccessErrorDto =
  BusinessResultInputContextErrorDto<ValidateResourceAccessInputDto>;

// -----------------------------------------------------------------
// Find All Stakeholder Roles by Stakeholder And Resource
// -----------------------------------------------------------------

export const FindAllStakeholderRolesByStakeholderAndResourceInputDtoSchema =
  z.object({
    resourceId: z.string(),
    resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
    stakeholderId: z.string(),
    stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
  });

export type FindAllStakeholderRolesByStakeholderAndResourceInputDto = z.infer<
  typeof FindAllStakeholderRolesByStakeholderAndResourceInputDtoSchema
>;

export type FindAllStakeholderRolesByStakeholderAndResourceOutputDto = {
  stakeholderRole: StakeholderRoleDto;
};

export type FindAllStakeholderRolesByStakeholderAndResourceErrorDto =
  BusinessResultInputContextErrorDto<FindAllStakeholderRolesByStakeholderAndResourceInputDto>;

// -----------------------------------------------------------------
// Find All Stakeholder Roles by Stakeholders and Resource
// -----------------------------------------------------------------

export const FindAllStakeholderRolesByStakeholdersAndResourceInputDtoSchema =
  z.object({
    resourceId: z.string(),
    resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
    stakeholders: z.array(
      z.object({
        stakeholderId: z.string(),
        stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
      })
    ),
  });

export type FindAllStakeholderRolesByStakeholdersAndResourceInputDto = z.infer<
  typeof FindAllStakeholderRolesByStakeholdersAndResourceInputDtoSchema
>;

export type FindAllStakeholderRolesByStakeholdersAndResourceOutputDto = {
  stakeholderRoles: StakeholderRoleDto[];
};

export type FindAllStakeholderRolesByStakeholdersAndResourceErrorDto =
  BusinessResultInputContextErrorDto<FindAllStakeholderRolesByStakeholdersAndResourceInputDto>;

// -----------------------------------------------------------------
// Find All Stakeholder Roles by Resource Stakeholders
// -----------------------------------------------------------------

export const FindAllStakeholderRolesByResourceStakeholdersInputDtoSchema =
  z.object({
    resourceStakeholders: z.array(
      z.object({
        resourceId: z.string(),
        resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
        stakeholderId: z.string(),
        stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
      })
    ),
  });

export type FindAllStakeholderRolesByResourceStakeholdersInputDto = z.infer<
  typeof FindAllStakeholderRolesByResourceStakeholdersInputDtoSchema
>;

export type FindAllStakeholderRolesByResourceStakeholdersErrorDto =
  BusinessResultInputContextErrorDto<FindAllStakeholderRolesByResourceStakeholdersInputDto>;

// -----------------------------------------------------------------
// Find All Stakeholders by Resource Role And Stakeholder Type
// -----------------------------------------------------------------

export const FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDtoSchema =
  z.object({
    role: z.nativeEnum(ROLE),
    resourceId: z.string(),
    resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
    stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
  });

export type FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDto =
  z.infer<
    typeof FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDtoSchema
  >;

export type FindAllStakeholdersByResourceRoleAndStakeholderTypeOutputDto = {
  stakeholders: StakeholderDto[];
};

export type FindAllStakeholdersByResourceRoleAndStakeholderTypeErrorDto =
  BusinessResultInputContextErrorDto<FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDto>;

// -----------------------------------------------------------------
// Find All Resource Stakeholders by Resource Roles And Stakeholder Type
// -----------------------------------------------------------------

export const FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDtoSchema =
  z.object({
    resources: z.array(
      z.object({
        resourceId: z.string(),
        resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
      })
    ),
    role: z.nativeEnum(ROLE),
    stakeholderType: z.nativeEnum(AUTHORIZATION_STAKEHOLDER_TYPE),
  });

export type FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDto =
  z.infer<
    typeof FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDtoSchema
  >;

export type FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeOutputDto =
  {
    resourceStakeholders: ResourceStakeholderDto[];
  };

export type FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeErrorDto =
  BusinessResultInputContextErrorDto<FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDto>;

// -----------------------------------------------------------------
// Find All Actor Stakeholders
// -----------------------------------------------------------------

export type FindAllActorStakeholdersOutputDto = {
  stakeholders: StakeholderDto[];
};

export type FindAllActorStakeholdersErrorDto = BusinessResultContextErrorDto;

// -----------------------------------------------------------------
// Find Actor Resource Permissions
// -----------------------------------------------------------------

export const FindActorResourcePermissionsInputDtoSchema = z.object({
  resourceId: z.string(),
  resourceType: z.nativeEnum(AUTHORIZATION_RESOURCE_TYPE),
});

export type FindActorResourcePermissionsInputDto = z.infer<
  typeof FindActorResourcePermissionsInputDtoSchema
>;

export type FindActorResourcePermissionsOutputDto = {
  permissions: PermissionDto;
};

export type FindActorResourcePermissionsErrorDto =
  BusinessResultInputContextErrorDto<FindActorResourcePermissionsInputDto>;
