import { DataMapper, Nullable } from '@common';
import {
  BillingPortalSession,
  CheckoutSession,
  CheckoutSessionStatus,
  Customer,
  Invoice,
  InvoiceStatus,
  Price,
  Product,
  Subscription,
  SubscriptionItem,
  SubscriptionStatus,
} from '@lib/provider/billing/stripe';
import {
  ProviderBillingManagementSession,
  ProviderCheckoutSession,
  ProviderCustomer,
  ProviderInvoice,
  ProviderPrice,
  ProviderProduct,
  ProviderSubscription,
  ProviderSubscriptionItem,
} from './billing.provider.model';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_CHECKOUT_SESSION_STATUS,
  BILLING_PROVIDER_INVOICE_STATUS,
  BILLING_PROVIDER_PRICE_STATUS,
  BILLING_PROVIDER_PRODUCT_STATUS,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
} from '../../common/billing.constant';
import { TIMING } from '@shared-lib/timing';

// -----------------------------------------------------------------
// Stripe Customer Provider Mapper
// -----------------------------------------------------------------

class StripeCustomerMapper extends DataMapper<Customer, ProviderCustomer> {
  override mapInputObject(source: Customer): ProviderCustomer {
    return new ProviderCustomer(
      source.id,
      BILLING_PROVIDER.STRIPE,
      source.email
    );
  }
}

const stripeCustomerMapper = new StripeCustomerMapper();

/**
 * Maps a stripe customer to a normalized {@link ProviderCustomer customer provider}.
 */
export const mapStripeCustomer = (
  customer: Nullable<Customer> | Customer[]
) => {
  return stripeCustomerMapper.map(customer);
};

// -----------------------------------------------------------------
// Checkout Session Status Mapper
// -----------------------------------------------------------------

const STRIPE_CHECKOUT_SESSION_STATUS_TO_PROVIDER_MAP: Record<
  CheckoutSessionStatus,
  BILLING_PROVIDER_CHECKOUT_SESSION_STATUS
> = {
  open: BILLING_PROVIDER_CHECKOUT_SESSION_STATUS.PENDING,
  complete: BILLING_PROVIDER_CHECKOUT_SESSION_STATUS.COMPLETED,
  expired: BILLING_PROVIDER_CHECKOUT_SESSION_STATUS.EXPIRED,
};

const mapStripeCheckoutSessionStatusToProvider = (
  status: CheckoutSessionStatus
): BILLING_PROVIDER_CHECKOUT_SESSION_STATUS => {
  return STRIPE_CHECKOUT_SESSION_STATUS_TO_PROVIDER_MAP[status];
};

// -----------------------------------------------------------------
// Stripe Checkout Session Provider Mapper
// -----------------------------------------------------------------

class StripeCheckoutSessionMapper extends DataMapper<
  CheckoutSession,
  ProviderCheckoutSession
> {
  override mapInputObject(source: CheckoutSession): ProviderCheckoutSession {
    return new ProviderCheckoutSession(
      source.id,
      BILLING_PROVIDER.STRIPE,
      (source.customer as string) ?? null,
      mapStripeCheckoutSessionStatusToProvider(source.status!),
      source.client_secret ?? null
    );
  }
}

const stripeCheckoutSessionMapper = new StripeCheckoutSessionMapper();

/**
 * Maps a stripe checkout session to a normalized {@link ProviderCheckoutSession checkout session provider}.
 */
export const mapStripeCheckoutSession = (
  session: Nullable<CheckoutSession> | CheckoutSession[]
) => {
  return stripeCheckoutSessionMapper.map(session);
};

// -----------------------------------------------------------------
// Stripe Billing Management Session Mapper
// -----------------------------------------------------------------

export class StripeBillingManagementSessionMapper extends DataMapper<
  BillingPortalSession,
  ProviderBillingManagementSession
> {
  override mapInputObject(
    source: BillingPortalSession
  ): ProviderBillingManagementSession {
    return new ProviderBillingManagementSession(
      source.id,
      BILLING_PROVIDER.STRIPE,
      source.customer as string,
      source.url
    );
  }
}

const stripeBillingManagementSessionMapper =
  new StripeBillingManagementSessionMapper();

export const mapStripeBillingManagementSession = (
  session: Nullable<BillingPortalSession> | BillingPortalSession[]
) => {
  return stripeBillingManagementSessionMapper.map(session);
};

// -----------------------------------------------------------------
// Subscription Status Mapper
// -----------------------------------------------------------------

