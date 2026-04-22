import {
  BusinessResult,
  injectExceptionDetails,
  logger,
  RESULT_ERROR_CODE,
} from '@common';
import { BillingProviderEventProcessor } from './helper/billing-provider-event.processor.dto';
import {
  CustomerSubscriptionCreatedEvent,
  CustomerSubscriptionDeletedEvent,
  CustomerSubscriptionUpdatedEvent,
  EventType,
  PriceCreateEvent,
  PriceDeleteEvent,
  PriceUpdateEvent,
  ProductCreateEvent,
  ProductDeleteEvent,
  ProductUpdateEvent,
  Event as StripeEvent,
} from '@lib/provider/billing/stripe';
import {
  mapStripePrice,
  mapStripeProduct,
  mapStripeSubscription,
  mapStripeSubscriptionItem,
} from '../provider/helper/billing.provider.util';
import * as billingBusinessService from '../business/billing.business.service';
import {
  ProviderPrice,
  ProviderProduct,
  ProviderSubscription,
  ProviderSubscriptionItem,
} from '../provider/helper/billing.provider.model';
import { extractBillingProviderResourceVersionFromEvent } from './helper/billing-provider-event.processor.util';

const LOG_PREFIX = 'Billing :: Processor :: StripeEventProcessor';

/**
 * Process the Stripe `customer.subscription.created` event.
 *
 * @returns The result of the event processing.
 */
