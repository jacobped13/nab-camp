import { Nullable } from '@common';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_PRICE_STATUS,
  BILLING_PROVIDER_PRODUCT_STATUS,
  BILLING_PROVIDER_STAKEHOLDER_TYPE,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  BILLING_FREQUENCY,
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  BILLING_GRADE_CHANGE,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
  SUBSCRIPTION_PLAN_TYPE,
  TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET,
} from '../../common/billing.constant';

/**
 * Represents an event dispatched by a billing provider.
 * This entity is responsible for ensuring that events are processed only once with the latest data.
 */
export class BillingProviderEventLogEntity {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly providerId: string,
    public readonly processedAt: Nullable<Date>,
    public readonly publishedAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public isProcessed(): boolean {
    return this.processedAt !== null;
  }
}

/**
 * Represents a customer connection entity in the system.
 */
export class CustomerConnectionEntity {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly providerId: string,
    public readonly providerVersion: Nullable<string>,
    public readonly stakeholderId: string,
    public readonly stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a subscription connection entity in the system.
 */
export class SubscriptionConnectionEntity {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly providerId: string,
    public readonly providerVersion: Nullable<string>,
    public readonly customerId: string,
    public readonly status: BILLING_PROVIDER_SUBSCRIPTION_STATUS,
    public readonly cancelAt: Nullable<Date>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public isTerminal(): boolean {
    return TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET.has(this.status);
  }

  public isCancelling(): boolean {
    return this.cancelAt !== null && this.cancelAt > new Date();
  }

  public isResumable(): boolean {
    return !this.isTerminal() && this.isCancelling();
  }

  public isCancellable(): boolean {
    return !this.isTerminal() && !this.isCancelling();
  }
}

/**
 * Represents a subscription item connection entity in the system.
 */
export class SubscriptionItemConnectionEntity {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly providerId: string,
    public readonly providerVersion: Nullable<string>,
    public readonly subscriptionId: string,
    public readonly priceId: string,
    public readonly quantity: number,
    public readonly currentPeriodStartAt: Date,
    public readonly currentPeriodEndAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a price connection entity in the system.
 */
export class PriceConnectionEntity {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly providerId: string,
    public readonly providerVersion: Nullable<string>,
    public readonly status: BILLING_PROVIDER_PRICE_STATUS,
    public readonly productId: string,
    public readonly unitAmount: Nullable<number>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a product connection entity in the system.
 */
export class ProductConnectionEntity {
  constructor(
    public readonly id: string,
    public readonly provider: BILLING_PROVIDER,
    public readonly providerId: string,
    public readonly providerVersion: Nullable<string>,
    public readonly status: BILLING_PROVIDER_PRODUCT_STATUS,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a billing provider product with recurring pricing structure.
 * This entity is used to manage subscription plans and their features.
 */
export class SubscriptionPlanFamilyEntity {
  constructor(
    public readonly id: string,
    public readonly key: SUBSCRIPTION_PLAN_FAMILY_KEY,
    public readonly productId: string,
    public readonly type: SUBSCRIPTION_PLAN_TYPE,
    public readonly setupType: SUBSCRIPTION_PLAN_SETUP_TYPE,
    public readonly name: string,
    public readonly description: Nullable<string>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a subscription plan's available prices for each of their billing frequencies (monthly, yearly, etc.).
 * This entity is used to enforce each unique billing frequency pricing structure.
 */
export class SubscriptionPlanEntity {
  constructor(
    public readonly id: string,
    public readonly familyId: string,
    public readonly priceId: string,
    public readonly frequency: BILLING_FREQUENCY,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a feature of a subscription plan.
 * This entity is used to define the features available in each subscription plan.
 */
export class SubscriptionPlanFamilyFeatureEntity {
  constructor(
    public readonly id: string,
    public readonly familyId: string,
    public readonly name: string,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a group of subscription plan.
 * This entity is used to categorize subscription plans into logical groups
 * so that they can be used for marketing purposes and to define the available upgrade/downgrade paths
 * for each plan inside of the group.
 */
export class SubscriptionPlanFamilyGroupEntity {
  constructor(
    public readonly id: string,
    public readonly key: SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents a plan inside of a group.
 */
export class SubscriptionPlanFamilyGroupItemEntity {
  constructor(
    public readonly id: string,
    public readonly groupId: string,
    public readonly familyId: string,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents the upgrade/downgrade paths between subscription plans within a group.
 * This entity is used to enforce the available paths that can be taken between plans in the same group.
 */
export class SubscriptionPlanFamilyGroupPathEntity {
  constructor(
    public readonly id: string,
    public readonly groupId: string,
    public readonly fromItemId: string,
    public readonly toItemId: string,
    public readonly path: BILLING_GRADE_CHANGE,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
