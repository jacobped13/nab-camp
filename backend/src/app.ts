import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { createRouter } from '@common';
import { errorHandler } from '@api/handler/error.handler';
import { notFoundHandler } from '@api/handler/not-found.handler';
import { rootRouter } from '@api/route/root.router';
import { contextMiddleware } from '@api/middleware/context/context.middleware';

export const app = createRouter()
  // -----------------------------------------------------------------
  // Global Middleware
  // -----------------------------------------------------------------
  .use(logger())
  .use(cors())
  .use(prettyJSON())
  // -----------------------------------------------------------------
  // Context Middleware
  // -----------------------------------------------------------------
  .use(contextMiddleware())
  // -----------------------------------------------------------------
  // Global Handler
  // -----------------------------------------------------------------
  .notFound(notFoundHandler)
  .onError(errorHandler)
  // -----------------------------------------------------------------
  // Root Router
  // -----------------------------------------------------------------
  .route('/', rootRouter);
