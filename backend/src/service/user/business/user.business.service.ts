import {
  Nullable,
  RESULT_ERROR_CODE,
  BusinessResult,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  BusinessErrorResult,
} from '@common';
import {
  CreateUserByIdentityProviderErrorDto,
  CreateUserByIdentityProviderInputDto,
  CreateUserByIdentityProviderInputDtoSchema,
  CreateUserByIdentityProviderOutputDto,
  CreateUserIdentityProviderErrorDto,
  CreateUserIdentityProviderInputDto,
  CreateUserIdentityProviderInputDtoSchema,
  FindUserByEmailErrorDto,
  FindUserByEmailInputDto,
  FindUserByEmailInputDtoSchema,
  FindUserByIdentityProviderErrorDto,
  FindUserByIdentityProviderInputDto,
  FindUserByIdentityProviderInputDtoSchema,
  FindUserByIdentityProviderOutputDto,
  FindUserByIdErrorDto,
  FindUserByIdInputDto,
  FindUserByIdInputDtoSchema,
  UpdateUserProfileErrorDto,
  UpdateUserProfileInputDto,
  UpdateUserProfileInputDtoSchema,
} from './helper/user.business.dto';
import { UserEntity } from '../data/helper/user.data.model';
import {
  authenticationBusinessService,
  AUTHENTICATION_STAKEHOLDER_TYPE,
  StakeholderIdentityProviderEntity,
} from '@service/authentication';
import * as userDataService from '../data/user.data.service';
import {
  ANY_RESOURCE_ID,
  authorizationBusinessService,
  PERMISSION,
  AUTHORIZATION_RESOURCE_TYPE,
  ROLE,
  AUTHORIZATION_STAKEHOLDER_TYPE,
} from '@service/authorization';

const LOG_PREFIX = 'Service :: User :: UserBusinessService';

/**
 * @package
 *
 * Finds a user by their ID.
 *
 * @returns The user entity if found, or null if not found.
 */
