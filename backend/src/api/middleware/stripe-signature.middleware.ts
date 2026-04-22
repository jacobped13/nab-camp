import {
  BadRequestException,
  createMiddleware,
  ExecutionContext,
  HTTPException,
  injectExceptionDetails,
  InternalServerErrorException,
  logger,
} from '@common';
import {
  stripeService,
  STRIPE_SIGNATURE_HEADER,
  Event as StripeEvent,
} from '@lib/provider/billing/stripe';
import { isDevelopmentEnvironment } from '@env';

const LOG_PREFIX = 'API :: Middleware :: StripeSignatureMiddleware';

/**
 * Middleware responsible for validating the Stripe signature
 * and ensuring that the request is a valid Stripe webhook event.
 * The validated event data is added to the request context.
 */
export const stripeSignatureMiddleware = () => {
  return createMiddleware<{
    out: {
      json: StripeEvent;
    };
  }>(async (requestContext, next) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // Step 1: Check if the environment is development
      // If in development, skip signature verification
      if (isDevelopmentEnvironment()) {
        logger.warn(
          `${LOG_PREFIX} :: stripeSignatureMiddleware :: Skipping Stripe signature verification in development environment`
        );

        const body = await requestContext.req.json();

        // Add the body to the request context as validated data
        requestContext.req.addValidatedData('json', body);

        return await next();
      }

      // Step 2: Ensure that the Stripe signature header is present
      const signature = requestContext.req.header(STRIPE_SIGNATURE_HEADER);

      if (!signature) {
        logger.warn(
          `${LOG_PREFIX} :: stripeSignatureMiddleware :: Missing Stripe signature header`,
          {
            context: loggingContext,
          }
        );
        throw new BadRequestException('Missing Stripe signature header');
      }

      // Step 3: Extract the request data using the stripe signature
      const body = await requestContext.req.text();
      const event = await stripeService.constructEvent(body, signature);

      // Step 4: Add the event data to the request context
      requestContext.req.addValidatedData('json', event);

      return await next();
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: stripeSignatureMiddleware :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  });
};
