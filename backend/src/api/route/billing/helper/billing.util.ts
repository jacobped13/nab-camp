import { DataMapper, Nullable } from '@common';
import {
  BILLING_PROVIDER_CHECKOUT_SESSION_STATUS,
  ProviderCheckoutSession,
  SubscriptionPlan,
  ProviderBillingManagementSession,
  ProviderInvoice,
  BILLING_PROVIDER_INVOICE_STATUS,
} from '@service/billing';
import {
  CHECKOUT_SESSION_STATUS,
  CheckoutSession as CheckoutSessionResponse,
  SubscriptionPlan as SubscriptionPlanResponse,
  BillingManagementSession as BillingManagementSessionResponse,
  Invoice as InvoiceResponse,
  INVOICE_STATUS,
} from '@api-contracts/billing';

// -----------------------------------------------------------------
// Checkout Session Status Mapper
// -----------------------------------------------------------------

const BILLING_PROVIDER_CHECKOUT_SESSION_STATUS_TO_BUSINESS_MAP: Partial<
  Record<BILLING_PROVIDER_CHECKOUT_SESSION_STATUS, CHECKOUT_SESSION_STATUS>
> = {
  [BILLING_PROVIDER_CHECKOUT_SESSION_STATUS.PENDING]:
    CHECKOUT_SESSION_STATUS.PENDING,
  [BILLING_PROVIDER_CHECKOUT_SESSION_STATUS.COMPLETED]:
    CHECKOUT_SESSION_STATUS.COMPLETED,
  [BILLING_PROVIDER_CHECKOUT_SESSION_STATUS.EXPIRED]:
    CHECKOUT_SESSION_STATUS.EXPIRED,
};

const transformProviderCheckoutSessionStatusToResponse = (
  status: BILLING_PROVIDER_CHECKOUT_SESSION_STATUS
): Nullable<CHECKOUT_SESSION_STATUS> => {
  return (
    BILLING_PROVIDER_CHECKOUT_SESSION_STATUS_TO_BUSINESS_MAP[status] ?? null
  );
};

const transformOrThrowProviderCheckoutSessionStatusToResponse = (
  status: BILLING_PROVIDER_CHECKOUT_SESSION_STATUS
): CHECKOUT_SESSION_STATUS => {
  const mappedStatus = transformProviderCheckoutSessionStatusToResponse(status);

  if (!mappedStatus) {
    throw new Error(`Unsupported provider checkout session status: ${status}`);
  }

  return mappedStatus;
};

// -----------------------------------------------------------------
// Checkout Session Response Mapper
// -----------------------------------------------------------------

class CheckoutSessionResponseMapper extends DataMapper<
  ProviderCheckoutSession,
  CheckoutSessionResponse
> {
  override mapInputObject(
    source: ProviderCheckoutSession
  ): CheckoutSessionResponse {
    return {
      id: source.id,
      status: transformOrThrowProviderCheckoutSessionStatusToResponse(
        source.status
      ),
      token: source.token!,
    };
  }
}

const checkoutSessionResponseMapper = new CheckoutSessionResponseMapper();

/**
 * Maps a provider checkout session to an API {@link CheckoutSession}.
 */
export const mapCheckoutSessionResponse = (
  session: Nullable<ProviderCheckoutSession> | ProviderCheckoutSession[]
) => {
  return checkoutSessionResponseMapper.map(session);
};

// -----------------------------------------------------------------
// Subscription Plan Response Mapper
// -----------------------------------------------------------------

class SubscriptionPlanResponseMapper extends DataMapper<
  SubscriptionPlan,
  SubscriptionPlanResponse
> {
  override mapInputObject(source: SubscriptionPlan): SubscriptionPlanResponse {
    return {
      id: source.id,
      familyKey: source.familyKey,
      type: source.type,
      setupType: source.setupType,
      amount: source.amount,
      name: source.name,
      description: source.description,
      frequency: source.frequency,
      features: source.features,
    };
  }
}

const subscriptionPlanResponseMapper = new SubscriptionPlanResponseMapper();

/**
 * Maps a subscription plan to an API {@link SubscriptionPlanResponse}.
 */
