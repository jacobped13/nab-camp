import {
  ACTOR_TYPE,
  BusinessErrorResult,
  BusinessResult,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  RESULT_ERROR_CODE,
} from '@common';
import {
  AssignStakeholderRolesToResourcesErrorDto,
  AssignStakeholderRolesToResourcesInputDto,
  AssignStakeholderRolesToResourcesInputDtoSchema,
  AssignUniqueStakeholderRoleToResourceErrorDto,
  AssignUniqueStakeholderRoleToResourceInputDto,
  AssignUniqueStakeholderRoleToResourceInputDtoSchema,
  FindActorResourcePermissionsErrorDto,
  FindActorResourcePermissionsInputDto,
  FindActorResourcePermissionsInputDtoSchema,
  FindActorResourcePermissionsOutputDto,
  FindAllActorStakeholdersErrorDto,
  FindAllActorStakeholdersOutputDto,
  FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeErrorDto,
  FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDto,
  FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDtoSchema,
  FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeOutputDto,
  FindAllStakeholderRolesByResourceStakeholdersErrorDto,
  FindAllStakeholderRolesByResourceStakeholdersInputDto,
  FindAllStakeholderRolesByResourceStakeholdersInputDtoSchema,
  FindAllStakeholderRolesByStakeholderAndResourceErrorDto,
  FindAllStakeholderRolesByStakeholderAndResourceInputDto,
  FindAllStakeholderRolesByStakeholderAndResourceInputDtoSchema,
  FindAllStakeholderRolesByStakeholderAndResourceOutputDto,
  FindAllStakeholderRolesByStakeholdersAndResourceErrorDto,
  FindAllStakeholderRolesByStakeholdersAndResourceInputDto,
  FindAllStakeholderRolesByStakeholdersAndResourceInputDtoSchema,
  FindAllStakeholderRolesByStakeholdersAndResourceOutputDto,
  FindAllStakeholdersByResourceRoleAndStakeholderTypeErrorDto,
  FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDto,
  FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDtoSchema,
  FindAllStakeholdersByResourceRoleAndStakeholderTypeOutputDto,
  RevokeAllStakeholderRolesFromResourceErrorDto,
  RevokeAllStakeholderRolesFromResourceInputDto,
  RevokeAllStakeholderRolesFromResourceInputDtoSchema,
  ValidateResourceAccessErrorDto,
  ValidateResourceAccessInputDto,
  ValidateResourceAccessInputDtoSchema,
} from './helper/authorization.business.dto';
import {
  PermissionDto,
  ResourceStakeholderDto,
  StakeholderDto,
} from '../common/authorization.dto';
import { ResourceStakeholderRoleEntity } from '../data/helper/authorization.data.model';
import {
  AUTHORIZATION_STAKEHOLDER_TYPE,
  PERMISSION,
  ROLE,
} from '../common/authorization.constant';
import * as authorizationDataService from '../data/authorization.data.service';
import { DEFAULT_PERMISSIONS } from './helper/authorization.business.constant';

const LOG_PREFIX = 'Service :: Authorization :: AuthorizationBusinessService';

/**
 * Assigns roles to stakeholders for specific resources.
 * - If a stakeholder already has a role for a resource, it will be returned.
 * - If a stakeholder does not have a role for a resource, a new role will be created.
 *
 * @returns A promise that resolves to the found or created resource stakeholder role entities.
 */
export const assignStakeholderRolesToResources = async (
  executionContext: ExecutionContext,
  input: AssignStakeholderRolesToResourcesInputDto
): Promise<
  BusinessResult<
    ResourceStakeholderRoleEntity[],
    AssignStakeholderRolesToResourcesErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AssignStakeholderRolesToResourcesInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;

    // Step 2: Find or create the resource stakeholder roles
    const resourceStakeholderRoleEntities =
      await authorizationDataService.findOrCreateResourceStakeholderRoles(
        parsedInputData.resourceStakeholderRoles.map(
          (resourceStakeholderRole) => {
            return {
              stakeholderId: resourceStakeholderRole.stakeholderId,
              stakeholderType: resourceStakeholderRole.stakeholderType,
              resourceId: resourceStakeholderRole.resourceId,
              resourceType: resourceStakeholderRole.resourceType,
              role: resourceStakeholderRole.role,
            };
          }
        )
      );

    return BusinessResult.ok(resourceStakeholderRoleEntities);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: assignStakeholderRolesToResources :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Assigns a unique role to a stakeholder for a specific resource.
 * - If the stakeholder already has a unique role for the resource, it will be replaced.
 * - If the stakeholder does not have a unique role for the resource, a new role will.
 *
 * @returns The created or updated resource stakeholder role entity.
 */
