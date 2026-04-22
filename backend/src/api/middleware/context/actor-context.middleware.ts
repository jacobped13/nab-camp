import {
  ACTOR_TYPE,
  AuthenticationContext,
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
  Nullable,
  transformResultErrorCodeToHTTPStatusCode,
} from '@common';
import {
  authenticationBusinessService,
  AUTHENTICATION_STAKEHOLDER_TYPE,
} from '@service/authentication';

const LOG_PREFIX = 'API :: Middleware :: ActorContextMiddleware';

/**
 * Middleware responsible for hydrating the actor context using the details from the {@link AuthenticationContext authentication context}.
 */
export const actorContextMiddleware = () => {
  return createMiddleware(async (requestContext, next) => {
    const authenticationContext =
      AuthenticationContext.fromRequestContext(requestContext);
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Find the actor type based on the authentication provider and provider ID
      const provider = authenticationContext.provider;
      const providerId = authenticationContext.providerId;

      // If no provider or provider ID is set, we can skip the rest of the middleware
      if (!provider || !providerId) {
        return await next();
      }

      // Step 2: Find the identity provider connection by the provider details
      const identityProviderResult =
        await authenticationBusinessService._findIdentityProviderByProvider(
          executionContext,
          {
            provider: provider,
            providerId: providerId,
          }
        );

      if (!identityProviderResult.isSuccess()) {
        const primaryError = identityProviderResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const identityProviderEntity = identityProviderResult.data;

      // If the identity provider connection is not found, we can skip the rest of the middleware
      if (!identityProviderEntity) {
        return await next();
      }

      // Step 3: Map the identity provider stakeholder type to the actor type
      const actorId = identityProviderEntity.stakeholderId;
      const actorType = mapIdentityProviderStakeholderTypeToActorType(
        identityProviderEntity.stakeholderType
      );

      // If the actor type is not found, we can skip the rest of the middleware
      if (!actorType) {
        logger.warn(
          `${LOG_PREFIX} :: actorContextMiddleware :: Actor type not found for identity provider stakeholder type`,
          {
            context: loggingContext,
            provider: provider,
            providerId: providerId,
            stakeholderType: identityProviderEntity.stakeholderType,
          }
        );
        return await next();
      }

      // Step 4: Hydrate the actor context with the actor type and identity provider details
      ExecutionContext.hydrateRequestContext(requestContext, {
        actorId: actorId,
        actorType: actorType,
        correlationId: executionContext.trace.correlationId,
        account: undefined,
      });

      await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: actorContextMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};

/**
 * Mapping between identity provider stakeholder types and actor types.
 */
const IDENTITY_PROVIDER_STAKEHOLDER_TYPE_TO_ACTOR_TYPE_MAP: Partial<
  Record<AUTHENTICATION_STAKEHOLDER_TYPE, ACTOR_TYPE>
> = {
  [AUTHENTICATION_STAKEHOLDER_TYPE.USER]: ACTOR_TYPE.USER,
  [AUTHENTICATION_STAKEHOLDER_TYPE.SYSTEM]: ACTOR_TYPE.SYSTEM,
};

/**
 * Maps an identity provider stakeholder type to an actor type.
 */
const mapIdentityProviderStakeholderTypeToActorType = (
  stakeholder: AUTHENTICATION_STAKEHOLDER_TYPE
): Nullable<ACTOR_TYPE> => {
  return (
    IDENTITY_PROVIDER_STAKEHOLDER_TYPE_TO_ACTOR_TYPE_MAP[stakeholder] ?? null
  );
};
