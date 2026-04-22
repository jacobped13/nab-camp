import Stripe from 'stripe';
import { env } from '@env';
import { injectExceptionDetails, logger, Nullable } from '@common';
import {
  BillingPortalSession,
  calculateProrationBehavior,
  CheckoutSession,
  createCheckoutSessionRedirectUrl,
  Customer,
  Invoice,
  INVOICE_STATUSES,
  InvoiceStatus,
  MAX_STRIPE_QUERY_LIMIT,
  Price,
  Product,
  Event as StripeEvent,
  Subscription,
  SubscriptionItem,
} from './helper';
import {
  CursorPaginationInputDto,
  CursorPaginationOutputDto,
  PAGINATION_DIRECTION,
} from '@lib/util/pagination.util';

const LOG_PREFIX = 'Lib :: Provider :: Billing :: Stripe';

// -----------------------------------------------------------------
// Client
// -----------------------------------------------------------------

const client = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

// -----------------------------------------------------------------
// Functions
// -----------------------------------------------------------------

export const createSubscriptionEmbeddedCheckoutSession = async (
  customerId: string,
  priceId: string,
  quantity: number,
  returnUrl: string
): Promise<CheckoutSession> => {
  try {
    return await client.checkout.sessions.create({
      ui_mode: 'custom',
      mode: 'subscription',
      subscription_data: {
        billing_mode: {
          type: 'flexible',
        },
      },
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      return_url: createCheckoutSessionRedirectUrl(returnUrl, 'session_id'),
      customer: customerId,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: createSubscriptionEmbeddedCheckoutSession :: An unknown error occurred`,
      injectExceptionDetails(error, {
        customerId: customerId,
        returnUrl: returnUrl,
        priceId: priceId,
        quantity: quantity,
      })
    );
    throw new Error('Failed to create checkout session');
  }
};

export const findCheckoutSessionById = async (
  sessionId: string
): Promise<Nullable<CheckoutSession>> => {
  try {
    return (await client.checkout.sessions.retrieve(
      sessionId
    )) as CheckoutSession;
  } catch (error) {
    // If the session is not found, return null
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return null;
    }
    logger.error(
      `${LOG_PREFIX} :: findCheckoutSessionById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        sessionId: sessionId,
      })
    );
    throw new Error('Failed to find checkout session by ID');
  }
};

export const createCustomer = async (email?: string): Promise<Customer> => {
  try {
    return await client.customers.create({
      email: email,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: createCustomer :: An unknown error occurred`,
      injectExceptionDetails(error, {
        email: email,
      })
    );
    throw new Error('Failed to create customer');
  }
};

export const findCustomerById = async (
  customerId: string
): Promise<Nullable<Customer>> => {
  try {
    return (await client.customers.retrieve(customerId)) as Customer;
  } catch (error) {
    // If the customer is not found, return null
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return null;
    }
    logger.error(
      `${LOG_PREFIX} :: findCustomerById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        customerId: customerId,
      })
    );
    throw new Error('Failed to find customer by ID');
  }
};

export const constructEvent = async (
  body: string,
  signature: string
): Promise<StripeEvent> => {
  try {
    return await client.webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: constructEvent :: An unknown error occurred`,
      injectExceptionDetails(error, {
        body: body,
        signature: signature,
      })
    );
    throw new Error('Failed to construct webhook event');
  }
};

export const findAllProducts = async (): Promise<Product[]> => {
  try {
    const products: Product[] = [];

    for await (const product of client.products.list({
      limit: MAX_STRIPE_QUERY_LIMIT,
    })) {
      products.push(product);
    }

    return products;
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: findAllProducts :: An unknown error occurred`,
      injectExceptionDetails(error)
    );
    throw new Error('Failed to find all products');
  }
};

export const findAllPrices = async (): Promise<Price[]> => {
  try {
    const prices: Price[] = [];

    for await (const price of client.prices.list({
      limit: MAX_STRIPE_QUERY_LIMIT,
    })) {
      prices.push(price);
    }

    return prices;
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: findAllPrices :: An unknown error occurred`,
      injectExceptionDetails(error)
    );
    throw new Error('Failed to find all prices');
  }
};

export const cancelSubscriptionAtPeriodEnd = async (
  subscriptionId: string
): Promise<Subscription> => {
  try {
    return await client.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: cancelSubscriptionAtPeriodEnd :: An unknown error occurred`,
      injectExceptionDetails(error, {
        subscriptionId: subscriptionId,
      })
    );
    throw new Error('Failed to cancel subscription at period end');
  }
};