export const assignUniqueStakeholderRoleToResource = async (
  executionContext: ExecutionContext,
  input: AssignUniqueStakeholderRoleToResourceInputDto
): Promise<
  BusinessResult<
    ResourceStakeholderRoleEntity,
    AssignUniqueStakeholderRoleToResourceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AssignUniqueStakeholderRoleToResourceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;

    // Step 2: Create the unique role entry
    // NOTE: The business rule is that a stakeholder can only have one unique role per resource.
    const resourceStakeholderRoleEntity =
      await authorizationDataService.createUniqueResourceStakeholderRole(
        {
          stakeholderId: parsedInputData.stakeholderId,
          stakeholderType: parsedInputData.stakeholderType,
        },
        {
          resourceId: parsedInputData.resourceId,
          resourceType: parsedInputData.resourceType,
        },
        parsedInputData.role
      );

    return BusinessResult.ok(resourceStakeholderRoleEntity);
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: assignUniqueStakeholderRoleToResource :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Revokes all roles for a stakeholder on a specific resource.
 *
 * @returns The list of resource stakeholder role entities that were revoked.
 */
export const revokeAllStakeholderRolesFromResource = async (
  executionContext: ExecutionContext,
  input: RevokeAllStakeholderRolesFromResourceInputDto
): Promise<
  BusinessResult<
    ResourceStakeholderRoleEntity[],
    RevokeAllStakeholderRolesFromResourceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      RevokeAllStakeholderRolesFromResourceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;

    // Step 2: Revoke all roles for the stakeholder on the resource
    const resourceStakeholderRoleEntities =
      await authorizationDataService.deleteAllResourceStakeholderRolesByStakeholderAndResource(
        {
          stakeholderId: parsedInputData.stakeholderId,
          stakeholderType: parsedInputData.stakeholderType,
        },
        {
          resourceId: parsedInputData.resourceId,
          resourceType: parsedInputData.resourceType,
        }
      );

    return BusinessResult.ok(resourceStakeholderRoleEntities);
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: revokeAllStakeholderRolesFromResource :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds all stakeholder roles for a specific stakeholder and resource.
 *
 * @returns The roles associated with the stakeholder for the resource.
 */
