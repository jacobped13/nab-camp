import {
  ExecutionContext,
  RESULT_ERROR_CODE,
  BusinessResult,
  injectExceptionDetails,
  logger,
  BusinessErrorResult,
  Nullable,
} from '@common';
import { isDevelopmentEnvironment } from '@env';
import {
  AcceptEmailAuthenticationCodeInputDto,
  AcceptEmailAuthenticationCodeInputDtoSchema,
  CreateIdentityProfileErrorDto,
  CreateIdentityProfileInputDto,
  CreateIdentityProfileInputDtoSchema,
  CreateStakeholderIdentityProviderErrorDto,
  CreateStakeholderIdentityProviderInputDto,
  CreateStakeholderIdentityProviderInputDtoSchema,
  CreateEmailAuthenticationCodeErrorDto,
  CreateEmailAuthenticationCodeInputDto,
  CreateEmailAuthenticationCodeInputDtoSchema,
  FindEffectiveEmailAuthenticationCodeByEmailErrorDto,
  FindEffectiveEmailAuthenticationCodeByEmailInputDto,
  FindEffectiveEmailAuthenticationCodeByEmailInputDtoSchema,
  FindIdentityProfileByProviderEmailErrorDto,
  FindIdentityProfileByProviderEmailInputDto,
  FindIdentityProfileByProviderEmailInputDtoSchema,
  FindIdentityProfileByProviderIdErrorDto,
  FindIdentityProfileByProviderIdInputDto,
  FindIdentityProfileByProviderIdInputDtoSchema,
  FindIdentityProviderByProviderErrorDto,
  FindIdentityProviderByProviderInputDto,
  FindIdentityProviderByProviderInputDtoSchema,
  SendEmailAuthenticationCodeErrorDto,
  SendEmailAuthenticationCodeInputDto,
  SendEmailAuthenticationCodeInputDtoSchema,
  SendEmailAuthenticationCodeOutputDto,
  VerifyAuthenticationCredentialErrorDto,
  VerifyAuthenticationCredentialInputDto,
  VerifyAuthenticationCredentialInputDtoSchema,
  VerifyEmailAuthenticationCodeErrorDto,
  VerifyEmailAuthenticationCodeInputDto,
  VerifyEmailAuthenticationCodeInputDtoSchema,
  CreateEmailAuthenticationCodeOutputDto,
} from './helper/authentication.business.dto';
import {
  IdentityCredential,
  IdentityProfile,
} from '../provider/helper/authentication.provider.model';
import { AUTHENTICATION_IDENTITY_PROVIDER } from '../provider/helper/authentication.provider.constant';
import {
  AuthenticationCodeEntity,
  StakeholderIdentityProviderEntity,
} from '../data/helper/authentication.data.model';
import {
  generateAuthenticationCode,
  hashAuthenticationCode,
  isValidAuthenticationCode,
} from './helper/authentication.business.util';
import {
  EMAIL_AUTHENTICATION_CODE_EXPIRATION_TIME_MILLISECONDS,
  EMAIL_AUTHENTICATION_CODE_PROVIDER,
} from './helper/authentication.business.constant';
import * as authenticationDataService from '../data/authentication.data.service';
import * as authenticationProviderService from '../provider/authentication.provider.service';
import * as emailProviderService from '../provider/email.provider.service';

const LOG_PREFIX = 'Service :: Authentication :: AuthenticationBusinessService';

/**
 * @package
 *
 * Verifies an authentication credential and returns the identity credential.
 *
 * @returns The decoded identity credential if the verification is successful.
 */
export const _verifyAuthenticationCredential = async (
  executionContext: ExecutionContext,
  input: VerifyAuthenticationCredentialInputDto
): Promise<
  BusinessResult<IdentityCredential, VerifyAuthenticationCredentialErrorDto>
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      VerifyAuthenticationCredentialInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const scheme = parsedInputData.scheme;
    const credential = parsedInputData.credential;

    // Step 2: Find the provider from the token
    const provider =
      authenticationProviderService.findProviderBySchemeAndCredential(
        scheme,
        credential
      );

    if (!provider) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Credential does not contain a supported provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Verify the identity token with the provider
    const identityCredential =
      await authenticationProviderService.verifyProviderCredential(
        scheme,
        credential,
        provider
      );

    if (!identityCredential) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Credential is invalid or expired',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok(identityCredential);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _verifyAuthenticationCredential :: An unknown error occurred`,
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
 * Finds an identity profile by its ID and provider.
 *
 * @returns The identity profile if found, or null if not found.
 */
