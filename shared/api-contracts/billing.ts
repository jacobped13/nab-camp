// -----------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------

export enum CHECKOUT_SESSION_STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

export enum SUBSCRIPTION_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
  TRIALING = "TRIALING",
  PAUSED = "PAUSED",
}

export enum SUBSCRIPTION_PLAN_FAMILY_KEY {
  CREATOR = "CREATOR",
  PRO = "PRO",
  BUSINESS = "BUSINESS",
}

export enum SUBSCRIPTION_PLAN_TYPE {
  ACCESS = "ACCESS",
}

export enum SUBSCRIPTION_PLAN_SETUP_TYPE {
  MANUAL = "MANUAL",
  SELF_SERVICE = "SELF_SERVICE",
}

export enum BILLING_FREQUENCY {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum INVOICE_STATUS {
  OPEN = "OPEN",
  PAID = "PAID",
}

export type CheckoutSession = {
  id: string;
  token: string;
  status: CHECKOUT_SESSION_STATUS;
};

export type BillingManagementSession = {
  id: string;
  url: string;
};

export type SubscriptionPlan = {
  id: string;
  type: SUBSCRIPTION_PLAN_TYPE;
  setupType: SUBSCRIPTION_PLAN_SETUP_TYPE;
  familyKey: SUBSCRIPTION_PLAN_FAMILY_KEY;
  amount: number;
  name: string;
  description: string | null;
  frequency: BILLING_FREQUENCY;
  features: string[];
};

export type Invoice = {
  id: string;
  status: INVOICE_STATUS;
  amount: number;
  downloadUrl: string | null;
  createdAt: number;
};

// -----------------------------------------------------------------
// Create Checkout Session Contracts
// -----------------------------------------------------------------

export type CreateCheckoutSessionRequestBody = {
  planId: string;
};

export type CreateCheckoutSessionResponseBody = {
  session: CheckoutSession;
};

// -----------------------------------------------------------------
// Find Checkout Session by ID Contracts
// -----------------------------------------------------------------

export type FindCheckoutSessionByIdRequestParam = {
  id: string;
};

export type FindCheckoutSessionByIdResponseBody = {
  session: CheckoutSession;
};

// -----------------------------------------------------------------
// Find All Subscription Plans Contracts
// -----------------------------------------------------------------

export type FindAllSubscriptionPlansResponseBody = {
  plans: SubscriptionPlan[];
};

// -----------------------------------------------------------------
// Find Subscription Plan Paths by ID Contracts
// -----------------------------------------------------------------

export type FindSubscriptionPlanPathsByIdRequestParam = {
  id: string;
};

export type FindSubscriptionPlanPathsByIdResponseBody = {
  familyUpgrades: SubscriptionPlan[];
  familyDowngrades: SubscriptionPlan[];
  familySidegrades: SubscriptionPlan[];
  priceUpgrades: SubscriptionPlan[];
  priceDowngrades: SubscriptionPlan[];
  priceSidegrades: SubscriptionPlan[];
  frequencyUpgrades: SubscriptionPlan[];
  frequencyDowngrades: SubscriptionPlan[];
  frequencySidegrades: SubscriptionPlan[];
};