export const findAllStakeholderRolesByStakeholderAndResource = async (
  executionContext: ExecutionContext,
  input: FindAllStakeholderRolesByStakeholderAndResourceInputDto
): Promise<
  BusinessResult<
    FindAllStakeholderRolesByStakeholderAndResourceOutputDto,
    FindAllStakeholderRolesByStakeholderAndResourceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllStakeholderRolesByStakeholderAndResourceInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;

    const resourceStakeholderRoleEntities =
      await authorizationDataService.findAllResourceStakeholderRolesByStakeholderAndResource(
        {
          stakeholderId: parsedInputData.stakeholderId,
          stakeholderType: parsedInputData.stakeholderType,
        },
        {
          resourceId: parsedInputData.resourceId,
          resourceType: parsedInputData.resourceType,
        }
      );

    // Step 2: Map the found roles to the output DTO
    const roles: ROLE[] = resourceStakeholderRoleEntities.map(
      (entity) => entity.role
    );

    return BusinessResult.ok({
      stakeholderRole: {
        stakeholderId: parsedInputData.stakeholderId,
        stakeholderType: parsedInputData.stakeholderType,
        roles: roles,
      },
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findAllStakeholderRolesByStakeholderAndResource :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds all stakeholder roles for a given set of stakeholders and a specific resource.
 *
 * @returns The roles associated with each stakeholder for the resource.
 */
export const findAllStakeholderRolesByStakeholdersAndResource = async (
  executionContext: ExecutionContext,
  input: FindAllStakeholderRolesByStakeholdersAndResourceInputDto
): Promise<
  BusinessResult<
    FindAllStakeholderRolesByStakeholdersAndResourceOutputDto,
    FindAllStakeholderRolesByStakeholdersAndResourceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllStakeholderRolesByStakeholdersAndResourceInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;

    const resource = {
      resourceId: parsedInputData.resourceId,
      resourceType: parsedInputData.resourceType,
    };
    const stakeholders: StakeholderDto[] = parsedInputData.stakeholders;

    // Step 2: Find all stakeholder roles by stakeholders and resource
    const resourceStakeholderRoleEntities =
      await authorizationDataService.findAllResourceStakeholderRolesByStakeholdersAndResource(
        stakeholders,
        resource
      );

    // Step 3: Group the entities by stakeholder ID and type for quicker lookup
    const stakeholderRoleMap = resourceStakeholderRoleEntities.reduce(
      (acc, current) => {
        const key = `${current.stakeholderId}:${current.stakeholderType}`;

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(current.role);

        return acc;
      },
      {} as Record<string, ROLE[]>
    );

    // Step 4: Map found roles to the input stakeholders
    const stakeholderRoles: FindAllStakeholderRolesByStakeholdersAndResourceOutputDto['stakeholderRoles'] =
      parsedInputData.stakeholders.map((stakeholder) => {
        // Find the roles for the stakeholder
        const mapKey = `${stakeholder.stakeholderId}:${stakeholder.stakeholderType}`;
        const roles = stakeholderRoleMap[mapKey] ?? [];

        return {
          stakeholderId: stakeholder.stakeholderId,
          stakeholderType: stakeholder.stakeholderType,
          roles: roles,
        };
      });

    return BusinessResult.ok({
      stakeholderRoles: stakeholderRoles,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findAllStakeholderRolesByStakeholdersAndResource :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds all stakeholder roles for a given set of resource stakeholders.
 *
 * @returns The roles associated with each resource stakeholder.
 */
export const findAllStakeholderRolesByResourceStakeholders = async (
  executionContext: ExecutionContext,
  input: FindAllStakeholderRolesByResourceStakeholdersInputDto
): Promise<
  BusinessResult<
    ResourceStakeholderRoleEntity[],
    FindAllStakeholderRolesByResourceStakeholdersErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllStakeholderRolesByResourceStakeholdersInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const resourceStakeholders: ResourceStakeholderDto[] =
      parsedInputData.resourceStakeholders.map((resourceStakeholder) => {
        return {
          resourceId: resourceStakeholder.resourceId,
          resourceType: resourceStakeholder.resourceType,
          stakeholderId: resourceStakeholder.stakeholderId,
          stakeholderType: resourceStakeholder.stakeholderType,
        };
      });

    // Step 2: Find all stakeholder roles by resource stakeholders
    const resourceStakeholderRoleEntities =
      await authorizationDataService.findAllResourceStakeholderRolesByResourceStakeholders(
        resourceStakeholders
      );

    return BusinessResult.ok(resourceStakeholderRoleEntities);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findAllStakeholderRolesByResourceStakeholders :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds all stakeholders for a specific resource, role and stakeholder type.
 *
 * @returns The stakeholders associated with the resource.
 */
export const findAllStakeholdersByResourceRoleAndStakeholderType = async (
  executionContext: ExecutionContext,
  input: FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDto
): Promise<
  BusinessResult<
    FindAllStakeholdersByResourceRoleAndStakeholderTypeOutputDto,
    FindAllStakeholdersByResourceRoleAndStakeholderTypeErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllStakeholdersByResourceRoleAndStakeholderTypeInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const role = parsedInputData.role;
    const resourceId = parsedInputData.resourceId;
    const resourceType = parsedInputData.resourceType;
    const stakeholderType = parsedInputData.stakeholderType;

    // Step 2: Find all stakeholder roles by resource stakeholders
    const resourceStakeholderRoleEntities =
      await authorizationDataService.findAllResourceStakeholderRolesByResourceRoleAndStakeholderType(
        {
          resourceId,
          resourceType,
        },
        stakeholderType,
        role
      );

    const stakeholders: StakeholderDto[] = resourceStakeholderRoleEntities.map(
      (entity) => ({
        stakeholderId: entity.stakeholderId,
        stakeholderType: entity.stakeholderType,
      })
    );

    return BusinessResult.ok({
      stakeholders: stakeholders,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findAllStakeholdersByResourceRoleAndStakeholderType :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds all resource stakeholders for a list of resources, role and stakeholder type.
 *
 * @returns The stakeholders associated with the resource.
 */
export const findAllResourceStakeholdersByResourceRolesAndStakeholderType =
  async (
    executionContext: ExecutionContext,
    input: FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDto
  ): Promise<
    BusinessResult<
      FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeOutputDto,
      FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeErrorDto
    >
  > => {
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Validate input
      const parsedInput =
        FindAllResourceStakeholdersByResourceRolesAndStakeholderTypeInputDtoSchema.safeParse(
          input
        );

      if (!parsedInput.success) {
        return BusinessResult.fail(
          ...BusinessErrorResult.fromZodError(parsedInput.error, {
            input: input,
            context: executionContext,
          })
        );
      }

      const parsedInputData = parsedInput.data;
      const resources = parsedInputData.resources;
      const role = parsedInputData.role;
      const stakeholderType = parsedInputData.stakeholderType;

      // Step 2: Find all stakeholders by resource roles and stakeholder type
      const resourceStakeholderRoleEntities =
        await authorizationDataService.findAllResourceStakeholderRolesByResourceRolesAndStakeholderType(
          resources,
          stakeholderType,
          role
        );

      const resourceStakeholders: ResourceStakeholderDto[] =
        resourceStakeholderRoleEntities.map((entity) => ({
          stakeholderId: entity.stakeholderId,
          stakeholderType: entity.stakeholderType,
          resourceId: entity.resourceId,
          resourceType: entity.resourceType,
        }));

      return BusinessResult.ok({
        resourceStakeholders: resourceStakeholders,
      });
    } catch (error: unknown) {
      logger.error(
        `${LOG_PREFIX} :: findAllResourceStakeholdersByResourceRolesAndStakeholderType :: An unknown error occurred`,
        injectExceptionDetails(error, {
          input: input,
          context: loggingContext,
        })
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed due to an unknown error',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }
  };

/**
 * Finds the stakeholder levels for a given user actor.
 *
 * @returns The stakeholder levels.
 */
export const findUserActorStakeholders = async (
  executionContext: ExecutionContext
): Promise<
  BusinessResult<
    FindAllActorStakeholdersOutputDto,
    FindAllActorStakeholdersErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Ensure the actor is a user
    if (!executionContext.isUserActor()) {
      logger.warn(
        `${LOG_PREFIX} :: validatorUserActorAccess :: Actor is not a user`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor is not a user',
        metadata: {
          context: executionContext,
        },
      });
    }

    // Step 2: Extract the stakeholder levels from the context
    const actor = executionContext.actor;
    const account = executionContext.account;

    const userId = actor.id;
    const workspaceId = account?.workspaceId;
    const workspaceMemberId = account?.workspaceMemberId;

    // Step 3: Build stakeholder levels
    const stakeholders: StakeholderDto[] = [];

    if (userId) {
      stakeholders.push({
        stakeholderId: userId,
        stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.USER,
      });
    }

    if (workspaceId) {
      stakeholders.push({
        stakeholderId: workspaceId,
        stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.WORKSPACE,
      });
    }

    if (workspaceMemberId) {
      stakeholders.push({
        stakeholderId: workspaceMemberId,
        stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.WORKSPACE_MEMBER,
      });
    }

    return BusinessResult.ok({
      stakeholders: stakeholders,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findUserActorStakeholders :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        context: executionContext,
      },
    });
  }
};

/**
 * Finds the stakeholder levels for a given actor.
 *
 * @returns The stakeholder levels.
 */
export const findActorStakeholders = async (
  executionContext: ExecutionContext
): Promise<
  BusinessResult<
    FindAllActorStakeholdersOutputDto,
    FindAllActorStakeholdersErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    switch (executionContext.actor.type) {
      case ACTOR_TYPE.USER: {
        return await findUserActorStakeholders(executionContext);
      }
      // System actors have full access to all resources
      case ACTOR_TYPE.SYSTEM: {
        return BusinessResult.ok({
          stakeholders: [],
        });
      }
      // Anonymous actors do not have access to any resources
      case ACTOR_TYPE.ANONYMOUS: {
        return BusinessResult.ok({
          stakeholders: [],
        });
      }
      default: {
        logger.warn(
          `${LOG_PREFIX} :: findActorStakeholders :: Unsupported actor type`,
          {
            actorType: executionContext.actor.type,
            context: loggingContext,
          }
        );
        return BusinessResult.ok({
          stakeholders: [],
        });
      }
    }
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findActorStakeholders :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        context: executionContext,
      },
    });
  }
};