export const _findIdentityProfileByProviderId = async (
  executionContext: ExecutionContext,
  input: FindIdentityProfileByProviderIdInputDto
): Promise<
  BusinessResult<
    Nullable<IdentityProfile>,
    FindIdentityProfileByProviderIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindIdentityProfileByProviderIdInputDtoSchema.safeParse(input);

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

    // Step 2: Find the identity profile by ID and provider
    const identityProfile =
      await authenticationProviderService.findIdentityProfileById(
        providerId,
        provider
      );

    if (!identityProfile) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(identityProfile);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findIdentityProfileByProviderId :: An unknown error occurred`,
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
 * Finds an identity profile by its email and provider.
 *
 * @returns The identity profile if found, or null if not found.
 */
export const _findIdentityProfileByProviderEmail = async (
  executionContext: ExecutionContext,
  input: FindIdentityProfileByProviderEmailInputDto
): Promise<
  BusinessResult<
    Nullable<IdentityProfile>,
    FindIdentityProfileByProviderEmailErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindIdentityProfileByProviderEmailInputDtoSchema.safeParse(input);

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
    const email = parsedInputData.email;

    // Step 2: Find the identity profile by email and provider
    const identityProfile =
      await authenticationProviderService.findIdentityProfileByEmail(
        email,
        provider
      );

    if (!identityProfile) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(identityProfile);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findIdentityProfileByProviderEmail :: An unknown error occurred`,
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
 * Creates a new identity profile based on the provided input.
 *
 * @returns The created identity profile if successful.
 */
