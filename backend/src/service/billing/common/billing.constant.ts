/**
 * Represents the different types of billing providers.
 */
export enum BILLING_PROVIDER {
  STRIPE = 'STRIPE',
}

/**
 * Represents the different types of stakeholders in the billing system.
 */
export enum BILLING_PROVIDER_STAKEHOLDER_TYPE {
  WORKSPACE = 'WORKSPACE',
}

/**
 * Represents the different statuses of a provider checkout session.
 */
export enum BILLING_PROVIDER_CHECKOUT_SESSION_STATUS {
  /**
   * Represents a pending checkout session.
   * The session is awaiting user action or payment confirmation.
   */
  PENDING = 'PENDING',
  /**
   * Represents a completed checkout session.
   * The session has been successfully completed and payment has been confirmed.
   */
  COMPLETED = 'COMPLETED',
  /**
   * Represents an expired checkout session.
   * The session has expired and is no longer valid.
   */
  EXPIRED = 'EXPIRED',
}

/**
 * Represents the different statuses of a provider subscription.
 */
export enum BILLING_PROVIDER_SUBSCRIPTION_STATUS {
  /**
   * Represents an active subscription.
   * The subscription is currently active and the user has access to the service.
   */
  ACTIVE = 'ACTIVE',
  /**
   * Represents an inactive subscription.
   * The subscription is not currently active, possibly due to unpaid invoices.
   */
  INACTIVE = 'INACTIVE',
  /**
   * Represents a cancelled subscription.
   * The subscription has been cancelled and is no longer active.
   */
  CANCELLED = 'CANCELLED',
  /**
   * Represents a subscription that is currently in a trial period.
   * The user has access to the service without being charged.
   */
  TRIALING = 'TRIALING',
  /**
   * Represents an unsupported subscription status.
   * This status is used when the subscription status is not recognized or supported by the system.
   */
  UNSUPPORTED = 'UNSUPPORTED',
}

/**
 * Represents all possible billing provider subscription statuses.
 * This is useful for filtering or validating subscription statuses.
 */
export const BILLING_PROVIDER_SUBSCRIPTION_STATUSES: Readonly<
  BILLING_PROVIDER_SUBSCRIPTION_STATUS[]
> = Object.values(BILLING_PROVIDER_SUBSCRIPTION_STATUS);

/**
 * Represents the different types of billing provider subscription statuses that are supported.
 */
export const SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUSES: Readonly<
  BILLING_PROVIDER_SUBSCRIPTION_STATUS[]
> = BILLING_PROVIDER_SUBSCRIPTION_STATUSES.filter(
  (status) => status !== BILLING_PROVIDER_SUBSCRIPTION_STATUS.UNSUPPORTED
);

/**
 * Represents a set of supported billing provider subscription statuses.
 * This is useful for quick lookups and validations.
 */
export const SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET: Readonly<
  Set<BILLING_PROVIDER_SUBSCRIPTION_STATUS>
> = new Set(SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUSES);

/**
 * Represents the different types of billing provider subscription statuses that are considered terminal.
 * Terminal statuses indicate that no further actions can be taken on the subscription.
 */
export const TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUSES: Readonly<
  BILLING_PROVIDER_SUBSCRIPTION_STATUS[]
> = [BILLING_PROVIDER_SUBSCRIPTION_STATUS.CANCELLED];

/**
 * Represents a set of terminal billing provider subscription statuses.
 * This is useful for quick lookups and validations.
 */
export const TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET: Readonly<
  Set<BILLING_PROVIDER_SUBSCRIPTION_STATUS>
> = new Set(TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUSES);

/**
 * Represents the different statuses of a billing provider product.
 */
export enum BILLING_PROVIDER_PRODUCT_STATUS {
  /**
   * Represents an active product.
   * The product is available for purchase and use.
   */
  ACTIVE = 'ACTIVE',
  /**
   * Represents an inactive product.
   * The product is not available for purchase or use.
   */
  INACTIVE = 'INACTIVE',
}

