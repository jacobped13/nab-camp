import { createRouter } from '@common';
import { userRouter } from './user/user.router';
import { workspaceRouter } from './workspace/workspace.router';
import { accountRouter } from './account/account.router';
import { authenticationRouter } from './authentication/authentication.router';
import { billingRouter } from './billing/billing.router';

export enum APP_ROUTE {
  USER = '/user',
  WORKSPACE = '/workspace',
  ACCOUNT = '/account',
  AUTHENTICATION = '/authentication',
  BILLING = '/billing',
}

export const rootRouter = createRouter()
  // -----------------------------------------------------------------
  // User Routes
  // -----------------------------------------------------------------
  .route(APP_ROUTE.USER, userRouter)
  // -----------------------------------------------------------------
  // Workspace Routes
  // -----------------------------------------------------------------
  .route(APP_ROUTE.WORKSPACE, workspaceRouter)
  // -----------------------------------------------------------------
  // Account Routes
  // -----------------------------------------------------------------
  .route(APP_ROUTE.ACCOUNT, accountRouter)
  // -----------------------------------------------------------------
  // Authentication Routes
  // -----------------------------------------------------------------
  .route(APP_ROUTE.AUTHENTICATION, authenticationRouter)
  // -----------------------------------------------------------------
  // Billing Routes
  // -----------------------------------------------------------------
  .route(APP_ROUTE.BILLING, billingRouter);