export const _createIdentityProfile = async (
  executionContext: ExecutionContext,
  input: CreateIdentityProfileInputDto
): Promise<BusinessResult<IdentityProfile, CreateIdentityProfileErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = CreateIdentityProfileInputDtoSchema.safeParse(input);

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
    const email = parsedInputData.email;

    // Step 2: Find the identity profile by provider email
    const identityProfileResult = await _findIdentityProfileByProviderEmail(
      executionContext,
      {
        provider: provider,
        email: email,
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

    const existingIdentityProfile = identityProfileResult.data;

    if (existingIdentityProfile) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Identity profile already exists for the provided email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Create a new identity profile
    const identityProfile =
      await authenticationProviderService.createIdentityProfile(
        email,
        provider
      );

    return BusinessResult.ok(identityProfile);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createIdentityProfile :: An unknown error occurred`,
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
 * Finds a stakeholder's identity provider connection by the provider.
 *
 * @returns The stakeholder identity provider entity if found, or null if not found.
 */
export const _findIdentityProviderByProvider = async (
  executionContext: ExecutionContext,
  input: FindIdentityProviderByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<StakeholderIdentityProviderEntity>,
    FindIdentityProviderByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindIdentityProviderByProviderInputDtoSchema.safeParse(input);

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

    // Step 2: Find the identity provider by provider
    const stakeholderIdentityProviderEntity =
      await authenticationDataService.findStakeholderIdentityProviderByProvider(
        {
          provider: provider,
          providerId: providerId,
        }
      );

    if (!stakeholderIdentityProviderEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(stakeholderIdentityProviderEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findIdentityProviderByProvider :: An unknown error occurred`,
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
 * Creates a new stakeholder identity provider connection.
 *
 * @returns The created stakeholder identity provider entity if successful.
 */
export const _createStakeholderIdentityProvider = async (
  executionContext: ExecutionContext,
  input: CreateStakeholderIdentityProviderInputDto
): Promise<
  BusinessResult<
    StakeholderIdentityProviderEntity,
    CreateStakeholderIdentityProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateStakeholderIdentityProviderInputDtoSchema.safeParse(input);

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
    const stakeholderId = parsedInputData.stakeholderId;
    const stakeholderType = parsedInputData.stakeholderType;

    // Step 2: Check if the identity provider already exists
    const existingProvider =
      await authenticationDataService.findStakeholderIdentityProviderByProvider(
        {
          provider: provider,
          providerId: providerId,
        }
      );

    if (existingProvider) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Identity provider already exists',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Create the stakeholder identity provider
    const stakeholderIdentityProviderEntity =
      await authenticationDataService.createStakeholderIdentityProvider(
        {
          stakeholderId: stakeholderId,
          stakeholderType: stakeholderType,
        },
        {
          provider: provider,
          providerId: providerId,
        }
      );

    return BusinessResult.ok(stakeholderIdentityProviderEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createStakeholderIdentityProvider :: An unknown error occurred`,
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
 * Finds an effective email authentication code by email.
 *
 * @returns The effective email authentication code if found, or null if not found.
 */
export const _findEffectiveEmailAuthenticationCodeByEmail = async (
  executionContext: ExecutionContext,
  input: FindEffectiveEmailAuthenticationCodeByEmailInputDto
): Promise<
  BusinessResult<
    Nullable<AuthenticationCodeEntity>,
    FindEffectiveEmailAuthenticationCodeByEmailErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindEffectiveEmailAuthenticationCodeByEmailInputDtoSchema.safeParse(
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
    const email = parsedInputData.email;

    // Step 2: Find the latest email authentication code by email
    const emailAuthenticationCodeEntity =
      await authenticationDataService.findLatestEmailAuthenticationCodeByEmail(
        email
      );

    // If no code is found, return null
    if (!emailAuthenticationCodeEntity) {
      return BusinessResult.ok(null);
    }

    // If the latest code is already accepted, return null
    if (emailAuthenticationCodeEntity.isAccepted()) {
      return BusinessResult.ok(null);
    }

    // If the latest code is already expired, return null
    if (emailAuthenticationCodeEntity.isExpired()) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(emailAuthenticationCodeEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findEffectiveEmailAuthenticationCodeByEmail :: An unknown error occurred`,
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
 * Creates a new email authentication code.
 *
 * @returns The created email authentication code entity if successful.
 */
export const _createEmailAuthenticationCode = async (
  executionContext: ExecutionContext,
  input: CreateEmailAuthenticationCodeInputDto
): Promise<
  BusinessResult<
    CreateEmailAuthenticationCodeOutputDto,
    CreateEmailAuthenticationCodeErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateEmailAuthenticationCodeInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const email = parsedInputData.email;

    // Step 2: Create the email authentication code and hash it
    const code = generateAuthenticationCode();
    const hashedCode = hashAuthenticationCode(code);

    const expirationDate = new Date(
      new Date().getTime() +
        EMAIL_AUTHENTICATION_CODE_EXPIRATION_TIME_MILLISECONDS
    );

    // Step 3: Create the email authentication code entity
    const emailAuthenticationCodeEntity =
      await authenticationDataService.createEmailAuthenticationCode(
        email,
        hashedCode,
        expirationDate
      );

    // Step 4: Log the code for debugging in non-production environments
    if (isDevelopmentEnvironment()) {
      logger.info(
        `${LOG_PREFIX} :: _createEmailAuthenticationCode :: Created email authentication code`,
        {
          email: email,
          code: code,
        }
      );
    }

    return BusinessResult.ok({
      code: code,
      authenticationCode: emailAuthenticationCodeEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createEmailAuthenticationCode :: An unknown error occurred`,
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
 * Sends an email authentication code.
 *
 * @returns The email authentication code and entity if the sending is successful.
 */
export const _sendEmailAuthenticationCode = async (
  executionContext: ExecutionContext,
  input: SendEmailAuthenticationCodeInputDto
): Promise<
  BusinessResult<
    SendEmailAuthenticationCodeOutputDto,
    SendEmailAuthenticationCodeErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      SendEmailAuthenticationCodeInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const email = parsedInputData.email;

    // Step 2: Check if an existing identity profile exists for the email
    const identityProfileResult = await _findIdentityProfileByProviderEmail(
      executionContext,
      {
        provider: EMAIL_AUTHENTICATION_CODE_PROVIDER,
        email: email,
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

    const existingIdentityProfile = identityProfileResult.data;

    // Step 3: If an identity profile does not already exist for the email, create a new one
    if (!existingIdentityProfile) {
      const createProfileResult = await _createIdentityProfile(
        executionContext,
        {
          provider: EMAIL_AUTHENTICATION_CODE_PROVIDER,
          email: email,
        }
      );

      if (!createProfileResult.isSuccess()) {
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
          detail: 'Failed to create identity profile',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }
    }

    // Step 4: Create an email authentication code
    const createCodeResult = await _createEmailAuthenticationCode(
      executionContext,
      {
        email: email,
      }
    );

    if (!createCodeResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create email authentication code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const emailAuthenticationCode = createCodeResult.data.code;
    const emailAuthenticationCodeEntity =
      createCodeResult.data.authenticationCode;

    // Step 5: If the identity profile was created, send out a registration email with the code,
    // else send a login email with the code.
    if (!isDevelopmentEnvironment()) {
      if (!existingIdentityProfile) {
        // TODO: Add a registration email template
        await emailProviderService.sendLoginVerificationEmail(
          email,
          emailAuthenticationCode
        );
      } else {
        await emailProviderService.sendLoginVerificationEmail(
          email,
          emailAuthenticationCode
        );
      }
    }

    return BusinessResult.ok({
      code: emailAuthenticationCode,
      authenticationCode: emailAuthenticationCodeEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _sendEmailAuthenticationCode :: An unknown error occurred`,
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
 * Verifies an email authentication code.
 *
 * @returns The email authentication code entity if the verification is successful.
 */
export const _verifyEmailAuthenticationCode = async (
  executionContext: ExecutionContext,
  input: VerifyEmailAuthenticationCodeInputDto
): Promise<
  BusinessResult<
    AuthenticationCodeEntity,
    VerifyEmailAuthenticationCodeErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      VerifyEmailAuthenticationCodeInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const email = parsedInputData.email;
    const code = parsedInputData.code;

    // Step 2: Verify the email authentication code
    const emailAuthenticationCodeResult =
      await _findEffectiveEmailAuthenticationCodeByEmail(executionContext, {
        email: email,
      });

    if (!emailAuthenticationCodeResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve email authentication code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const emailAuthenticationCodeEntity = emailAuthenticationCodeResult.data;

    if (!emailAuthenticationCodeEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'No email authentication code found for the provided email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const isValidCode = isValidAuthenticationCode(
      code,
      emailAuthenticationCodeEntity.codeHash
    );

    if (!isValidCode) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Email authentication code is invalid',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok(emailAuthenticationCodeEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _verifyEmailAuthenticationCode :: An unknown error occurred`,
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
 * Accepts an email authentication code.
 *
 * @returns An authentication credential if the acceptance is successful.
 */
export const _acceptEmailAuthenticationCode = async (
  executionContext: ExecutionContext,
  input: AcceptEmailAuthenticationCodeInputDto
): Promise<BusinessResult<string, CreateEmailAuthenticationCodeErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AcceptEmailAuthenticationCodeInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const email = parsedInputData.email;
    const code = parsedInputData.code;

    // Step 2: Verify the code
    const verifyCodeResult = await _verifyEmailAuthenticationCode(
      executionContext,
      {
        email: email,
        code: code,
      }
    );

    if (!verifyCodeResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Invalid or expired email authentication code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!verifyCodeResult.data) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Invalid or expired email authentication code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const authenticationCodeEntity = verifyCodeResult.data;

    // Step 3: Accept the email authentication code
    await authenticationDataService.acceptAuthenticationCodeById(
      authenticationCodeEntity.id
    );

    // Step 4: Find the identity profile by the email address
    const identityProfileResult = await _findIdentityProfileByProviderEmail(
      executionContext,
      {
        provider: EMAIL_AUTHENTICATION_CODE_PROVIDER,
        email: email,
      }
    );

    if (!identityProfileResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find identity profile by email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    let identityProfile = identityProfileResult.data;

    // Step 5: If no identity profile exists, create one
    if (!identityProfile) {
      const createIdentityProfileResult = await _createIdentityProfile(
        executionContext,
        {
          provider: EMAIL_AUTHENTICATION_CODE_PROVIDER,
          email: email,
        }
      );

      if (!createIdentityProfileResult.isSuccess()) {
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
          detail: 'Failed to create identity profile',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }

      identityProfile = createIdentityProfileResult.data;
    }

    // Step 6: Create a credential for the identity profile
    const identityCredential =
      await authenticationProviderService.createProviderCredential(
        identityProfile.id,
        AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE
      );

    return BusinessResult.ok(identityCredential);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _acceptEmailAuthenticationCode :: An unknown error occurred`,
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
