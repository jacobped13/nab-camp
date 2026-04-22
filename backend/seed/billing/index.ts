import { plantProductSeeds } from './product.seed';
import { plantPriceSeeds } from './price.seed';
import { plantSubscriptionPlanFamilySeeds } from './subscription-plan-family.seed';
import { plantSubscriptionPlanFamilyFeatureSeeds } from './subscription-plan-family-feature.seed';
import { plantSubscriptionPlanSeeds } from './subscription-plan-frequency.seed';
import { plantSubscriptionPlanFamilyGroupSeeds } from './subscription-plan-group.seed';
import { plantSubscriptionPlanFamilyGroupItemSeeds } from './subscription-plan-group-item.seed';
import { plantSubscriptionPlanFamilyGroupPathSeeds } from './subscription-plan-group-path.seed';

export const plantBillingSeeds = async () => {
  // Step 1: Plant product seeds
  await plantProductSeeds();

  // Step 2: Plant price seeds
  await plantPriceSeeds();

  // Step 3: Plant subscription plan family seeds
  await plantSubscriptionPlanFamilySeeds();

  // Step 4: Plant subscription plan family feature seeds
  await plantSubscriptionPlanFamilyFeatureSeeds();

  // Step 5: Plant subscription plan seeds
  await plantSubscriptionPlanSeeds();

  // Step 6: Plant subscription plan family group seeds
  await plantSubscriptionPlanFamilyGroupSeeds();

  // Step 7: Plant subscription plan family group item seeds
  await plantSubscriptionPlanFamilyGroupItemSeeds();

  // Step 8: Plant subscription plan family group path seeds
  await plantSubscriptionPlanFamilyGroupPathSeeds();
};
