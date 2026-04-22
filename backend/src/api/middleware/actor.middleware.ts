import {
  ACTOR_TYPE,
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
  UnauthorizedException,
} from '@common';

const LOG_PREFIX = 'API :: Middleware :: ActorMiddleware';

/**
 * Middleware responsible for validating the actor type
 * and ensuring that the actor is allowed to perform the requested action.
 */
export const actorMiddleware = (...actorTypes: ACTOR_TYPE[]) => {
  return createMiddleware(async (requestContext, next) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Extract the actor from the execution context
      const actorType = executionContext.actor.type;

      // Step 2: Check if the actor type is valid
      if (!actorTypes.includes(actorType)) {
        logger.warn(`${LOG_PREFIX} :: actorMiddleware :: Invalid actor type`, {
          context: loggingContext,
          actorType: actorType,
        });
        throw new UnauthorizedException(
          'Actor is not allowed to perform this action'
        );
      }

      return await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: actorMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
