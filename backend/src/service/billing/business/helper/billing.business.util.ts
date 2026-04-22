import { DataMapper, Nullable } from '@common';
import { SubscriptionPlan } from './billing.business.model';
import {
  PriceConnectionEntity,
  SubscriptionPlanFamilyEntity,
  SubscriptionPlanFamilyFeatureEntity,
  SubscriptionPlanEntity,
  SubscriptionPlanFamilyGroupItemEntity,
  SubscriptionPlanFamilyGroupPathEntity,
} from '../../data/helper/billing.data.model';
import {
  BILLING_FREQUENCY_LEVEL,
  BILLING_GRADE_CHANGE,
} from '../../common/billing.constant';
import {
  calculateBillingPriceGradeChange,
  calculateBillingFrequencyGradeChange,
} from '@service/billing/common/billing.util';
import { SubscriptionPlanPathDto } from './billing.business.dto';

// -----------------------------------------------------------------
// Subscription Plan Mapper
// -----------------------------------------------------------------

export type SubscriptionPlanMapperInput = {
  plan: SubscriptionPlanEntity;
  price: PriceConnectionEntity;
  family: SubscriptionPlanFamilyEntity;
  familyFeatures: SubscriptionPlanFamilyFeatureEntity[];
};

export class SubscriptionPlanMapper extends DataMapper<
  SubscriptionPlanMapperInput,
  SubscriptionPlan
> {
  override mapInputObject(
    input: SubscriptionPlanMapperInput
  ): SubscriptionPlan {
    const plan = input.plan;
    const price = input.price;
    const family = input.family;
    const familyFeatures = input.familyFeatures;

    return new SubscriptionPlan(
      plan.id,
      plan.priceId,
      plan.frequency,
      family.id,
      family.key,
      family.productId,
      family.type,
      family.setupType,
      family.name,
      family.description,
      this.mapFeatures(familyFeatures),
      price.unitAmount ?? 0,
      price.provider
    );
  }

  private mapFeatures(
    familyFeatures: SubscriptionPlanFamilyFeatureEntity[]
  ): string[] {
    return familyFeatures
      .sort((a, b) => a.order - b.order)
      .map((feature) => feature.name);
  }
}

const subscriptionPlanMapper = new SubscriptionPlanMapper();

/**
 * Maps subscription plan data input to a normalized {@link SubscriptionPlan}.
 *
 * @returns The mapped subscription plan.
 */
export const mapSubscriptionPlan = (
  input: Nullable<SubscriptionPlanMapperInput> | SubscriptionPlanMapperInput[]
) => {
  return subscriptionPlanMapper.map(input);
};

// -----------------------------------------------------------------
// Subscription Plan Path Calculators
// -----------------------------------------------------------------

/**
 * Calculates the subscription plan family paths.
 *
 * @returns The calculated subscription plan family paths.
 */
export const calculateSubscriptionPlanFamilyPaths = (
  targetGroupItemId: string,
  availableGroupItems: SubscriptionPlanFamilyGroupItemEntity[],
  availableGroupPaths: SubscriptionPlanFamilyGroupPathEntity[],
  availablePlans: SubscriptionPlan[]
): SubscriptionPlanPathDto => {
  const upgrades: SubscriptionPlan[] = [];
  const downgrades: SubscriptionPlan[] = [];
  const sidegrades: SubscriptionPlan[] = [];

  // Step 1: Map group items to their families
  const familyGroupItemMap = new Map<
    string,
    SubscriptionPlanFamilyGroupItemEntity
  >();

  for (const item of availableGroupItems) {
    familyGroupItemMap.set(item.familyId, item);
  }

  // Step 2: Map items to their paths
  const groupItemPathMap = new Map<string, BILLING_GRADE_CHANGE>();

  for (const path of availableGroupPaths) {
    if (path.fromItemId === targetGroupItemId) {
      groupItemPathMap.set(path.toItemId, path.path);
    }
  }

  // Step 3: Sort the plans based on the order of the group items
  const sortedPlans = availablePlans.sort((a, b) => {
    const aItem = familyGroupItemMap.get(a.familyId);
    const bItem = familyGroupItemMap.get(b.familyId);

    const aOrder = aItem?.order ?? 0;
    const bOrder = bItem?.order ?? 0;

    return aOrder - bOrder;
  });

  for (const plan of sortedPlans) {
    const familyItem = familyGroupItemMap.get(plan.familyId);

    if (!familyItem || familyItem.id === targetGroupItemId) {
      continue;
    }

    const gradeChange = groupItemPathMap.get(familyItem.id);

    if (!gradeChange) continue;

    switch (gradeChange) {
      case BILLING_GRADE_CHANGE.UPGRADE:
        upgrades.push(plan);
        break;
      case BILLING_GRADE_CHANGE.DOWNGRADE:
        downgrades.push(plan);
        break;
      case BILLING_GRADE_CHANGE.SIDEGRADE:
        sidegrades.push(plan);
        break;
    }
  }

  return SubscriptionPlanPathDto.with({
    upgrades: upgrades,
    downgrades: downgrades,
    sidegrades: sidegrades,
  });
};