export const _findUserById = async (
  executionContext: ExecutionContext,
  input: FindUserByIdInputDto
): Promise<BusinessResult<Nullable<UserEntity>, FindUserByIdErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindUserByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    // Step 2: Find user by ID
    const userEntity = await userDataService.findUserById(parsedInput.data.id);

    if (!userEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(userEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findUserById :: An unknown error occurred`,
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
 * @package
 *
 * Finds a user by their primary email address.
 *
 * @returns The user entity if found, or null if not found.
 */
export const _findUserByEmail = async (
  executionContext: ExecutionContext,
  input: FindUserByEmailInputDto
): Promise<BusinessResult<Nullable<UserEntity>, FindUserByEmailErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindUserByEmailInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    // Step 2: Find user by email
    const userEntity = await userDataService.findUserByEmail(input.email);

    if (!userEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(userEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findUserByEmail :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Creates a new user identity provider.
 *
 * @returns The created user identity provider entity.
 */
export const _createUserIdentityProvider = async (
  executionContext: ExecutionContext,
  input: CreateUserIdentityProviderInputDto
): Promise<
  BusinessResult<
    StakeholderIdentityProviderEntity,
    CreateUserIdentityProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateUserIdentityProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Create the user identity provider
    const identityProviderResult =
      await authenticationBusinessService._createStakeholderIdentityProvider(
        executionContext,
        {
          provider: provider,
          providerId: providerId,
          stakeholderId: userId,
          stakeholderType: AUTHENTICATION_STAKEHOLDER_TYPE.USER,
        }
      );

    if (!identityProviderResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create user identity provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok(identityProviderResult.data);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createUserIdentityProvider :: An unknown error occurred`,
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
 * @package
 *
 * Finds a user identity provider by the provider.
 *
 * @returns The user identity provider entity if found, or null if not found.
 */
export const _findUserIdentityProviderByProvider = async (
  executionContext: ExecutionContext,
  input: FindUserByIdentityProviderInputDto
): Promise<
  BusinessResult<
    Nullable<StakeholderIdentityProviderEntity>,
    FindUserByIdentityProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindUserByIdentityProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find the user identity provider by provider name and ID
    const identityProviderResult =
      await authenticationBusinessService._findIdentityProviderByProvider(
        executionContext,
        {
          provider: provider,
          providerId: providerId,
        }
      );

    if (!identityProviderResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find user identity provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const stakeholderIdentityProviderEntity = identityProviderResult.data;

    // Step 3: Check if the identity provider exists
    if (!stakeholderIdentityProviderEntity) {
      return BusinessResult.ok(null);
    }

    // Step 4: Check if the identity provider is associated with a user
    if (
      stakeholderIdentityProviderEntity.stakeholderType !==
      AUTHENTICATION_STAKEHOLDER_TYPE.USER
    ) {
      logger.warn(
        `${LOG_PREFIX} :: _findUserIdentityProviderByProvider :: Identity provider is not associated with a user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Identity provider is not associated with a user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok(stakeholderIdentityProviderEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findUserIdentityProviderByProvider :: An unknown error occurred`,
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
 * @package
 *
 * Creates a new user by identity provider.
 *
 * @returns The created user and identity provider entities.
 */
export const _createUserByIdentityProvider = async (
  executionContext: ExecutionContext,
  input: CreateUserByIdentityProviderInputDto
): Promise<
  BusinessResult<
    CreateUserByIdentityProviderOutputDto,
    CreateUserByIdentityProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateUserByIdentityProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Ensure that the provider connection does not already exist
    const existingUserIdentityProviderResult =
      await _findUserByIdentityProvider(executionContext, {
        provider: provider,
        providerId: providerId,
      });

    if (!existingUserIdentityProviderResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate user identity provider connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingStakeholderIdentityProviderEntity =
      existingUserIdentityProviderResult.data;

    // If an existing provider connection is found, then we cannot create a new user
    if (existingStakeholderIdentityProviderEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'User already exists with this identity provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: If no existing provider connection is found, retrieve the identity profile
    const identityProfileResult =
      await authenticationBusinessService._findIdentityProfileByProviderId(
        executionContext,
        {
          provider: provider,
          providerId: providerId,
        }
      );

    if (!identityProfileResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve identity profile',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const identityProfile = identityProfileResult.data;

    if (!identityProfile) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Identity profile not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!identityProfile.email) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Identity profile does not have an email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Check if a user already exists with the same email
    const existingUserResult = await _findUserByEmail(executionContext, {
      email: identityProfile.email,
    });

    if (!existingUserResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to check for existing user by email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingUserEntity = existingUserResult.data;

    // If an existing user is found, then we need return a failure result
    if (existingUserEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'User already exists with this email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Create the user with the email from the identity profile
    const userEntity = await userDataService.createUser(
      identityProfile.email,
      parsedInputData.firstName,
      parsedInputData.lastName
    );

    // Step 6: Create the user identity provider
    const userIdentityProviderResult = await _createUserIdentityProvider(
      executionContext,
      {
        userId: userEntity.id,
        provider: provider,
        providerId: providerId,
      }
    );

    if (!userIdentityProviderResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: createUserByIdentityProvider :: Failed to create user identity provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create user identity provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userId = userEntity.id;

    // Step 7: Assign the default roles to the user
    const roleAssignmentResult =
      await authorizationBusinessService.assignStakeholderRolesToResources(
        executionContext,
        {
          resourceStakeholderRoles: [
            // Assign the user editor role to their profile
            {
              stakeholderId: userId,
              stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.USER,
              resourceId: userId,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
              role: ROLE.USER_EDITOR,
            },
            // Assign the user subscriber role to the workspace
            {
              stakeholderId: userId,
              stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.USER,
              resourceId: ANY_RESOURCE_ID,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
              role: ROLE.WORKSPACE_CREATOR,
            },
          ],
        }
      );

    if (!roleAssignmentResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: createUserByIdentityProvider :: Failed to assign user role`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign user role',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const stakeholderIdentityProviderEntity = userIdentityProviderResult.data;

    return BusinessResult.ok({
      user: userEntity,
      identityProvider: stakeholderIdentityProviderEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createUserByIdentityProvider :: An unknown error occurred`,
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
 * @package
 *
 * Finds a user by their identity provider.
 *
 * @returns The user and identity provider entities if found, or null if not found.
 */
export const _findUserByIdentityProvider = async (
  executionContext: ExecutionContext,
  input: FindUserByIdentityProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindUserByIdentityProviderOutputDto>,
    FindUserByIdentityProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindUserByIdentityProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find user identity provider by provider name and ID
    const userIdentityProviderResult =
      await _findUserIdentityProviderByProvider(executionContext, {
        provider: provider,
        providerId: providerId,
      });

    if (!userIdentityProviderResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve user identity provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const stakeholderIdentityProviderEntity = userIdentityProviderResult.data;

    if (!stakeholderIdentityProviderEntity) {
      return BusinessResult.ok(null);
    }

    // Step 3: Find user by ID from the user identity provider entity
    const userResult = await _findUserById(executionContext, {
      id: stakeholderIdentityProviderEntity.stakeholderId,
    });

    if (!userResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve user by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    if (!userEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      user: userEntity,
      identityProvider: stakeholderIdentityProviderEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findUserByIdentityProvider :: An unknown error occurred`,
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
 * @package
 *
 * Updates a user's profile information.
 *
 * @returns The updated user entity.
 */
export const _updateUserProfile = async (
  executionContext: ExecutionContext,
  input: UpdateUserProfileInputDto
): Promise<BusinessResult<UserEntity, UpdateUserProfileErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = UpdateUserProfileInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;
    const firstName = parsedInputData.firstName;
    const lastName = parsedInputData.lastName;

    // Step 2: Validate that the user exists
    const userResult = await _findUserById(executionContext, {
      id: userId,
    });

    if (!userResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve user by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingUserEntity = userResult.data;

    if (!existingUserEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'User not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Update the user
    const updatedUserEntity = await userDataService.updateUser(
      userId,
      firstName,
      lastName
    );

    return BusinessResult.ok(updatedUserEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateUserProfile :: An unknown error occurred`,
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
 * Updates a user's profile information.
 *
 * @returns The updated user entity.
 */
export const updateUserProfile = async (
  executionContext: ExecutionContext,
  input: UpdateUserProfileInputDto
): Promise<BusinessResult<UserEntity, UpdateUserProfileErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate that actor can update the user
    const actorCanEditUserProfile =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.userId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
          permission: PERMISSION.USER_EDIT,
        }
      );

    if (!actorCanEditUserProfile.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: updateUserProfile :: Failed to validate actor access to user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanEditUserProfile.data) {
      logger.warn(
        `${LOG_PREFIX} :: updateUserProfile :: Actor does not have access to edit the user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: `Actor does not have access to edit the user`,
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return _updateUserProfile(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: updateUserProfile :: An unknown error occurred`,
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
