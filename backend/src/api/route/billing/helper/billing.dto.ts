import {
  CreateCheckoutSessionRequestBody,
  CreateCheckoutSessionResponseBody,
  FindAllSubscriptionPlansResponseBody,
  FindCheckoutSessionByIdRequestParam,
  FindCheckoutSessionByIdResponseBody,
  FindSubscriptionPlanPathsByIdRequestParam,
  FindSubscriptionPlanPathsByIdResponseBody,
} from '@api-contracts/billing';
import { HTTP_STATUS_CODE, JSONResponse } from '@common';
import { z } from 'zod';

// -----------------------------------------------------------------
// Create Checkout Session Operation
// -----------------------------------------------------------------

export const CreateCheckoutSessionRequestBodySchema: z.Schema<CreateCheckoutSessionRequestBody> =
  z.object({
    planId: z.string(),
  });

export type CreateCheckoutSessionResponse = JSONResponse<
  CreateCheckoutSessionResponseBody,
  HTTP_STATUS_CODE.CREATED
>;

// -----------------------------------------------------------------
// Find Checkout Session by ID Operation
// -----------------------------------------------------------------

export const FindCheckoutSessionByIdRequestParamSchema: z.Schema<FindCheckoutSessionByIdRequestParam> =
  z.object({
    id: z.string(),
  });

export type FindCheckoutSessionByIdResponse = JSONResponse<
  FindCheckoutSessionByIdResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Find All Subscription Plans Operation
// -----------------------------------------------------------------

export type FindAllSubscriptionPlansResponse = JSONResponse<
  FindAllSubscriptionPlansResponseBody,
  HTTP_STATUS_CODE.OK
>;

// -----------------------------------------------------------------
// Find Subscription Plan Paths By ID Operation
// -----------------------------------------------------------------

export const FindSubscriptionPlanPathsByIdRequestParamSchema: z.Schema<FindSubscriptionPlanPathsByIdRequestParam> =
  z.object({
    id: z.string(),
  });

export type FindSubscriptionPlanPathsByIdResponse = JSONResponse<
  FindSubscriptionPlanPathsByIdResponseBody,
  HTTP_STATUS_CODE.OK
>;
