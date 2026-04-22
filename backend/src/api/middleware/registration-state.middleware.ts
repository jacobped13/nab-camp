import {
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
  UnauthorizedException,
} from '@common';
import { REGISTRATION_STATE } from '@service/account';

const LOG_PREFIX = 'API :: Middleware :: RegistrationStateMiddleware';

/**
 * Middleware responsible for validating the registration state
 * and ensuring that the registration is in a valid state to perform the requested action.
 */
export const registrationStateMiddleware = (
  ...registrationStates: REGISTRATION_STATE[]
) => {
  return createMiddleware(async (requestContext, next) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const registrationState =
        executionContext?.account?.registrationState ?? '';

      if (
        !registrationStates.includes(registrationState as REGISTRATION_STATE)
      ) {
        logger.warn(
          `${LOG_PREFIX} :: registrationStateMiddleware :: Account is not in a valid registration state`,
          {
            context: loggingContext,
            registrationState: registrationState,
            validStates: registrationStates,
          }
        );
        throw new UnauthorizedException(
          'Account is not in a valid registration state'
        );
      }

      return await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: registrationStateMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