/**
 * Finds the resource permissions for a given user actor.
 *
 * @returns The resource permissions.
 */
export const findUserActorResourcePermissions = async (
  executionContext: ExecutionContext,
  input: FindActorResourcePermissionsInputDto
): Promise<
  BusinessResult<
    FindActorResourcePermissionsOutputDto,
    FindActorResourcePermissionsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindActorResourcePermissionsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const resourceId = parsedInputData.resourceId;
    const resourceType = parsedInputData.resourceType;

    // Step 2: Ensure the actor is a user
    if (!executionContext.isUserActor()) {
      logger.warn(
        `${LOG_PREFIX} :: findUserActorPermissions :: Actor is not a user`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor is not a user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find the stakeholders for the actor
    const stakeholderResult = await findActorStakeholders(executionContext);

    if (!stakeholderResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findUserActorPermissions :: Failed to find actor stakeholders`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Failed to find actor stakeholders',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const stakeholderResultData = stakeholderResult.data;
    const stakeholders = stakeholderResultData.stakeholders;

    // Step 4: Find all the permissions by the stakeholders
    const permissionSet =
      await authorizationDataService.findAllPermissionsByResourceStakeholders(
        {
          resourceId: resourceId,
          resourceType: resourceType,
        },
        stakeholders
      );

    const permissions: PermissionDto = Object.keys(PERMISSION).reduce(
      (acc, key) => {
        const permission = PERMISSION[key as keyof typeof PERMISSION];

        acc[permission] = permissionSet.has(permission);

        return acc;
      },
      {} as PermissionDto
    );

    return BusinessResult.ok({
      permissions: permissions,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findUserActorPermissions :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds the resource permissions for a given actor.
 *
 * @returns The resource permissions.
 */
export const findActorResourcePermissions = async (
  executionContext: ExecutionContext,
  input: FindActorResourcePermissionsInputDto
): Promise<
  BusinessResult<
    FindActorResourcePermissionsOutputDto,
    FindActorResourcePermissionsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    switch (executionContext.actor.type) {
      case ACTOR_TYPE.USER: {
        return await findUserActorResourcePermissions(executionContext, input);
      }
      case ACTOR_TYPE.SYSTEM: {
        return BusinessResult.ok({
          permissions: DEFAULT_PERMISSIONS,
        });
      }
      case ACTOR_TYPE.ANONYMOUS: {
        return BusinessResult.ok({
          permissions: DEFAULT_PERMISSIONS,
        });
      }
      default: {
        logger.warn(
          `${LOG_PREFIX} :: findActorResourcePermissions :: Unsupported actor type`,
          {
            actorType: executionContext.actor.type,
            context: loggingContext,
          }
        );
        return BusinessResult.ok({
          permissions: DEFAULT_PERMISSIONS,
        });
      }
    }
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findActorResourcePermissions :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Validates the access to a given resource using the actor's details from the execution context.
 *
 * @returns A boolean indicating whether the actor has access to the resource.
 */
export const validatorActorAccess = async (
  executionContext: ExecutionContext,
  input: ValidateResourceAccessInputDto
): Promise<BusinessResult<boolean, ValidateResourceAccessErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate inputs
    const parsedInput = ValidateResourceAccessInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;

    switch (executionContext.actor.type) {
      case ACTOR_TYPE.USER: {
        return await validatorUserActorAccess(executionContext, {
          resourceId: parsedInputData.resourceId,
          resourceType: parsedInputData.resourceType,
          permission: parsedInputData.permission,
        });
      }
      // System actors have full access to all resources
      case ACTOR_TYPE.SYSTEM: {
        return BusinessResult.ok(true);
      }
      // Anonymous actors do not have access to any resources
      case ACTOR_TYPE.ANONYMOUS: {
        return BusinessResult.ok(false);
      }
      default: {
        logger.warn(
          `${LOG_PREFIX} :: validatorActorAccess :: Unsupported actor type`,
          {
            actorType: executionContext.actor.type,
            context: loggingContext,
          }
        );
        return BusinessResult.ok(false);
      }
    }
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: validatorActorAccess :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Validates the access to a given resource for a user actor using the actor's details from the execution context.
 *
 * @returns A boolean indicating whether the user actor has access to the resource.
 */
export const validatorUserActorAccess = async (
  executionContext: ExecutionContext,
  input: ValidateResourceAccessInputDto
): Promise<BusinessResult<boolean, ValidateResourceAccessErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = ValidateResourceAccessInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const resourceId = parsedInputData.resourceId;
    const resourceType = parsedInputData.resourceType;
    const permission = parsedInputData.permission;

    // Step 2: Ensure the actor is a user
    if (!executionContext.isUserActor()) {
      logger.warn(
        `${LOG_PREFIX} :: validatorUserActorAccess :: Actor is not a user`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor is not a user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Extract the stakeholder levels from the context
    const stakeholderResult = await findActorStakeholders(executionContext);

    if (!stakeholderResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findUserActorPermissions :: Failed to find actor stakeholders`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Failed to find actor stakeholders',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const stakeholderResultData = stakeholderResult.data;
    const stakeholders = stakeholderResultData.stakeholders;

    // Step 5: Validate that the permission exists for atleast one stakeholder level
    const hasPermission =
      await authorizationDataService.validatePermissionByResourceStakeholders(
        stakeholders,
        {
          resourceId: resourceId,
          resourceType: resourceType,
        },
        permission
      );

    return BusinessResult.ok(hasPermission);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: validatorUserActorAccess :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};
