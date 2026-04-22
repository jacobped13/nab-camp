import { DataMapper, Nullable } from '@common';
import {
  BillingProviderEventLog,
  Customer,
  Price,
  Product,
  Subscription,
  SubscriptionItem,
  SubscriptionPlan,
  SubscriptionPlanFamily,
  SubscriptionPlanFamilyFeature,
  SubscriptionPlanFamilyGroup,
  SubscriptionPlanFamilyGroupItem,
  SubscriptionPlanFamilyGroupPath,
} from '@prisma/client';
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
} from '../../common/billing.constant';
import {
  BillingProviderEventLogEntity,
  CustomerConnectionEntity,
  PriceConnectionEntity,
  ProductConnectionEntity,
  SubscriptionConnectionEntity,
  SubscriptionItemConnectionEntity,
  SubscriptionPlanFamilyEntity,
  SubscriptionPlanFamilyFeatureEntity,
  SubscriptionPlanEntity,
  SubscriptionPlanFamilyGroupEntity,
  SubscriptionPlanFamilyGroupItemEntity,
  SubscriptionPlanFamilyGroupPathEntity,
} from './billing.data.model';

// -----------------------------------------------------------------
// Billing Provider Event Log Entity Mapper
// -----------------------------------------------------------------

export class BillingProviderEventLogEntityMapper extends DataMapper<
  BillingProviderEventLog,
  BillingProviderEventLogEntity
> {
  override mapInputObject(
    source: BillingProviderEventLog
  ): BillingProviderEventLogEntity {
    return new BillingProviderEventLogEntity(
      source.id,
      source.provider as BILLING_PROVIDER,
      source.providerId,
      source.processedAt,
      source.publishedAt,
      source.createdAt,
      source.updatedAt
    );
  }
}

const billingProviderEventLogEntityMapper =
  new BillingProviderEventLogEntityMapper();

/**
 * Maps an ORM billing provider event record to a normalized {@link BillingProviderEventLogEntity}.
 */
