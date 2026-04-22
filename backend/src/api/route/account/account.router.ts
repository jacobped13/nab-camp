import { createRouter } from '@common';
import * as accountHandler from './account.handler';

export enum ACCOUNT_ROUTE {
  CURRENT = '/current',
}

export const accountRouter = createRouter()
  // -----------------------------------------------------------------
  // Find Current Account
  // -----------------------------------------------------------------
  .get(ACCOUNT_ROUTE.CURRENT, ...accountHandler.findCurrentAccount);
