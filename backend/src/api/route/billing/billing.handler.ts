import {
  HTTP_STATUS_CODE,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  createHandler,
  HTTPException,
  InternalServerErrorException,
  ACTOR_TYPE,
  NotFoundException,
  transformResultErrorCodeToHTTPStatusCode,
} from '@common';
import { actorMiddleware } from '@api/middleware/actor.middleware';
import {
  CreateCheckoutSessionRequestBodySchema,
  CreateCheckoutSessionResponse,
  FindAllSubscriptionPlansResponse,
  FindCheckoutSessionByIdRequestParamSchema,
  FindCheckoutSessionByIdResponse,
  FindSubscriptionPlanPathsByIdRequestParamSchema,
  FindSubscriptionPlanPathsByIdResponse,
} from './helper/billing.dto';
import { zodValidationMiddleware } from '@api/middleware/zod-validation.middleware';
import { workspaceBusinessService } from '@service/workspace';
import {
  mapCheckoutSessionResponse,
  mapSubscriptionPlanResponse,
} from './helper/billing.util';
import { CheckoutSession, SubscriptionPlan } from '@api-contracts/billing';
import { accountStateMiddleware } from '@api/middleware/account-state.middleware';
import { stripeSignatureMiddleware } from '@api/middleware/stripe-signature.middleware';
import { ACCOUNT_STATE } from '@service/account';
import {
  BILLING_PROVIDER,
  billingBusinessService,
  billingProviderEventProcessor,
} from '@service/billing';
import { TIMING } from '@shared-lib/timing';

const LOG_PREFIX = 'API :: Billing :: BillingHandler';

// -----------------------------------------------------------------
// Create Checkout Session
// -----------------------------------------------------------------