export const mapBillingProviderEventLogEntity = (
  source: Nullable<BillingProviderEventLog> | BillingProviderEventLog[]
) => {
  return billingProviderEventLogEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Customer Connection Entity Mapper
// -----------------------------------------------------------------

export class CustomerConnectionEntityMapper extends DataMapper<
  Customer,
  CustomerConnectionEntity
> {
  override mapInputObject(source: Customer): CustomerConnectionEntity {
    return new CustomerConnectionEntity(
      source.id,
      source.provider as BILLING_PROVIDER,
      source.providerId,
      source.providerVersion,
      source.stakeholderId,
      source.stakeholderType as BILLING_PROVIDER_STAKEHOLDER_TYPE,
      source.createdAt,
      source.updatedAt
    );
  }
}

const customerConnectionEntityMapper = new CustomerConnectionEntityMapper();

/**
 * Maps an ORM customer record to a normalized {@link CustomerConnectionEntity}.
 */
export const mapCustomerConnectionEntity = (
  source: Nullable<Customer> | Customer[]
) => {
  return customerConnectionEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Connection Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionConnectionEntityMapper extends DataMapper<
  Subscription,
  SubscriptionConnectionEntity
> {
  override mapInputObject(source: Subscription): SubscriptionConnectionEntity {
    return new SubscriptionConnectionEntity(
      source.id,
      source.provider as BILLING_PROVIDER,
      source.providerId,
      source.providerVersion,
      source.customerId,
      source.status as BILLING_PROVIDER_SUBSCRIPTION_STATUS,
      source.cancelAt,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionConnectionEntityMapper =
  new SubscriptionConnectionEntityMapper();

/**
 * Maps an ORM subscription record to a normalized {@link SubscriptionConnectionEntity}.
 */
export const mapSubscriptionConnectionEntity = (
  source: Nullable<Subscription> | Subscription[]
) => {
  return subscriptionConnectionEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Item Connection Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionItemConnectionEntityMapper extends DataMapper<
  SubscriptionItem,
  SubscriptionItemConnectionEntity
> {
  override mapInputObject(
    source: SubscriptionItem
  ): SubscriptionItemConnectionEntity {
    return new SubscriptionItemConnectionEntity(
      source.id,
      source.provider as BILLING_PROVIDER,
      source.providerId,
      source.providerVersion,
      source.subscriptionId,
      source.priceId,
      source.quantity,
      source.currentPeriodStartAt,
      source.currentPeriodEndAt,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionItemConnectionEntityMapper =
  new SubscriptionItemConnectionEntityMapper();

/**
 * Maps an ORM subscription item record to a normalized {@link SubscriptionItemConnectionEntity}.
 */
export const mapSubscriptionItemConnectionEntity = (
  source: Nullable<SubscriptionItem> | SubscriptionItem[]
) => {
  return subscriptionItemConnectionEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Price Connection Entity Mapper
// -----------------------------------------------------------------

export class PriceConnectionEntityMapper extends DataMapper<
  Price,
  PriceConnectionEntity
> {
  override mapInputObject(source: Price): PriceConnectionEntity {
    return new PriceConnectionEntity(
      source.id,
      source.provider as BILLING_PROVIDER,
      source.providerId,
      source.providerVersion,
      source.status as BILLING_PROVIDER_PRICE_STATUS,
      source.productId,
      source.unitAmount,
      source.createdAt,
      source.updatedAt
    );
  }
}

const priceConnectionEntityMapper = new PriceConnectionEntityMapper();

/**
 * Maps an ORM price record to a normalized {@link PriceConnectionEntity}.
 */
export const mapPriceConnectionEntity = (source: Nullable<Price> | Price[]) => {
  return priceConnectionEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Product Connection Entity Mapper
// -----------------------------------------------------------------

export class ProductConnectionEntityMapper extends DataMapper<
  Product,
  ProductConnectionEntity
> {
  override mapInputObject(source: Product): ProductConnectionEntity {
    return new ProductConnectionEntity(
      source.id,
      source.provider as BILLING_PROVIDER,
      source.providerId,
      source.providerVersion,
      source.status as BILLING_PROVIDER_PRODUCT_STATUS,
      source.createdAt,
      source.updatedAt
    );
  }
}

const productConnectionEntityMapper = new ProductConnectionEntityMapper();

/**
 * Maps an ORM product record to a normalized {@link ProductConnectionEntity}.
 */
export const mapProductConnectionEntity = (
  source: Nullable<Product> | Product[]
) => {
  return productConnectionEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Plan Family Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionPlanFamilyEntityMapper extends DataMapper<
  SubscriptionPlanFamily,
  SubscriptionPlanFamilyEntity
> {
  override mapInputObject(
    source: SubscriptionPlanFamily
  ): SubscriptionPlanFamilyEntity {
    return new SubscriptionPlanFamilyEntity(
      source.id,
      source.key as SUBSCRIPTION_PLAN_FAMILY_KEY,
      source.productId,
      source.type as SUBSCRIPTION_PLAN_TYPE,
      source.setupType as SUBSCRIPTION_PLAN_SETUP_TYPE,
      source.name,
      source.description,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionPlanFamilyEntityMapper =
  new SubscriptionPlanFamilyEntityMapper();

/**
 * Maps an ORM subscription plan family record to a normalized {@link SubscriptionPlanFamilyEntity}.
 */
export const mapSubscriptionPlanFamilyEntity = (
  source: Nullable<SubscriptionPlanFamily> | SubscriptionPlanFamily[]
) => {
  return subscriptionPlanFamilyEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Plan Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionPlanEntityMapper extends DataMapper<
  SubscriptionPlan,
  SubscriptionPlanEntity
> {
  override mapInputObject(source: SubscriptionPlan): SubscriptionPlanEntity {
    return new SubscriptionPlanEntity(
      source.id,
      source.familyId,
      source.priceId,
      source.frequency as BILLING_FREQUENCY,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionPlanEntityMapper = new SubscriptionPlanEntityMapper();

/**
 * Maps an ORM subscription plan record to a normalized {@link SubscriptionPlanEntity}.
 */
export const mapSubscriptionPlanEntity = (
  source: Nullable<SubscriptionPlan> | SubscriptionPlan[]
) => {
  return subscriptionPlanEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Plan Family Feature Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionPlanFamilyFeatureEntityMapper extends DataMapper<
  SubscriptionPlanFamilyFeature,
  SubscriptionPlanFamilyFeatureEntity
> {
  override mapInputObject(
    source: SubscriptionPlanFamilyFeature
  ): SubscriptionPlanFamilyFeatureEntity {
    return new SubscriptionPlanFamilyFeatureEntity(
      source.id,
      source.familyId,
      source.name,
      source.order,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionPlanFamilyFeatureEntityMapper =
  new SubscriptionPlanFamilyFeatureEntityMapper();

/**
 * Maps an ORM subscription plan family feature record to a normalized {@link SubscriptionPlanFamilyFeatureEntity}.
 */
export const mapSubscriptionPlanFamilyFeatureEntity = (
  source:
    | Nullable<SubscriptionPlanFamilyFeature>
    | SubscriptionPlanFamilyFeature[]
) => {
  return subscriptionPlanFamilyFeatureEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Plan Family Group Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionPlanFamilyGroupEntityMapper extends DataMapper<
  SubscriptionPlanFamilyGroup,
  SubscriptionPlanFamilyGroupEntity
> {
  override mapInputObject(
    source: SubscriptionPlanFamilyGroup
  ): SubscriptionPlanFamilyGroupEntity {
    return new SubscriptionPlanFamilyGroupEntity(
      source.id,
      source.key as SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionPlanFamilyGroupEntityMapper =
  new SubscriptionPlanFamilyGroupEntityMapper();

/**
 * Maps an ORM subscription plan family group record to a normalized {@link SubscriptionPlanFamilyGroupEntity}.
 */
export const mapSubscriptionPlanFamilyGroupEntity = (
  source: Nullable<SubscriptionPlanFamilyGroup> | SubscriptionPlanFamilyGroup[]
) => {
  return subscriptionPlanFamilyGroupEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Plan Family Group Item Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionPlanFamilyGroupItemEntityMapper extends DataMapper<
  SubscriptionPlanFamilyGroupItem,
  SubscriptionPlanFamilyGroupItemEntity
> {
  override mapInputObject(
    source: SubscriptionPlanFamilyGroupItem
  ): SubscriptionPlanFamilyGroupItemEntity {
    return new SubscriptionPlanFamilyGroupItemEntity(
      source.id,
      source.groupId,
      source.familyId,
      source.order,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionPlanFamilyGroupItemEntityMapper =
  new SubscriptionPlanFamilyGroupItemEntityMapper();

/**
 * Maps an ORM subscription plan family group item record to a normalized {@link SubscriptionPlanFamilyGroupItemEntity}.
 */
export const mapSubscriptionPlanFamilyGroupItemEntity = (
  source:
    | Nullable<SubscriptionPlanFamilyGroupItem>
    | SubscriptionPlanFamilyGroupItem[]
) => {
  return subscriptionPlanFamilyGroupItemEntityMapper.map(source);
};

// -----------------------------------------------------------------
// Subscription Plan Family Group Path Entity Mapper
// -----------------------------------------------------------------

export class SubscriptionPlanFamilyGroupPathEntityMapper extends DataMapper<
  SubscriptionPlanFamilyGroupPath,
  SubscriptionPlanFamilyGroupPathEntity
> {
  override mapInputObject(
    source: SubscriptionPlanFamilyGroupPath
  ): SubscriptionPlanFamilyGroupPathEntity {
    return new SubscriptionPlanFamilyGroupPathEntity(
      source.id,
      source.groupId,
      source.fromItemId,
      source.toItemId,
      source.path as BILLING_GRADE_CHANGE,
      source.createdAt,
      source.updatedAt
    );
  }
}

const subscriptionPlanFamilyGroupPathEntityMapper =
  new SubscriptionPlanFamilyGroupPathEntityMapper();

/**
 * Maps an ORM subscription plan family group path record to a normalized {@link SubscriptionPlanFamilyGroupPathEntity}.
 */
export const mapSubscriptionPlanFamilyGroupPathEntity = (
  source:
    | Nullable<SubscriptionPlanFamilyGroupPath>
    | SubscriptionPlanFamilyGroupPath[]
) => {
  return subscriptionPlanFamilyGroupPathEntityMapper.map(source);
};
