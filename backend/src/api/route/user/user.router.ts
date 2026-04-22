import { createRouter } from '@common';
import * as userHandler from './user.handler';

export enum USER_ROUTE {
  ROOT = '/',
  ID = '/:id',
}

export const userRouter = createRouter()
  // -----------------------------------------------------------------
  // Create User Operation
  // -----------------------------------------------------------------
  .post(USER_ROUTE.ROOT, ...userHandler.createUser)
  // -----------------------------------------------------------------
  // Update User Operation
  // -----------------------------------------------------------------
  .put(USER_ROUTE.ID, ...userHandler.updateUser);
