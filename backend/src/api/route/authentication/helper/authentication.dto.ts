import { z } from 'zod';
import {
  AcceptEmailAuthenticationCodeRequestBody,
  AcceptEmailAuthenticationCodeResponseBody,
  SendEmailAuthenticationCodeRequestBody,
  SendEmailAuthenticationCodeResponseBody,
} from '@api-contracts/authentication';
import { HTTP_STATUS_CODE, JSONResponse } from '@common';

// -----------------------------------------------------------------
// Send Email Authentication Code Operation
// -----------------------------------------------------------------

export const SendEmailAuthenticationCodeRequestBodySchema: z.Schema<SendEmailAuthenticationCodeRequestBody> =
  z.object({
    email: z.string().email(),
  });

export type SendEmailAuthenticationCodeResponse = JSONResponse<
  SendEmailAuthenticationCodeResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Accept Email Authentication Code Operation
// -----------------------------------------------------------------

export const AcceptEmailAuthenticationCodeRequestBodySchema: z.Schema<AcceptEmailAuthenticationCodeRequestBody> =
  z.object({
    email: z.string().email(),
    code: z.string().min(6).max(6),
  });

export type AcceptEmailAuthenticationCodeResponse = JSONResponse<
  AcceptEmailAuthenticationCodeResponseBody,
  HTTP_STATUS_CODE.OK
>;
