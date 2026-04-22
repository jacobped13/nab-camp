import { ZodSchema } from 'zod';
import type { ValidationTargets } from 'hono';
import { BadRequestException } from '@common';
import { zValidator } from '@hono/zod-validator';

/**
 * Middleware responsible for using ZOD to parse the request body.
 */
export const zodValidationMiddleware = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new BadRequestException(`Invalid input ${target} data`);
    }
  });