export const resumeCancelledSubscription = async (
  subscriptionId: string
): Promise<Subscription> => {
  try {
    return await client.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: resumeCancelledSubscription :: An unknown error occurred`,
      injectExceptionDetails(error, {
        subscriptionId: subscriptionId,
      })
    );
    throw new Error('Failed to resume cancelled subscription');
  }
};

export const createPaymentMethodManagementSession = async (
  customerId: string,
  returnUrl: string
): Promise<BillingPortalSession> => {
  try {
    return await client.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: createPaymentMethodManagementSession :: An unknown error occurred`,
      injectExceptionDetails(error, {
        customerId: customerId,
        returnUrl: returnUrl,
      })
    );
    throw new Error('Failed to create payment method management session');
  }
};

export const updateSubscriptionItemPrice = async (
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  quantity: number,
  prorate: boolean,
  chargeImmediately: boolean,
  resetBillingCycle: boolean
): Promise<SubscriptionItem> => {
  try {
    const prorationBehavior = calculateProrationBehavior(
      prorate,
      chargeImmediately
    );

    const subscription = await client.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: priceId,
          quantity: quantity,
        },
      ],
      proration_behavior: prorationBehavior,
      payment_behavior: 'error_if_incomplete',
      billing_cycle_anchor: resetBillingCycle ? 'now' : undefined,
    });

    return subscription.items.data.find((item) => {
      return item.id === subscriptionItemId;
    })!;
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: updateSubscriptionItemPrice :: An unknown error occurred`,
      injectExceptionDetails(error, {
        subscriptionItemId: subscriptionItemId,
        priceId: priceId,
      })
    );
    throw new Error('Failed to update subscription item price');
  }
};

export const previewSubscriptionItemPriceChange = async (
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  quantity: number,
  prorate: boolean,
  chargeImmediately: boolean,
  resetBillingCycle: boolean
): Promise<Invoice> => {
  try {
    const prorationBehavior = calculateProrationBehavior(
      prorate,
      chargeImmediately
    );

    return await client.invoices.createPreview({
      subscription: subscriptionId,
      subscription_details: {
        items: [
          {
            id: subscriptionItemId,
            price: priceId,
            quantity: quantity,
          },
        ],
        proration_behavior: prorationBehavior,
        billing_cycle_anchor: resetBillingCycle ? 'now' : undefined,
      },
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: previewSubscriptionItemPriceChange :: An unknown error occurred`,
      injectExceptionDetails(error, {
        subscriptionId: subscriptionId,
        subscriptionItemId: subscriptionItemId,
        priceId: priceId,
        quantity: quantity,
        prorate: prorate,
        chargeImmediately: chargeImmediately,
        resetBillingCycle: resetBillingCycle,
      })
    );
    throw new Error('Failed to preview subscription item price change');
  }
};

export const cursorPaginateCustomerInvoices = async (
  customerId: string,
  pagination: CursorPaginationInputDto,
  filter?: {
    status?: InvoiceStatus[];
  }
): Promise<CursorPaginationOutputDto<Invoice>> => {
  // Arrange filters
  const statuses = filter?.status ?? INVOICE_STATUSES;
  const statusSet = new Set(statuses);

  // Retrieve all invoices for the customer
  const allInvoices: Invoice[] = [];

  for await (const invoice of client.invoices.list({
    customer: customerId,
    limit: MAX_STRIPE_QUERY_LIMIT,
  })) {
    const isSupportedStatus = statusSet.has(invoice.status as InvoiceStatus);

    const queryFilters: boolean[] = [isSupportedStatus];
    const isQueryMatch = queryFilters.every(Boolean);

    if (isQueryMatch) {
      allInvoices.push(invoice);
    }
  }

  const totalCount = allInvoices.length;
  const cursorId = pagination.cursor;
  const limit = pagination.limit;
  const direction = pagination.direction;

  const cursorIndex = allInvoices.findIndex(
    (invoice) => invoice.id === cursorId
  );

  // Determine the slice of data to return
  let startIndex: number;
  let endIndex: number;

  if (direction === PAGINATION_DIRECTION.FORWARD) {
    // Start after the cursor, or at the beginning if no cursor
    startIndex = cursorIndex === -1 ? 0 : cursorIndex + 1;
    endIndex = startIndex + limit;
  } else {
    // End before the cursor, or at the end if no cursor
    endIndex = cursorIndex === -1 ? totalCount : cursorIndex;
    startIndex = endIndex - limit;
  }

  // Clamp indices to valid bounds and slice
  const normalizedStartIndex = Math.max(0, startIndex);
  const normalizedEndIndex = Math.min(totalCount, endIndex);
  const nodes = allInvoices.slice(normalizedStartIndex, normalizedEndIndex);

  const hasNextPage = normalizedEndIndex < totalCount;
  const hasPreviousPage = normalizedStartIndex > 0;

  const startCursor = nodes[0]?.id ?? null;
  const endCursor = nodes[nodes.length - 1]?.id ?? null;

  return {
    nodes: nodes,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
    totalCount: totalCount,
    startCursor: startCursor,
    endCursor: endCursor,
  };
};
