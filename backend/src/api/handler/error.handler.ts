import { ErrorHandler } from 'hono';
import { InternalServerErrorException, HTTPException } from '@common';

/**
 * Handler responsible for catching and processing any errors that occur during the request.
 */
export const errorHandler: ErrorHandler = (error) => {
  // Return response for HTTP exceptions
  if (error instanceof HTTPException) {
    return error.toJSONResponse();
  }

  // Fall back to internal server error if error is unknown
  return new InternalServerErrorException(
    'An unknown error occurred'
  ).toJSONResponse();
};