/**
 * Represents the different statuses of a billing provider price.
 */
export enum BILLING_PROVIDER_PRICE_STATUS {
  /**
   * Represents an active price.
   * The price is available for use in transactions.
   */
  ACTIVE = 'ACTIVE',
  /**
   * Represents an inactive price.
   * The price is not available for use in transactions.
   */
  INACTIVE = 'INACTIVE',
}

/**
 * Represents the different subscription plans that can be used in the system.
 */
export enum SUBSCRIPTION_PLAN_FAMILY_KEY {
  CREATOR = 'CREATOR',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
}

/**
 * Represents the different types of subscription plans.
 */
export enum SUBSCRIPTION_PLAN_TYPE {
  ACCESS = 'ACCESS',
}

/**
 * Represents the different setup types that can be used to subscribe to a plan.
 * This can be used to define how a user can subscribe to a plan.
 * For example, a self-service plan can be subscribed to directly by the user,
 * while a manual plan requires intervention from a support team.
 */
export enum SUBSCRIPTION_PLAN_SETUP_TYPE {
  SELF_SERVICE = 'SELF_SERVICE',
  MANUAL = 'MANUAL',
}

/**
 * Represents the different frequencies at which billing can occur.
 * This can be used to define how often a user is billed for a subscription plan.
 */
export enum BILLING_FREQUENCY {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

/**
 * Represents all possible billing frequencies.
 */
export const BILLING_FREQUENCIES = Object.values(BILLING_FREQUENCY);

/**
 * Represents the different levels of billing frequency.
 * This can be used to define the order of subscription plans based on their frequency.
 */
export const BILLING_FREQUENCY_LEVEL: Record<BILLING_FREQUENCY, number> = {
  [BILLING_FREQUENCY.MONTHLY]: 0,
  [BILLING_FREQUENCY.YEARLY]: 1,
};

/**
 * Represents the different groups of subscription plans.
 * This can be used to categorize subscription plans into logical groups
 * to map upgrade paths or features.
 */
export enum SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY {
  PUBLIC_JULY_2025 = 'PUBLIC_JULY_2025',
}

/**
 * Represents all possible subscription plan group keys.
 */
export const SUBSCRIPTION_PLAN_FAMILY_GROUP_KEYS = Object.values(
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY
);

/**
 * Represents the different paths between subscription plans.
 * This can be used to define upgrade paths or feature sets.
 */
export enum BILLING_GRADE_CHANGE {
  UPGRADE = 'UPGRADE',
  DOWNGRADE = 'DOWNGRADE',
  SIDEGRADE = 'SIDEGRADE',
}

/**
 * Represents all possible billing grade changes.
 */
export const BILLING_GRADE_CHANGES = Object.values(BILLING_GRADE_CHANGE);

/**
 * Represents the different statuses of a billing provider invoice.
 */
export enum BILLING_PROVIDER_INVOICE_STATUS {
  OPEN = 'OPEN',
  PAID = 'PAID',
  UNSUPPORTED = 'UNSUPPORTED',
}

/**
 * Represents all possible billing provider invoice statuses.
 */
export const BILLING_PROVIDER_INVOICE_STATUSES = Object.values(
  BILLING_PROVIDER_INVOICE_STATUS
);

/**
 * Represents the different types of billing provider invoice statuses that are supported.
 */
export const SUPPORTED_BILLING_PROVIDER_INVOICE_STATUSES: Readonly<
  BILLING_PROVIDER_INVOICE_STATUS[]
> = BILLING_PROVIDER_INVOICE_STATUSES.filter(
  (status) => status !== BILLING_PROVIDER_INVOICE_STATUS.UNSUPPORTED
);

/**
 * Represents a set of all supported billing provider invoice statuses.
 */
export const SUPPORTED_BILLING_PROVIDER_INVOICE_STATUS_SET = new Set(
  SUPPORTED_BILLING_PROVIDER_INVOICE_STATUSES
);
