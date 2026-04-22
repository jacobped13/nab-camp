import { TypedResponse } from 'hono';
import { StatusCode } from 'hono/utils/http-status';
import { JSONValue } from 'hono/utils/types';
import { StatusCodes as HTTP_STATUS_CODE } from 'http-status-codes';

export {
  StatusCodes as HTTP_STATUS_CODE,
  ReasonPhrases as HTTP_STATUS_REASON_PHRASE,
  getStatusCode,
  getReasonPhrase,
} from 'http-status-codes';

/**
 * Utility type for strongy typed JSON responses
 */
export type JSONResponse<
  D extends JSONValue,
  S extends StatusCode = HTTP_STATUS_CODE.OK,
> = TypedResponse<D, S, 'json'>;
