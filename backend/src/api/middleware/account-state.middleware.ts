import {
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
  UnauthorizedException,
} from '@common';
import { ACCOUNT_STATE } from '@service/account';

const LOG_PREFIX = 'API :: Middleware :: AccountStateMiddleware';

/**
 * Middleware responsible for validating the account state
 * and ensuring that the account is in a valid state to perform the requested action.
 */
export const accountStateMiddleware = (...accountStates: ACCOUNT_STATE[]) => {
  return createMiddleware(async (requestContext, next) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const accountState = executionContext?.account?.state ?? '';

      if (!accountStates.includes(accountState as ACCOUNT_STATE)) {
        logger.warn(
          `${LOG_PREFIX} :: accountStateMiddleware :: Account is not in a valid state`,
          {
            context: loggingContext,
            accountState,
            validStates: accountStates,
          }
        );
        throw new UnauthorizedException('Account is not in a valid state');
      }

      return await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: accountStateMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
