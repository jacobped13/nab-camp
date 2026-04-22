import { z } from 'zod';
import {
  CreateUserRequestBody,
  CreateUserResponseBody,
  UpdateUserRequestBody,
  UpdateUserRequestParam,
  UpdateUserResponseBody,
} from '@api-contracts/user';
import { HTTP_STATUS_CODE, JSONResponse } from '@common';

// -----------------------------------------------------------------
// Create User Operation
// -----------------------------------------------------------------

export const CreateUserRequestBodySchema: z.Schema<CreateUserRequestBody> =
  z.object({
    firstName: z.string(),
    lastName: z.string(),
  });

export type CreateUserResponse = JSONResponse<
  CreateUserResponseBody,
  HTTP_STATUS_CODE.CREATED
>;

// -----------------------------------------------------------------
// Update User Operation
// -----------------------------------------------------------------

export const UpdateUserRequestParamSchema: z.Schema<UpdateUserRequestParam> =
  z.object({
    id: z.string().uuid(),
  });

export const UpdateUserRequestBodySchema: z.Schema<UpdateUserRequestBody> = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
  })
  .refine(
    (data) => {
      if (!data.firstName && !data.lastName) {
        return false;
      }
      return true;
    },
    {
      message: 'Must provide at least one field to update',
    }
  );

export type UpdateUserResponse = JSONResponse<
  UpdateUserResponseBody,
  HTTP_STATUS_CODE.OK
>;
