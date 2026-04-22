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
import { authenticationBusinessService } from '@service/authentication';
import { Context } from 'hono';

const LOG_PREFIX = 'API :: Middleware :: AuthenticationContextMiddleware';

/**
 * Middleware responsible for hydrating the authentication context using the authentication method in the request.
 */
export const authenticationContextMiddleware = () => {
  return createMiddleware(async (requestContext, next) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Extract the authentication data from the request context
      const scheme = extractAuthenticationSchemeFromRequest(requestContext);
      const credential = extractAuthenticationCredentialFromRequest(
        requestContext,
        scheme
      );

      // Step 2: Check if an authentication credential is required
      // If not required, hydrate the authentication context and continue
      if (scheme === AUTHENTICATION_SCHEME.NONE) {
        AuthenticationContext.hydrateRequestContext(requestContext, {
          scheme: AUTHENTICATION_SCHEME.NONE,
          credential: undefined,
          provider: undefined,
          providerId: undefined,
        });
        return await next();
      }

      // Step 3: Check if the credential is provided
      // If not provided, hydrate the authentication context with the scheme and continue
      if (!credential) {
        AuthenticationContext.hydrateRequestContext(requestContext, {
          scheme: scheme,
          credential: undefined,
          provider: undefined,
          providerId: undefined,
        });
        return await next();
      }

      // Step 4: Find the authentication provider if the scheme and credential are provided
      // and hydrate the authentication context with the provider information
      const identityCredentialResult =
        await authenticationBusinessService._verifyAuthenticationCredential(
          executionContext,
          {
            scheme: scheme,
            credential: credential,
          }
        );

      if (!identityCredentialResult.isSuccess()) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const identityCredentialResultData = identityCredentialResult.data;
      const provider = identityCredentialResultData.provider;
      const providerId = identityCredentialResultData.id;

      AuthenticationContext.hydrateRequestContext(requestContext, {
        scheme: scheme,
        credential: credential,
        provider: provider,
        providerId: providerId,
      });

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

/**
 * Extracts the authentication scheme from the request context.
 */
const extractAuthenticationSchemeFromRequest = (
  requestContext: Context
): AUTHENTICATION_SCHEME => {
  const authorizationHeader = requestContext.req.header('Authorization') ?? '';

  if (authorizationHeader.startsWith('Bearer ')) {
    return AUTHENTICATION_SCHEME.BEARER;
  }

  if (authorizationHeader.startsWith('Basic ')) {
    return AUTHENTICATION_SCHEME.BASIC;
  }

  return AUTHENTICATION_SCHEME.NONE;
};

/**
 * Extracts the authentication credential from the request context based on the specified authentication scheme.
 */
const extractAuthenticationCredentialFromRequest = (
  requestContext: Context,
  authenticationScheme: AUTHENTICATION_SCHEME
): string | undefined => {
  if (authenticationScheme === AUTHENTICATION_SCHEME.BEARER) {
    const authorizationHeader =
      requestContext.req.header('Authorization') ?? '';
    const credential = authorizationHeader.split('Bearer ')[1] ?? '';

    if (!credential) {
      return undefined;
    }

    return credential;
  }

  if (authenticationScheme === AUTHENTICATION_SCHEME.BASIC) {
    const authorizationHeader =
      requestContext.req.header('Authorization') ?? '';
    const encodedCredential = authorizationHeader.split('Basic ')[1] ?? '';

    if (!encodedCredential) {
      return undefined;
    }

    return Buffer.from(encodedCredential, 'base64').toString('utf-8');
  }

  return undefined;
};
