import {
  HTTPException,
  AuthenticationContext,
  ExecutionContext,
  InternalServerErrorException,
  injectExceptionDetails,
  logger,
  ACTOR_TYPE,
  ActorContext,
  TraceContext,
  createMiddleware,
  AUTHENTICATION_SCHEME,
} from '@common';

const LOG_PREFIX = 'API :: Middleware :: DefaultContextMiddleware';

/**
 * Middleware responsible for initializing the default {@link AuthenticationContext authentication context} and {@link ExecutionContext execution context} for each request.
 */
export const defaultContextMiddleware = () => {
  return createMiddleware(async (requestContext, next) => {
    try {
      // Initialize the authentication context with default values
      AuthenticationContext.hydrateRequestContext(requestContext, {
        scheme: AUTHENTICATION_SCHEME.NONE,
        credential: undefined,
        provider: undefined,
        providerId: undefined,
      });

      // Initialize the execution context with default values
      ExecutionContext.hydrateRequestContext(requestContext, {
        actorId: ActorContext.generateAnonymousActorId(),
        actorType: ACTOR_TYPE.ANONYMOUS,
        correlationId: TraceContext.generateCorrelationId(),
        account: undefined,
      });

      await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: defaultContextMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error)
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
