import { NotFoundHandler } from 'hono';
import { NotFoundException } from '@common';

/**
 * Handler responsible for processing requests that do not match a supported API route.
 */
export const notFoundHandler: NotFoundHandler = () => {
  return new NotFoundException(
    'Requested path does not exist'
  ).toJSONResponse();
};