export const createCheckoutSession = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  accountStateMiddleware(ACCOUNT_STATE.REGISTRATION, ACCOUNT_STATE.INACTIVE),
  zodValidationMiddleware('json', CreateCheckoutSessionRequestBodySchema),
  async (requestContext): Promise<CreateCheckoutSessionResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');
      const planId = parsedInput.planId;

      // TODO: Add support for quantity input
      const quantity = 1;

      // TODO: Add account state middleware to gaurentee workspace data is available
      const workspaceId = executionContext.account!.workspaceId!;

      const checkoutSessionResult =
        await workspaceBusinessService.createAccessSubscriptionCheckoutSession(
          executionContext,
          {
            workspaceId: workspaceId,
            planId: planId,
            quantity: quantity,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a checkout session to be created.
      if (!checkoutSessionResult.isSuccess()) {
        const primaryError = checkoutSessionResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const checkoutSessionResponse = mapCheckoutSessionResponse(
        checkoutSessionResult.data.session
      ) as CheckoutSession;

      return requestContext.json(
        {
          session: checkoutSessionResponse,
        },
        HTTP_STATUS_CODE.CREATED
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: createCheckoutSession :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find Subscription Session by ID
// -----------------------------------------------------------------

export const findCheckoutSessionById = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', FindCheckoutSessionByIdRequestParamSchema),
  async (requestContext): Promise<FindCheckoutSessionByIdResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const sessionId = parsedParams.id;

      // TODO: Add account state middleware to gaurentee workspace data is available
      const workspaceId = executionContext.account!.workspaceId!;

      const checkoutSessionResult =
        await workspaceBusinessService.findWorkspaceCheckoutSessionById(
          executionContext,
          {
            sessionId: sessionId,
            workspaceId: workspaceId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a checkout session to be found.
      if (!checkoutSessionResult.isSuccess()) {
        const primaryError = checkoutSessionResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }
      const checkoutSessionData = checkoutSessionResult.data;

      if (!checkoutSessionData) {
        throw new NotFoundException(
          'Failed to find checkout session by the provided ID'
        );
      }

      const checkoutSessionResponse = mapCheckoutSessionResponse(
        checkoutSessionData.session
      ) as CheckoutSession;

      return requestContext.json(
        {
          session: checkoutSessionResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findCheckoutSessionById :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Process Stripe Webhook Event
// -----------------------------------------------------------------

export const processStripeEvent = createHandler(
  stripeSignatureMiddleware(),
  async (requestContext) => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const event = requestContext.req.valid('json');
      const provider = BILLING_PROVIDER.STRIPE;
      const providerId = event.id;
      const publishedAt = new Date(
        event.created * TIMING.SECOND.IN_MILLISECONDS
      );

      const processingResult = await billingProviderEventProcessor.processEvent(
        executionContext,
        {
          provider: provider,
          providerId: providerId,
          publishedAt: publishedAt,
          event: event,
        }
      );

      if (!processingResult.isSuccess()) {
        const primaryError = processingResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const processedEventData = processingResult.data;
      const processedEvent = processedEventData.processed;

      return requestContext.json(
        {
          processed: processedEvent,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: processStripeEvent :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find All Subscription Plans
// -----------------------------------------------------------------

export const findAllSubscriptionPlans = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  async (requestContext): Promise<FindAllSubscriptionPlansResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const subscriptionPlanResult =
        await workspaceBusinessService._findAllAccessSubscriptionPlans(
          executionContext
        );

      if (!subscriptionPlanResult.isSuccess()) {
        const primaryError = subscriptionPlanResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const subscriptionPlanResultData = subscriptionPlanResult.data;
      const subscriptionPlans = subscriptionPlanResultData.plans;

      const subscriptionPlansResponses = mapSubscriptionPlanResponse(
        subscriptionPlans
      ) as SubscriptionPlan[];

      return requestContext.json(
        {
          plans: subscriptionPlansResponses,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findAllSubscriptionPlans :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find Subscription Plan Paths by ID
// -----------------------------------------------------------------

export const findSubscriptionPlanPathsById = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    FindSubscriptionPlanPathsByIdRequestParamSchema
  ),
  async (requestContext): Promise<FindSubscriptionPlanPathsByIdResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const planId = parsedParams.id;

      // TODO: Create a dedicated service function in the workspace service
      const subscriptionPlanPathsResult =
        await billingBusinessService._findAllAvailableSubscriptionPlansByPlanId(
          executionContext,
          {
            planId: planId,
            // TODO: Add support for quantity input
            quantity: 1,
          }
        );

      if (!subscriptionPlanPathsResult.isSuccess()) {
        const primaryError = subscriptionPlanPathsResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const subscriptionPlanPathsData = subscriptionPlanPathsResult.data;

      // Family paths
      const familyUpgrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.familyPaths.upgrades
      ) as SubscriptionPlan[];
      const familyDowngrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.familyPaths.downgrades
      ) as SubscriptionPlan[];
      const familySidegrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.familyPaths.sidegrades
      ) as SubscriptionPlan[];

      // Price paths
      const priceUpgrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.pricePaths.upgrades
      ) as SubscriptionPlan[];
      const priceDowngrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.pricePaths.downgrades
      ) as SubscriptionPlan[];
      const priceSidegrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.pricePaths.sidegrades
      ) as SubscriptionPlan[];

      // Frequency paths
      const frequencyUpgrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.frequencyPaths.upgrades
      ) as SubscriptionPlan[];
      const frequencyDowngrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.frequencyPaths.downgrades
      ) as SubscriptionPlan[];
      const frequencySidegrades = mapSubscriptionPlanResponse(
        subscriptionPlanPathsData.frequencyPaths.sidegrades
      ) as SubscriptionPlan[];

      return requestContext.json(
        {
          familyDowngrades: familyDowngrades,
          familyUpgrades: familyUpgrades,
          familySidegrades: familySidegrades,
          priceDowngrades: priceDowngrades,
          priceUpgrades: priceUpgrades,
          priceSidegrades: priceSidegrades,
          frequencyDowngrades: frequencyDowngrades,
          frequencyUpgrades: frequencyUpgrades,
          frequencySidegrades: frequencySidegrades,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findSubscriptionPlanPathsById :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);