const STRIPE_SUBSCRIPTION_STATUS_TO_PROVIDER_MAP: Record<
  SubscriptionStatus,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS
> = {
  // Supported
  active: BILLING_PROVIDER_SUBSCRIPTION_STATUS.ACTIVE,
  unpaid: BILLING_PROVIDER_SUBSCRIPTION_STATUS.INACTIVE,
  past_due: BILLING_PROVIDER_SUBSCRIPTION_STATUS.INACTIVE,
  canceled: BILLING_PROVIDER_SUBSCRIPTION_STATUS.CANCELLED,
  trialing: BILLING_PROVIDER_SUBSCRIPTION_STATUS.TRIALING,
  // Unsupported
  incomplete: BILLING_PROVIDER_SUBSCRIPTION_STATUS.UNSUPPORTED,
  incomplete_expired: BILLING_PROVIDER_SUBSCRIPTION_STATUS.UNSUPPORTED,
  paused: BILLING_PROVIDER_SUBSCRIPTION_STATUS.UNSUPPORTED,
};

const transformStripeSubscriptionStatusToProvider = (
  status: SubscriptionStatus
): BILLING_PROVIDER_SUBSCRIPTION_STATUS => {
  return STRIPE_SUBSCRIPTION_STATUS_TO_PROVIDER_MAP[status];
};

// -----------------------------------------------------------------
// Stripe Subscription Provider Mapper
// -----------------------------------------------------------------

export class StripeSubscriptionMapper extends DataMapper<
  Subscription,
  ProviderSubscription
> {
  override mapInputObject(source: Subscription): ProviderSubscription {
    return new ProviderSubscription(
      source.id,
      BILLING_PROVIDER.STRIPE,
      source.customer as string,
      transformStripeSubscriptionStatusToProvider(source.status),
      new Date(source.start_date * TIMING.SECOND.IN_MILLISECONDS),
      source.cancel_at
        ? new Date(source.cancel_at * TIMING.SECOND.IN_MILLISECONDS)
        : null
    );
  }
}

const stripeSubscriptionMapper = new StripeSubscriptionMapper();

/**
 * Maps a stripe subscription to a normalized {@link ProviderSubscription subscription provider}.
 */
export const mapStripeSubscription = (
  subscription: Nullable<Subscription> | Subscription[]
) => {
  return stripeSubscriptionMapper.map(subscription);
};

// -----------------------------------------------------------------
// Stripe Subscription Item Mapper
// -----------------------------------------------------------------

export class StripeSubscriptionItemMapper extends DataMapper<
  SubscriptionItem,
  ProviderSubscriptionItem
> {
  override mapInputObject(source: SubscriptionItem): ProviderSubscriptionItem {
    return new ProviderSubscriptionItem(
      source.id,
      BILLING_PROVIDER.STRIPE,
      source.subscription as string,
      source.price.id,
      source.quantity!,
      new Date(source.current_period_start * TIMING.SECOND.IN_MILLISECONDS),
      new Date(source.current_period_end * TIMING.SECOND.IN_MILLISECONDS)
    );
  }
}

const stripeSubscriptionItemMapper = new StripeSubscriptionItemMapper();

/**
 * Maps a stripe subscription item to a normalized {@link ProviderSubscriptionItem subscription item provider}.
 */
export const mapStripeSubscriptionItem = (
  subscriptionItem: Nullable<SubscriptionItem> | SubscriptionItem[]
) => {
  return stripeSubscriptionItemMapper.map(subscriptionItem);
};

// -----------------------------------------------------------------
// Stripe Price Mapper
// -----------------------------------------------------------------

export class StripePriceMapper extends DataMapper<Price, ProviderPrice> {
  override mapInputObject(source: Price): ProviderPrice {
    return new ProviderPrice(
      source.id,
      BILLING_PROVIDER.STRIPE,
      source.product as string,
      source.active
        ? BILLING_PROVIDER_PRICE_STATUS.ACTIVE
        : BILLING_PROVIDER_PRICE_STATUS.INACTIVE,
      source.unit_amount ?? null
    );
  }
}

const stripePriceMapper = new StripePriceMapper();

/**
 * Maps a stripe price to a normalized {@link ProviderPrice price provider}.
 */
export const mapStripePrice = (price: Nullable<Price> | Price[]) => {
  return stripePriceMapper.map(price);
};

// -----------------------------------------------------------------
// Stripe Product Mapper
// -----------------------------------------------------------------

