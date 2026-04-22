import { createFactory } from 'hono/factory';

// -----------------------------------------------------------------
// In order to levarage Ruby on Rails-like controllers in Hono,
// factory methods are provider for creating routers, middleware,
// and handlers.
//
// These factory methods allow you to separate out your logic
// while maintaining type safety.
//
// See: https://hono.dev/docs/helpers/factory
// -----------------------------------------------------------------

const factory = createFactory();

/**
 * Utility function to create a router
 */
export const createRouter = factory.createApp;

/**
 * Utility function to create a middleware handler
 */
export const createMiddleware = factory.createMiddleware;

/**
 * Utility function to create a request handler
 */
export const createHandler = factory.createHandlers;
