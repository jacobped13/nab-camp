import { HTTP_STATUS_CODE, JSONResponse } from '@common';
import { FindCurrentAccountResponseBody } from '@api-contracts/account';

// -----------------------------------------------------------------
// Find Current Account Operation
// -----------------------------------------------------------------

export type FindCurrentAccountResponse = JSONResponse<
  FindCurrentAccountResponseBody,
  HTTP_STATUS_CODE.OK
>;
