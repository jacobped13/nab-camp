import { every } from 'hono/combine';
import type {
  AuthenticationContext as _AuthenticationContext,
  ExecutionContext as _ExecutionContext,
} from '@common';
import { defaultContextMiddleware } from './default-context.middleware';
import { authenticationContextMiddleware } from './authentication-context.middleware';
import { actorContextMiddleware } from './actor-context.middleware';
import { accountContextMiddleware } from './account-context.middleware';

/**
 * Middleware included in each request with the responsibility of hydrating the
 * {@link _AuthenticationContext authentication context} and the {@link _ExecutionContext execution context}
 * with the details on the actor, account, and tracing information.
 */
export const contextMiddleware = () => {
  return every(
    // Initiailize the default context
    defaultContextMiddleware(),
    // Extract authentication details from request and hydrate the authentication context
    authenticationContextMiddleware(),
    // Extract actor details from authentication context and hydrate the actor context
    actorContextMiddleware(),
    // Hydrate the account context using the details from the actor context
    accountContextMiddleware()
  );
};