export const mapSubscriptionPlanResponse = (
  plan: Nullable<SubscriptionPlan> | SubscriptionPlan[]
) => {
  return subscriptionPlanResponseMapper.map(plan);
};

// -----------------------------------------------------------------
// Billing Management Session Response Mapper
// -----------------------------------------------------------------

export class BillingManagementSessionMapper extends DataMapper<
  ProviderBillingManagementSession,
  BillingManagementSessionResponse
> {
  override mapInputObject(
    source: ProviderBillingManagementSession
  ): BillingManagementSessionResponse {
    return {
      id: source.id,
      url: source.url,
    };
  }
}

const billingManagementSessionMapper = new BillingManagementSessionMapper();

/**
 * Maps a provider billing management session to an API {@link BillingManagementSessionResponse}.
 */
export const mapBillingManagementSessionResponse = (
  session:
    | Nullable<ProviderBillingManagementSession>
    | ProviderBillingManagementSession[]
) => {
  return billingManagementSessionMapper.map(session);
};

// -----------------------------------------------------------------
// Invoice Response Mapper
// -----------------------------------------------------------------

const BILLING_PROVIDER_INVOICE_STATUS_TO_RESPONSE_MAP: Partial<
  Record<BILLING_PROVIDER_INVOICE_STATUS, INVOICE_STATUS>
> = {
  [BILLING_PROVIDER_INVOICE_STATUS.PAID]: INVOICE_STATUS.PAID,
  [BILLING_PROVIDER_INVOICE_STATUS.OPEN]: INVOICE_STATUS.OPEN,
};

const INVOICE_RESPONSE_STATUS_TO_BILLING_PROVIDER_MAP: Partial<
  Record<INVOICE_STATUS, BILLING_PROVIDER_INVOICE_STATUS>
> = Object.fromEntries(
  Object.entries(BILLING_PROVIDER_INVOICE_STATUS_TO_RESPONSE_MAP).map(
    ([key, value]) => [value, key]
  )
);

const transformProviderInvoiceStatusToResponse = (
  status: BILLING_PROVIDER_INVOICE_STATUS
): Nullable<INVOICE_STATUS> => {
  return BILLING_PROVIDER_INVOICE_STATUS_TO_RESPONSE_MAP[status] ?? null;
};

const transformOrThrowProviderInvoiceStatusToResponse = (
  status: BILLING_PROVIDER_INVOICE_STATUS
): INVOICE_STATUS => {
  const mappedStatus = transformProviderInvoiceStatusToResponse(status);

  if (!mappedStatus) {
    throw new Error(`Unknown billing provider invoice status: ${status}`);
  }

  return mappedStatus;
};

const transformInvoiceResponseStatusToBillingProvider = (
  status: INVOICE_STATUS
): Nullable<BILLING_PROVIDER_INVOICE_STATUS> => {
  return INVOICE_RESPONSE_STATUS_TO_BILLING_PROVIDER_MAP[status] ?? null;
};

export const transformOrThrowInvoiceResponseStatusToBillingProvider = (
  status: INVOICE_STATUS
): BILLING_PROVIDER_INVOICE_STATUS => {
  const mappedStatus = transformInvoiceResponseStatusToBillingProvider(status);

  if (!mappedStatus) {
    throw new Error(`Unknown invoice response status: ${status}`);
  }

  return mappedStatus;
};

class InvoiceResponseMapper extends DataMapper<
  ProviderInvoice,
  InvoiceResponse
> {
  override mapInputObject(source: ProviderInvoice): InvoiceResponse {
    return {
      id: source.id,
      amount: source.total,
      status: transformOrThrowProviderInvoiceStatusToResponse(source.status),
      downloadUrl: source.downloadUrl ?? null,
      createdAt: source.createdAt.getTime(),
    };
  }
}

const invoiceResponseMapper = new InvoiceResponseMapper();

/**
 * Maps a provider invoice to an API {@link InvoiceResponse}.
 */
export const mapInvoiceResponse = (
  invoice: Nullable<ProviderInvoice> | ProviderInvoice[]
) => {
  return invoiceResponseMapper.map(invoice);
};
