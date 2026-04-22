import { createRouter } from '@common';
import * as authenticationHandler from './authentication.handler';

export enum AUTHENTICATION_ROUTE {
  EMAIL_CODE_SEND = '/email/code/send',
  EMAIL_CODE_ACCEPT = '/email/code/accept',
}

export const authenticationRouter = createRouter()
  // -----------------------------------------------------------------
  // Send Email Authentication Code Operation
  // -----------------------------------------------------------------
  .post(
    AUTHENTICATION_ROUTE.EMAIL_CODE_SEND,
    ...authenticationHandler.sendEmailAuthenticationCode
  )
  // -----------------------------------------------------------------
  // Accept Email Authentication Code Operation
  // -----------------------------------------------------------------
  .post(
    AUTHENTICATION_ROUTE.EMAIL_CODE_ACCEPT,
    ...authenticationHandler.acceptEmailAuthenticationCode
  );
