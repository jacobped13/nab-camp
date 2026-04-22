import {
  HTTP_STATUS_CODE,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  createHandler,
  HTTPException,
  InternalServerErrorException,
  transformResultErrorCodeToHTTPStatusCode,
  AuthenticationContext,
  AUTHENTICATION_SCHEME,
  ACTOR_TYPE,
} from '@common';
import { zodValidationMiddleware } from '@api/middleware/zod-validation.middleware';
import {
  CreateUserRequestBodySchema,
  CreateUserResponse,
  UpdateUserRequestBodySchema,
  UpdateUserRequestParamSchema,
  UpdateUserResponse,
} from './helper/user.dto';
import { userBusinessService } from '@service/user';
import { mapUserResponse } from './helper/user.util';
import { User } from '@api-contracts/user';
import { authenticationMiddleware } from '@api/middleware/authentication.middleware';
import { AUTHENTICATION_IDENTITY_PROVIDER } from '@service/authentication';
import { actorMiddleware } from '@api/middleware/actor.middleware';

const LOG_PREFIX = 'API :: User :: UserHandler';

// -----------------------------------------------------------------
// Create User
// -----------------------------------------------------------------

export const createUser = createHandler(
  authenticationMiddleware({
    scheme: AUTHENTICATION_SCHEME.BEARER,
    provider: AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE,
  }),
  zodValidationMiddleware('json', CreateUserRequestBodySchema),
  async (requestContext): Promise<CreateUserResponse> => {
    const authenticationContext =
      AuthenticationContext.fromRequestContext(requestContext);
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');

      const userResult =
        await userBusinessService._createUserByIdentityProvider(
          executionContext,
          {
            provider: authenticationContext.provider!,
            providerId: authenticationContext.providerId!,
            firstName: parsedInput.firstName,
            lastName: parsedInput.lastName,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a user to be created.
      if (!userResult.isSuccess()) {
        const primaryError = userResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const userResponse = mapUserResponse(userResult.data.user) as User;

      return requestContext.json(
        {
          user: userResponse,
        },
        HTTP_STATUS_CODE.CREATED
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: createUser :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Update User
// -----------------------------------------------------------------

export const updateUser = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', UpdateUserRequestParamSchema),
  zodValidationMiddleware('json', UpdateUserRequestBodySchema),
  async (requestContext): Promise<UpdateUserResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const userResult = await userBusinessService.updateUserProfile(
        executionContext,
        {
          userId: parsedParams.id,
          firstName: parsedInput.firstName,
          lastName: parsedInput.lastName,
        }
      );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a user to be edited.
      if (!userResult.isSuccess()) {
        const primaryError = userResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const userResponse = mapUserResponse(userResult.data) as User;

      return requestContext.json(
        {
          user: userResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: updateUser :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);
