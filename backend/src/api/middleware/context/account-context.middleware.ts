import {
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
  transformResultErrorCodeToHTTPStatusCode,
} from '@common';
import { accountBusinessService } from '@service/account';

const LOG_PREFIX = 'API :: Middleware :: AuthenticationMiddleware';

/**
 * Middleware responsible for hydrating the account context using the details from the {@link ActorContext actor context}.
 */
export const accountContextMiddleware = () => {
  return createMiddleware(async (requestContext, next) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Find the account based on the actor details
      const accountResult =
        await accountBusinessService.findActorAccount(executionContext);

      if (!accountResult.isSuccess()) {
        const primaryError = accountResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const acountData = accountResult.data;

      if (!acountData) {
        return await next();
      }

      // Step 2: Hydrate the account context with the account data
      ExecutionContext.hydrateRequestContext(requestContext, {
        actorId: executionContext.actor.id,
        actorType: executionContext.actor.type,
        correlationId: executionContext.trace.correlationId,
        account: acountData,
      });

      await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: accountContextMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