const processCustomerSubscriptionCreatedEvent: BillingProviderEventProcessor<
  CustomerSubscriptionCreatedEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const event = input.event;
    const eventData = event.data;
    const subscription = eventData.object;
    const provider = input.provider;

    // Step 1: Construct our normalized provider objects
    const providerSubscription = mapStripeSubscription(
      subscription
    ) as ProviderSubscription;
    const providerSubscriptionItems = mapStripeSubscriptionItem(
      subscription.items.data
    ) as ProviderSubscriptionItem[];

    // Step 2: Validate that the subscription status is supported
    // If the status is NOT supported, we skip processing this event
    if (!providerSubscription.isSupportedStatus()) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    // Step 3: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 4: Hydrate the subscription connection
    const hydrateResult =
      await billingBusinessService._hydrateCustomerSubscriptionConnection(
        executionContext,
        {
          provider: provider,
          customerProviderId: providerSubscription.customerId,
          subscriptionProviderId: providerSubscription.id,
          subscriptionProviderVersion: providerVersion,
          subscriptionStatus: providerSubscription.status,
          cancelAt: providerSubscription.cancelAt,
        }
      );

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processCustomerSubscriptionCreatedEvent :: Failed to hydrate subscription connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateResultData = hydrateResult.data;

    // If the customer does NOT have a connection, we skip processing this event
    // since the customer is NOT managed by us
    if (!hydrateResultData) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const subscriptionConnectionEntity = hydrateResultData.connection;

    // Step 5: Hydrate the subscription item connections
    const hydrateItemsResult =
      await billingBusinessService._hydrateAllSubscriptionItemConnections(
        executionContext,
        {
          subscriptionId: subscriptionConnectionEntity.id,
          providerSubscriptionItems: providerSubscriptionItems.map((item) => ({
            providerId: item.id,
            providerVersion: providerVersion,
            providerPriceId: item.priceId,
            quantity: item.quantity,
            currentPeriodStartAt: item.currentPeriodStartAt,
            currentPeriodEndAt: item.currentPeriodEndAt,
          })),
        }
      );

    if (!hydrateItemsResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processCustomerSubscriptionCreatedEvent :: Failed to hydrate subscription item connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription item connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateItemsResultData = hydrateItemsResult.data;
    const hydratedItems = hydrateItemsResultData.results;
    const changedItems = hydratedItems.some(
      (item) => item.hydrated || item.created || item.deleted
    );

    // Step 6: Remove all previous terminal subscription connections
    const deleteResult =
      await billingBusinessService._deleteAllTerminalSubscriptionConnectionsByCustomerId(
        executionContext,
        {
          customerId: subscriptionConnectionEntity.customerId,
        }
      );

    if (!deleteResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processCustomerSubscriptionCreatedEvent :: Failed to delete terminal subscription connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to delete terminal subscription connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      processed: changedItems,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processCustomerSubscriptionCreatedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `customer.subscription.updated` event.
 *
 * @returns The result of the event processing.
 */
const processCustomerSubscriptionUpdatedEvent: BillingProviderEventProcessor<
  CustomerSubscriptionUpdatedEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const subscription = eventData.object;

    // Step 1: Construct our normalized provider subscription object
    const providerSubscription = mapStripeSubscription(
      subscription
    ) as ProviderSubscription;
    const providerSubscriptionItems = mapStripeSubscriptionItem(
      subscription.items.data
    ) as ProviderSubscriptionItem[];

    // Step 2: Validate that the subscription status is supported
    // If the status is NOT supported, we skip processing this event
    if (!providerSubscription.isSupportedStatus()) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    // Step 3: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 4: Hydrate the subscription connection
    const hydrateResult =
      await billingBusinessService._hydrateCustomerSubscriptionConnection(
        executionContext,
        {
          provider: provider,
          customerProviderId: providerSubscription.customerId,
          subscriptionProviderId: providerSubscription.id,
          subscriptionProviderVersion: providerVersion,
          subscriptionStatus: providerSubscription.status,
          cancelAt: providerSubscription.cancelAt,
        }
      );

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processCustomerSubscriptionUpdatedEvent :: Failed to hydrate subscription connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateResultData = hydrateResult.data;

    // If the customer does NOT have a connection, we skip processing this event
    // since the customer is NOT managed by us
    if (!hydrateResultData) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const subscriptionConnectionEntity = hydrateResultData.connection;

    // Step 5: Hydrate the subscription item connections
    const hydrateItemsResult =
      await billingBusinessService._hydrateAllSubscriptionItemConnections(
        executionContext,
        {
          subscriptionId: subscriptionConnectionEntity.id,
          providerSubscriptionItems: providerSubscriptionItems.map((item) => ({
            providerId: item.id,
            providerVersion: providerVersion,
            providerPriceId: item.priceId,
            quantity: item.quantity,
            currentPeriodStartAt: item.currentPeriodStartAt,
            currentPeriodEndAt: item.currentPeriodEndAt,
          })),
        }
      );

    if (!hydrateItemsResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processCustomerSubscriptionUpdatedEvent :: Failed to hydrate subscription item connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription item connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateItemsResultData = hydrateItemsResult.data;
    const hydratedItems = hydrateItemsResultData.results;
    const changedItems = hydratedItems.some(
      (item) => item.hydrated || item.created || item.deleted
    );

    return BusinessResult.ok({
      processed: changedItems,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processCustomerSubscriptionUpdatedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `customer.subscription.deleted` event.
 *
 * @returns The result of the event processing.
 */
const processCustomerSubscriptionDeletedEvent: BillingProviderEventProcessor<
  CustomerSubscriptionDeletedEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const subscription = eventData.object;

    // Step 1: Construct our normalized provider subscription object
    const providerSubscription = mapStripeSubscription(
      subscription
    ) as ProviderSubscription;

    // Step 2: Validate that the subscription status is supported
    // If the status is NOT supported, we skip processing this event
    if (!providerSubscription.isSupportedStatus()) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    // Step 3: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 4: Hydrate the subscription connection
    const hydrateResult =
      await billingBusinessService._hydrateCustomerSubscriptionConnection(
        executionContext,
        {
          provider: provider,
          customerProviderId: providerSubscription.customerId,
          subscriptionProviderId: providerSubscription.id,
          subscriptionProviderVersion: providerVersion,
          subscriptionStatus: providerSubscription.status,
          cancelAt: providerSubscription.cancelAt,
        }
      );

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processCustomerSubscriptionDeletedEvent :: Failed to hydrate subscription connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateResultData = hydrateResult.data;

    // If the customer does NOT have a connection, we skip processing this event
    // since the customer is NOT managed by us
    if (!hydrateResultData) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const hydrated = hydrateResultData.hydrated;
    const created = hydrateResultData.created;

    return BusinessResult.ok({
      processed: hydrated || created,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processCustomerSubscriptionDeletedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `product.created` event.
 *
 * @returns The result of the event processing.
 */
const processProductCreatedEvent: BillingProviderEventProcessor<
  ProductCreateEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const product = eventData.object;

    // Step 1: Construct our normalized provider product object
    const providerProduct = mapStripeProduct(product) as ProviderProduct;

    // Step 2: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 3: Hydrate the product connection
    const hydrateResult =
      await billingBusinessService._hydrateProductConnection(executionContext, {
        provider: provider,
        providerId: providerProduct.id,
        providerVersion: providerVersion,
        status: providerProduct.status,
      });

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processProductCreatedEvent :: Failed to hydrate product connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate product connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateResultData = hydrateResult.data;
    const hydrated = hydrateResultData.hydrated;
    const created = hydrateResultData.created;

    return BusinessResult.ok({
      processed: hydrated || created,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processProductCreatedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `product.updated` event.
 *
 * @returns The result of the event processing.
 */
const processProductUpdatedEvent: BillingProviderEventProcessor<
  ProductUpdateEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const product = eventData.object;

    // Step 1: Construct our normalized provider product object
    const providerProduct = mapStripeProduct(product) as ProviderProduct;

    // Step 2: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 3: Hydrate the product connection
    const hydrateResult =
      await billingBusinessService._hydrateProductConnection(executionContext, {
        provider: provider,
        providerId: providerProduct.id,
        providerVersion: providerVersion,
        status: providerProduct.status,
      });

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processProductUpdatedEvent :: Failed to hydrate product connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate product connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydrateResultData = hydrateResult.data;
    const hydrated = hydrateResultData.hydrated;
    const created = hydrateResultData.created;

    return BusinessResult.ok({
      processed: hydrated || created,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processProductUpdatedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `product.deleted` event.
 *
 * @returns The result of the event processing.
 */
const processProductDeletedEvent: BillingProviderEventProcessor<
  ProductDeleteEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const product = eventData.object;

    // Step 1: Construct our normalized provider product object
    const providerProduct = mapStripeProduct(product) as ProviderProduct;

    // Step 2: Find the product connection by provider ID
    const productResult =
      await billingBusinessService._findProductConnectionByProvider(
        executionContext,
        {
          provider: provider,
          providerId: providerProduct.id,
        }
      );

    if (!productResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processProductDeletedEvent :: Failed to find product connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find product connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const productConnectionData = productResult.data;

    // If a product connection does not exist, we cannot proceed
    if (!productConnectionData) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const productConnection = productConnectionData.connection;
    const productConnectionId = productConnection.id;

    // Step 3: Delete the product connection
    const deleteResult = await billingBusinessService._deleteProductConnection(
      executionContext,
      {
        productId: productConnectionId,
      }
    );

    if (!deleteResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processProductDeletedEvent :: Failed to delete product connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to delete product connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      processed: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processProductDeletedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `price.created` event.
 *
 * @returns The result of the event processing.
 */
const processPriceCreatedEvent: BillingProviderEventProcessor<
  PriceCreateEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const price = eventData.object;

    // Step 1: Construct our normalized provider price object
    const providerPrice = mapStripePrice(price) as ProviderPrice;

    // Step 2: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 3: Hydrate the price connection
    const hydrateResult = await billingBusinessService._hydratePriceConnection(
      executionContext,
      {
        provider: provider,
        providerId: providerPrice.id,
        providerVersion: providerVersion,
        providerProductId: providerPrice.productId,
        providerUnitAmount: providerPrice.unitAmount,
        status: providerPrice.status,
      }
    );

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processPriceCreatedEvent :: Failed to hydrate price connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // If the price connection does not exist, we skip processing this event
    if (!hydrateResult.data) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const hydrateResultData = hydrateResult.data;
    const hydrated = hydrateResultData.hydrated;
    const created = hydrateResultData.created;

    return BusinessResult.ok({
      processed: hydrated || created,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processPriceCreatedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `price.updated` event.
 *
 * @returns The result of the event processing.
 */
const processPriceUpdatedEvent: BillingProviderEventProcessor<
  PriceUpdateEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const price = eventData.object;

    // Step 1: Construct our normalized provider price object
    const providerPrice = mapStripePrice(price) as ProviderPrice;

    // Step 2: Extract the resource version from the event
    const providerVersion = extractBillingProviderResourceVersionFromEvent(
      provider,
      event
    );

    // Step 3: Hydrate the price connection
    const hydrateResult = await billingBusinessService._hydratePriceConnection(
      executionContext,
      {
        provider: provider,
        providerId: providerPrice.id,
        providerVersion: providerVersion,
        providerProductId: providerPrice.productId,
        providerUnitAmount: providerPrice.unitAmount,
        status: providerPrice.status,
      }
    );

    if (!hydrateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processPriceUpdatedEvent :: Failed to hydrate price connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // If the price connection does not exist, we skip processing this event
    if (!hydrateResult.data) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const hydrateResultData = hydrateResult.data;
    const hydrated = hydrateResultData.hydrated;
    const created = hydrateResultData.created;

    return BusinessResult.ok({
      processed: hydrated || created,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processPriceUpdatedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process the Stripe `price.deleted` event.
 *
 * @returns The result of the event processing.
 */
const processPriceDeletedEvent: BillingProviderEventProcessor<
  PriceDeleteEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const event = input.event;
    const eventData = event.data;
    const price = eventData.object;

    // Step 1: Construct our normalized provider price object
    const providerPrice = mapStripePrice(price) as ProviderPrice;

    // Step 2: Find the price connection by provider ID
    const priceResult =
      await billingBusinessService._findPriceConnectionByProvider(
        executionContext,
        {
          provider: provider,
          providerId: providerPrice.id,
        }
      );

    if (!priceResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processPriceDeletedEvent :: Failed to find price connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceConnectionData = priceResult.data;

    // If a price connection does not exist, we cannot proceed
    if (!priceConnectionData) {
      return BusinessResult.ok({
        processed: false,
      });
    }

    const priceConnection = priceConnectionData.connection;
    const priceConnectionId = priceConnection.id;

    // Step 3: Delete the price connection
    const deleteResult = await billingBusinessService._deletePriceConnection(
      executionContext,
      {
        priceId: priceConnectionId,
      }
    );

    if (!deleteResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processPriceDeletedEvent :: Failed to delete price connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to delete price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      processed: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processPriceDeletedEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Process Stripe events.
 *
 * @returns The result of the event processing.
 */
export const processEvent: BillingProviderEventProcessor<StripeEvent> = async (
  executionContext,
  input
) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const eventType: EventType = input.event.type;

    // Step 1: Find the processor for the event type
    let processor: BillingProviderEventProcessor<StripeEvent> | undefined;

    switch (eventType) {
      case 'customer.subscription.created':
        processor =
          processCustomerSubscriptionCreatedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'customer.subscription.updated':
        processor =
          processCustomerSubscriptionUpdatedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'customer.subscription.deleted':
        processor =
          processCustomerSubscriptionDeletedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'product.created':
        processor =
          processProductCreatedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'product.updated':
        processor =
          processProductUpdatedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'product.deleted':
        processor =
          processProductDeletedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'price.created':
        processor =
          processPriceCreatedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'price.updated':
        processor =
          processPriceUpdatedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
      case 'price.deleted':
        processor =
          processPriceDeletedEvent as BillingProviderEventProcessor<StripeEvent>;
        break;
    }

    // Step 2: Check if a processor exists for the Stripe event type
    // Return a success result if no processor is found to avoid reprocessing
    if (!processor) {
      logger.warn(
        `${LOG_PREFIX} :: processEvent :: No processor found for Stripe event type`,
        {
          eventType: eventType,
        }
      );
      return BusinessResult.ok({
        processed: false,
      });
    }

    // Step 6: Process the event using the provider processor
    const processorResult = await processor(executionContext, input);

    if (!processorResult.isSuccess()) {
      logger.error(`${LOG_PREFIX} :: processEvent :: Failed to process event`, {
        input: input,
        context: loggingContext,
      });
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to process event',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      processed: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};
