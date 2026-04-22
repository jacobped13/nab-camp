import {
  AUTHENTICATION_SCHEME,
  AuthenticationContext,
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
  UnauthorizedException,
} from '@common';
import { AUTHENTICATION_IDENTITY_PROVIDER } from '@service/authentication';

const LOG_PREFIX = 'API :: Middleware :: AuthenticationMiddleware';

/**
 * Middleware responsible for validating authentication credentials
 * and hydrating the {@link AuthenticationContext authentication context} for each request.
 */
export const authenticationMiddleware = (
  ...authenticationMethods: {
    scheme: AUTHENTICATION_SCHEME;
    provider: AUTHENTICATION_IDENTITY_PROVIDER;
  }[]
) => {
  return createMiddleware(async (requestContext, next) => {
    const authenticationContext =
      AuthenticationContext.fromRequestContext(requestContext);
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Extract the authentication details from the authentication context
      const scheme = authenticationContext.scheme;
      const provider = authenticationContext.provider;

      // Step 2: Check if the authentication scheme and provider combination is valid
      const isValidAuthenticationMethod = authenticationMethods.some(
        (method) => method.scheme === scheme && method.provider === provider
      );

      if (!isValidAuthenticationMethod) {
        logger.warn(
          `${LOG_PREFIX} :: authenticationMiddleware :: Invalid authentication method`,
          {
            context: loggingContext,
            scheme: scheme,
            provider: provider,
          }
        );
        throw new UnauthorizedException('Invalid authentication method');
      }

      await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: authenticationMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
