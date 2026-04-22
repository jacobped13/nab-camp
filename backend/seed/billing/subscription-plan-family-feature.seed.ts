import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { SUBSCRIPTION_PLAN_FAMILY_KEY } from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: SubscriptionPlanFamilyFeature';

type SubscriptionPlanFamilyFeatureConfig = {
  name: string;
  order: number;
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_FEATURE_LIST_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SubscriptionPlanFamilyFeatureConfig[]
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: [
    { name: '2 users', order: 0 },
    { name: 'Plan features', order: 1 },
    { name: 'Product support', order: 2 },
  ],
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: [
    { name: '5 users', order: 0 },
    { name: 'Plan features', order: 1 },
    { name: 'Product support', order: 2 },
  ],
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: [
    { name: '10 users', order: 0 },
    { name: 'Plan features', order: 1 },
    { name: 'Product support', order: 2 },
  ],
};

type SubscriptionPlanFeatureSeed =
  Prisma.SubscriptionPlanFamilyFeatureCreateArgs['data'];

const generateSubscriptionPlanFamilyFeatureSeeds = async (): Promise<
  SubscriptionPlanFeatureSeed[]
> => {
  const currentDate = new Date();

  const subscriptionPlanFamilyFeatureSeedSets: SubscriptionPlanFeatureSeed[][] =
    await Promise.all(
      Object.entries(SUBSCRIPTION_PLAN_FAMILY_KEY_TO_FEATURE_LIST_MAP).map(
        async ([planKey, featureConfigs]) => {
          // Retrieve the plan by key
          const family = await prisma.subscriptionPlanFamily.findUnique({
            where: {
              key: planKey,
            },
          });

          if (!family) {
            throw new Error(
              `Subscription plan family not found for plan key: ${planKey}`
            );
          }

          return featureConfigs.map((config) => {
            return {
              familyId: family.id,
              name: config.name,
              order: config.order,
              createdAt: currentDate,
              updatedAt: currentDate,
            };
          });
        }
      )
    );

  return subscriptionPlanFamilyFeatureSeedSets.flat();
};

export const plantSubscriptionPlanFamilyFeatureSeeds = async () => {
  try {
    const subscriptionPlanFamilyFeatureSeeds =
      await generateSubscriptionPlanFamilyFeatureSeeds();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        subscriptionPlanFamilyFeatureSeeds.map((seed) => {
          return tx.subscriptionPlanFamilyFeature.upsert({
            where: {
              familyId_order: {
                familyId: seed.familyId!,
                order: seed.order,
              },
            },
            create: {
              familyId: seed.familyId!,
              name: seed.name,
              order: seed.order,
              createdAt: seed.createdAt,
              updatedAt: seed.updatedAt,
            },
            // Leaving the `update` empty to avoid updating existing records
            update: {},
          });
        })
      );
    });
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantSubscriptionPlanFamilyFeatureSeeds :: An unknown error occurred`,
      error
    );
  }
};
