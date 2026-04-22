import { Nullable } from '@common';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_CHECKOUT_SESSION_STATUS,
  BILLING_PROVIDER_INVOICE_STATUS,
  BILLING_PROVIDER_PRICE_STATUS,
  BILLING_PROVIDER_PRODUCT_STATUS,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET,
} from '../../common/billing.constant';

/**
 * Represents the provider for customer billing operations.
 * This class is used to handle customer-related billing operations.
 */
export class ProviderCustomer {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly email: Nullable<string>
  ) {}
}

/**
 * Represents a checkout session for billing operations.
 */
export class ProviderCheckoutSession {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly customerId: Nullable<string>,
    public readonly status: BILLING_PROVIDER_CHECKOUT_SESSION_STATUS,
    public readonly token: Nullable<string>
  ) {}
}

/**
 * Represents a billing management session for a provider.
 */
export class ProviderBillingManagementSession {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly customerId: Nullable<string>,
    public readonly url: string
  ) {}
}

/**
 * Represents a subscription for billing operations.
 */
export class ProviderSubscription {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly customerId: string,
    public readonly status: BILLING_PROVIDER_SUBSCRIPTION_STATUS,
    public readonly startedAt: Date,
    public readonly cancelAt: Nullable<Date>
  ) {}

  public isSupportedStatus(): boolean {
    return SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET.has(this.status);
  }
}

/**
 * Represents a subscription item for billing operations.
 */
export class ProviderSubscriptionItem {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly subscriptionId: string,
    public readonly priceId: string,
    public readonly quantity: number,
    public readonly currentPeriodStartAt: Date,
    public readonly currentPeriodEndAt: Date
  ) {}
}

/**
 * Represents a price for billing operations.
 */
export class ProviderPrice {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly productId: string,
    public readonly status: BILLING_PROVIDER_PRICE_STATUS,
    public readonly unitAmount: Nullable<number>
  ) {}
}

/**
 * Represents a product for billing operations.
 */
export class ProviderProduct {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly status: BILLING_PROVIDER_PRODUCT_STATUS
  ) {}
}

/**
 * Represents an invoice for billing operations.
 */
export class ProviderInvoice {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly status: BILLING_PROVIDER_INVOICE_STATUS,
    public readonly amountDue: number,
    public readonly amountPaid: number,
    public readonly amountRemaining: number,
    public readonly total: number,
    public readonly downloadUrl: Nullable<string>,
    public readonly createdAt: Date
  ) {}
}