export class StripeProductMapper extends DataMapper<Product, ProviderProduct> {
  override mapInputObject(source: Product): ProviderProduct {
    return new ProviderProduct(
      source.id,
      BILLING_PROVIDER.STRIPE,
      source.active
        ? BILLING_PROVIDER_PRODUCT_STATUS.ACTIVE
        : BILLING_PROVIDER_PRODUCT_STATUS.INACTIVE
    );
  }
}

const stripeProductMapper = new StripeProductMapper();

/**
 * Maps a stripe product to a normalized {@link ProviderProduct product provider}.
 */
export const mapStripeProduct = (product: Nullable<Product> | Product[]) => {
  return stripeProductMapper.map(product);
};

// -----------------------------------------------------------------
// Stripe Invoice Mapper
// -----------------------------------------------------------------

const STRIPE_INVOICE_STATUS_TO_PROVIDER_MAP: Record<
  InvoiceStatus,
  BILLING_PROVIDER_INVOICE_STATUS
> = {
  // Supported
  open: BILLING_PROVIDER_INVOICE_STATUS.OPEN,
  paid: BILLING_PROVIDER_INVOICE_STATUS.PAID,
  // Unsupported
  draft: BILLING_PROVIDER_INVOICE_STATUS.UNSUPPORTED,
  void: BILLING_PROVIDER_INVOICE_STATUS.UNSUPPORTED,
  uncollectible: BILLING_PROVIDER_INVOICE_STATUS.UNSUPPORTED,
};

const PROVIDER_TO_STRIPE_INVOICE_STATUS_MAP: Partial<
  Record<BILLING_PROVIDER_INVOICE_STATUS, InvoiceStatus>
> = {
  [BILLING_PROVIDER_INVOICE_STATUS.OPEN]: 'open',
  [BILLING_PROVIDER_INVOICE_STATUS.PAID]: 'paid',
};

const transformStripeInvoiceStatusToProvider = (
  status: InvoiceStatus
): BILLING_PROVIDER_INVOICE_STATUS => {
  return STRIPE_INVOICE_STATUS_TO_PROVIDER_MAP[status];
};

const transformProviderInvoiceStatusToStripe = (
  status: BILLING_PROVIDER_INVOICE_STATUS
): Nullable<InvoiceStatus> => {
  return PROVIDER_TO_STRIPE_INVOICE_STATUS_MAP[status] ?? null;
};

export const transformOrThrowProviderInvoiceStatusToStripe = (
  status: BILLING_PROVIDER_INVOICE_STATUS
): InvoiceStatus => {
  const result = transformProviderInvoiceStatusToStripe(status);

  if (!result) {
    throw new Error(`Unsupported invoice status: ${status}`);
  }

  return result;
};

export class StripeInvoiceMapper extends DataMapper<Invoice, ProviderInvoice> {
  override mapInputObject(source: Invoice): ProviderInvoice {
    return new ProviderInvoice(
      source.id!,
      BILLING_PROVIDER.STRIPE,
      transformStripeInvoiceStatusToProvider(source.status as InvoiceStatus),
      source.amount_due ?? 0,
      source.amount_paid ?? 0,
      source.amount_remaining ?? 0,
      source.total ?? 0,
      source.invoice_pdf ?? null,
      new Date(source.created * TIMING.SECOND.IN_MILLISECONDS)
    );
  }
}

const stripeInvoiceMapper = new StripeInvoiceMapper();

/**
 * Maps a stripe invoice to a normalized {@link ProviderInvoice invoice provider}.
 */
export const mapStripeInvoice = (invoice: Nullable<Invoice> | Invoice[]) => {
  return stripeInvoiceMapper.map(invoice);
};

// -----------------------------------------------------------------
// Utils
// -----------------------------------------------------------------

const generateStripeResourceVersion = (
  actionDate: Date,
  sortableEventId?: string
): string => {
  const timestamp = actionDate.getTime();

  if (!sortableEventId) {
    return `${timestamp}`;
  }

  return `${timestamp}:${sortableEventId}`;
};

/**
 * Generates a unique version identifier for a billing provider resource.
 * This is used to track changes and updates to the resource.
 * If an event ID is provided, it is included in the version string,
 * allowing for precise identification of the event.
 *
 * @returns A unique version identifier for the resource.
 */
export const generateBillingProviderResourceVersion = (
  provider: BILLING_PROVIDER,
  actionDate: Date,
  sortableEventId?: string
): string => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return generateStripeResourceVersion(actionDate, sortableEventId);
    default:
      throw new Error(`Unknown billing provider: ${provider}`);
  }
};