/**
 * Calculates the subscription plan price paths.
 *
 * @returns The calculated subscription plan price paths.
 */
export const calculateSubscriptionPlanPricePaths = (
  quantity: number,
  currentPlan: SubscriptionPlan,
  availablePlans: SubscriptionPlan[]
): SubscriptionPlanPathDto => {
  const upgrades: SubscriptionPlan[] = [];
  const downgrades: SubscriptionPlan[] = [];
  const sidegrades: SubscriptionPlan[] = [];

  const sortedPlans = availablePlans.sort((a, b) => {
    return a.amount - b.amount;
  });

  for (const plan of sortedPlans) {
    if (plan.id === currentPlan.id) continue;

    const gradeChange = calculateBillingPriceGradeChange(
      quantity,
      currentPlan.amount,
      plan.amount
    );

    switch (gradeChange) {
      case BILLING_GRADE_CHANGE.UPGRADE:
        upgrades.push(plan);
        break;
      case BILLING_GRADE_CHANGE.DOWNGRADE:
        downgrades.push(plan);
        break;
      case BILLING_GRADE_CHANGE.SIDEGRADE:
        sidegrades.push(plan);
        break;
    }
  }

  return SubscriptionPlanPathDto.with({
    upgrades: upgrades,
    downgrades: downgrades,
    sidegrades: sidegrades,
  });
};

/**
 * Calculates the subscription plan frequency paths.
 *
 * @returns The calculated subscription plan frequency paths.
 */
export const calculateSubscriptionPlanFrequencyPaths = (
  currentPlan: SubscriptionPlan,
  availablePlans: SubscriptionPlan[]
): SubscriptionPlanPathDto => {
  const currentPlanId = currentPlan.id;
  const currentPlanFrequency = currentPlan.frequency;

  const upgrades: SubscriptionPlan[] = [];
  const downgrades: SubscriptionPlan[] = [];
  const sidegrades: SubscriptionPlan[] = [];

  const sortedPlans = availablePlans.sort((a, b) => {
    const aLevel = BILLING_FREQUENCY_LEVEL[a.frequency];
    const bLevel = BILLING_FREQUENCY_LEVEL[b.frequency];
    return aLevel - bLevel;
  });

  for (const plan of sortedPlans) {
    if (plan.id === currentPlanId) continue;

    const gradeChange = calculateBillingFrequencyGradeChange(
      currentPlanFrequency,
      plan.frequency
    );

    switch (gradeChange) {
      case BILLING_GRADE_CHANGE.UPGRADE:
        upgrades.push(plan);
        break;
      case BILLING_GRADE_CHANGE.DOWNGRADE:
        downgrades.push(plan);
        break;
      case BILLING_GRADE_CHANGE.SIDEGRADE:
        sidegrades.push(plan);
        break;
    }
  }

  return SubscriptionPlanPathDto.with({
    upgrades: upgrades,
    downgrades: downgrades,
    sidegrades: sidegrades,
  });
};
