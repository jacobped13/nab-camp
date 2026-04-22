import { logger, Nullable } from '@common';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_INVOICE_STATUS,
} from '../common/billing.constant';
import { stripeService } from '@lib/provider/billing/stripe';
import {
  ProviderBillingManagementSession,
  ProviderCheckoutSession,
  ProviderCustomer,
  ProviderInvoice,
  ProviderSubscription,
  ProviderSubscriptionItem,
} from './helper/billing.provider.model';
import {
  mapStripeBillingManagementSession,
  mapStripeCheckoutSession,
  mapStripeCustomer,
  mapStripeInvoice,
  mapStripeSubscription,
  mapStripeSubscriptionItem,
  transformOrThrowProviderInvoiceStatusToStripe,
} from './helper/billing.provider.util';
import {
  CursorPaginationInputDto,
  CursorPaginationOutputDto,
} from '@lib/util/pagination.util';

const LOG_PREFIX = 'Service :: Authentication :: BillingProviderService';

const findStripeCustomerById = async (
  id: string
): Promise<Nullable<ProviderCustomer>> => {
  return mapStripeCustomer(
    await stripeService.findCustomerById(id)
  ) as Nullable<ProviderCustomer>;
};

export const findProviderCustomerById = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<ProviderCustomer>> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await findStripeCustomerById(providerId);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: findProviderCustomerById :: Unsupported provider`,
        {
          provider: provider,
          providerId: providerId,
        }
      );
      return null;
    }
  }
};

const createStripeCustomer = async (
  email?: string
): Promise<ProviderCustomer> => {
  return mapStripeCustomer(
    await stripeService.createCustomer(email)
  ) as ProviderCustomer;
};

export const createProviderCustomer = async (
  provider: BILLING_PROVIDER,
  email?: string
): Promise<ProviderCustomer> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await createStripeCustomer(email);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: createProviderCustomer :: Unsupported provider`,
        {
          provider: provider,
          email: email,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

const createStripeSubscriptionCheckoutSession = async (
  customerId: string,
  priceId: string,
  quantity: number,
  redirectUrl: string
): Promise<ProviderCheckoutSession> => {
  return mapStripeCheckoutSession(
    await stripeService.createSubscriptionEmbeddedCheckoutSession(
      customerId,
      priceId,
      quantity,
      redirectUrl
    )
  ) as ProviderCheckoutSession;
};

export const createProviderSubscriptionCheckoutSession = async (
  provider: BILLING_PROVIDER,
  customerId: string,
  priceId: string,
  quantity: number,
  redirectUrl: string
): Promise<ProviderCheckoutSession> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await createStripeSubscriptionCheckoutSession(
        customerId,
        priceId,
        quantity,
        redirectUrl
      );
    default: {
      logger.warn(
        `${LOG_PREFIX} :: createProviderSubscriptionCheckoutSession :: Unsupported provider`,
        {
          provider: provider,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

const findStripeCheckoutSessionById = async (
  sessionId: string
): Promise<Nullable<ProviderCheckoutSession>> => {
  return mapStripeCheckoutSession(
    await stripeService.findCheckoutSessionById(sessionId)
  ) as Nullable<ProviderCheckoutSession>;
};

export const findProviderCheckoutSessionById = async (
  provider: BILLING_PROVIDER,
  sessionId: string
): Promise<Nullable<ProviderCheckoutSession>> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await findStripeCheckoutSessionById(sessionId);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: findProviderCheckoutSessionById :: Unsupported provider`,
        {
          provider: provider,
          sessionId: sessionId,
        }
      );
      return null;
    }
  }
};

const cancelStripeSubscriptionAtPeriodEnd = async (
  subscriptionId: string
): Promise<ProviderSubscription> => {
  return mapStripeSubscription(
    await stripeService.cancelSubscriptionAtPeriodEnd(subscriptionId)
  ) as ProviderSubscription;
};

export const cancelProviderSubscriptionAtPeriodEnd = async (
  provider: BILLING_PROVIDER,
  subscriptionId: string
): Promise<ProviderSubscription> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await cancelStripeSubscriptionAtPeriodEnd(subscriptionId);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: cancelProviderSubscriptionAtPeriodEnd :: Unsupported provider`,
        {
          provider: provider,
          subscriptionId: subscriptionId,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

const resumeCancelledStripeSubscription = async (
  subscriptionId: string
): Promise<ProviderSubscription> => {
  return mapStripeSubscription(
    await stripeService.resumeCancelledSubscription(subscriptionId)
  ) as ProviderSubscription;
};

export const resumeCancelledProviderSubscription = async (
  provider: BILLING_PROVIDER,
  subscriptionId: string
): Promise<ProviderSubscription> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await resumeCancelledStripeSubscription(subscriptionId);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: resumeCancelledProviderSubscription :: Unsupported provider`,
        {
          provider: provider,
          subscriptionId: subscriptionId,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

const createStripePaymentMethodManagementSession = async (
  customerId: string,
  returnUrl: string
): Promise<ProviderBillingManagementSession> => {
  return mapStripeBillingManagementSession(
    await stripeService.createPaymentMethodManagementSession(
      customerId,
      returnUrl
    )
  ) as ProviderBillingManagementSession;
};

export const createProviderPaymentMethodManagementSession = async (
  provider: BILLING_PROVIDER,
  customerId: string,
  returnUrl: string
): Promise<ProviderBillingManagementSession> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await createStripePaymentMethodManagementSession(
        customerId,
        returnUrl
      );
    default: {
      logger.warn(
        `${LOG_PREFIX} :: createProviderPaymentMethodManagementSession :: Unsupported provider`,
        {
          provider: provider,
          customerId: customerId,
          returnUrl: returnUrl,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

export const updateStripeSubscriptionItemPrice = async (
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  quantity: number,
  prorate: boolean,
  chargeImmediately: boolean,
  resetBillingCycle: boolean
): Promise<ProviderSubscriptionItem> => {
  return mapStripeSubscriptionItem(
    await stripeService.updateSubscriptionItemPrice(
      subscriptionId,
      subscriptionItemId,
      priceId,
      quantity,
      prorate,
      chargeImmediately,
      resetBillingCycle
    )
  ) as ProviderSubscriptionItem;
};

export const updateProviderSubscriptionItemPrice = async (
  provider: BILLING_PROVIDER,
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  quantity: number,
  prorate: boolean,
  chargeImmediately: boolean,
  resetBillingCycle: boolean
): Promise<ProviderSubscriptionItem> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await updateStripeSubscriptionItemPrice(
        subscriptionId,
        subscriptionItemId,
        priceId,
        quantity,
        prorate,
        chargeImmediately,
        resetBillingCycle
      );
    default: {
      logger.warn(
        `${LOG_PREFIX} :: updateProviderSubscriptionItemPrice :: Unsupported provider`,
        {
          provider: provider,
          subscriptionItemId: subscriptionItemId,
          priceId: priceId,
          quantity: quantity,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

const previewStripeSubscriptionItemPriceChange = async (
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  quantity: number,
  prorate: boolean,
  chargeImmediately: boolean,
  resetBillingCycle: boolean
): Promise<ProviderInvoice> => {
  return mapStripeInvoice(
    await stripeService.previewSubscriptionItemPriceChange(
      subscriptionId,
      subscriptionItemId,
      priceId,
      quantity,
      prorate,
      chargeImmediately,
      resetBillingCycle
    )
  ) as ProviderInvoice;
};

export const previewProviderSubscriptionItemPriceChange = async (
  provider: BILLING_PROVIDER,
  subscriptionId: string,
  subscriptionItemId: string,
  priceId: string,
  quantity: number,
  prorate: boolean,
  chargeImmediately: boolean,
  resetBillingCycle: boolean
): Promise<ProviderInvoice> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await previewStripeSubscriptionItemPriceChange(
        subscriptionId,
        subscriptionItemId,
        priceId,
        quantity,
        prorate,
        chargeImmediately,
        resetBillingCycle
      );
    default: {
      logger.warn(
        `${LOG_PREFIX} :: previewProviderSubscriptionItemPriceChange :: Unsupported provider`,
        {
          provider: provider,
          subscriptionId: subscriptionId,
          subscriptionItemId: subscriptionItemId,
          priceId: priceId,
          quantity: quantity,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};

const cursorPaginationStripeCustomerInvoices = async (
  customerId: string,
  pagination: CursorPaginationInputDto,
  filter?: {
    status?: BILLING_PROVIDER_INVOICE_STATUS[];
  }
): Promise<CursorPaginationOutputDto<ProviderInvoice>> => {
  const transformedStatuses = filter?.status?.map((status) =>
    transformOrThrowProviderInvoiceStatusToStripe(status)
  );

  const result = await stripeService.cursorPaginateCustomerInvoices(
    customerId,
    pagination,
    {
      status: transformedStatuses,
    }
  );

  return {
    nodes: mapStripeInvoice(result.nodes) as ProviderInvoice[],
    totalCount: result.totalCount,
    hasNextPage: result.hasNextPage,
    hasPreviousPage: result.hasPreviousPage,
    startCursor: result.startCursor,
    endCursor: result.endCursor,
  };
};

export const cursorPaginateProviderCustomerInvoices = async (
  provider: BILLING_PROVIDER,
  customerId: string,
  pagination: CursorPaginationInputDto,
  filter?: {
    status?: BILLING_PROVIDER_INVOICE_STATUS[];
  }
): Promise<CursorPaginationOutputDto<ProviderInvoice>> => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return await cursorPaginationStripeCustomerInvoices(
        customerId,
        pagination,
        filter
      );
    default: {
      logger.warn(
        `${LOG_PREFIX} :: cursorPaginateProviderCustomerInvoices :: Unsupported provider`,
        {
          provider: provider,
          customerId: customerId,
        }
      );
      throw new Error('Unsupported billing provider');
    }
  }
};
