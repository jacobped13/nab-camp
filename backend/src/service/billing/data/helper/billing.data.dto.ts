import {
  PriceConnectionEntity,
  SubscriptionPlanEntity,
  SubscriptionPlanFamilyEntity,
  SubscriptionPlanFamilyFeatureEntity,
  SubscriptionPlanFamilyGroupItemEntity,
  SubscriptionPlanFamilyGroupPathEntity,
} from './billing.data.model';

export type SubscriptionPlanAggregate = {
  plan: SubscriptionPlanEntity;
  price: PriceConnectionEntity;
  family: SubscriptionPlanFamilyEntity;
  familyFeatures: SubscriptionPlanFamilyFeatureEntity[];
};

export type SubscriptionPlanFamilyGroupAggregate = {
  group: SubscriptionPlanFamilyEntity;
  groupItems: SubscriptionPlanFamilyGroupItemEntity[];
  groupPaths: SubscriptionPlanFamilyGroupPathEntity[];
};
