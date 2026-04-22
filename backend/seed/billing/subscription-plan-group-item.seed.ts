import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
} from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: SubscriptionPlanFamilyGroupItem';

type SubscriptionPlanFamilyGroupConfig = {
  key: SUBSCRIPTION_PLAN_FAMILY_KEY;
  order: number;
};

const SUBSCRIPTION_PLAN_GROUP_TO_CONFIG_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  SubscriptionPlanFamilyGroupConfig[]
> = {
  [SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY.PUBLIC_JULY_2025]: [
    {
      key: SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR,
      order: 0,
    },
    {
      key: SUBSCRIPTION_PLAN_FAMILY_KEY.PRO,
      order: 1,
    },
    {
      key: SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS,
      order: 2,
    },
  ],
};

type SubscriptionPlanFamilyGroupItemSeed =
  Prisma.SubscriptionPlanFamilyGroupItemCreateArgs['data'];

const generateSubscriptionPlanFamilyGroupItemSeeds = async (): Promise<
  SubscriptionPlanFamilyGroupItemSeed[]
> => {
  const currentDate = new Date();

  const subscriptionPlanFamilyGroupItemSeedSets: SubscriptionPlanFamilyGroupItemSeed[][] =
    await Promise.all(
      Object.entries(SUBSCRIPTION_PLAN_GROUP_TO_CONFIG_MAP).map(
        async ([groupKey, configs]) => {
          // Step 1: Retrieve ethe group by key
          const group = await prisma.subscriptionPlanFamilyGroup.findUnique({
            where: {
              key: groupKey,
            },
          });

          if (!group) {
            throw new Error(
              `Subscription plan family group not found for key: ${groupKey}`
            );
          }

          // Step 2: Retrieve all families for the group
          const families = await prisma.subscriptionPlanFamily.findMany({
            where: {
              key: {
                in: configs.map((config) => config.key),
              },
            },
          });

          const planKeyConfigMap = new Map(
            configs.map((config) => [config.key, config])
          );

          // Step 3: For each group, create a seed
          return families.map((family) => {
            const config = planKeyConfigMap.get(
              family.key as SUBSCRIPTION_PLAN_FAMILY_KEY
            )!;
            return {
              groupId: group.id,
              familyId: family.id,
              order: config.order,
              createdAt: currentDate,
              updatedAt: currentDate,
            };
          });
        }
      )
    );

  return subscriptionPlanFamilyGroupItemSeedSets.flat();
};

export const plantSubscriptionPlanFamilyGroupItemSeeds = async () => {
  try {
    const subscriptionPlanFamilyGroupItemSeeds =
      await generateSubscriptionPlanFamilyGroupItemSeeds();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        subscriptionPlanFamilyGroupItemSeeds.map((seed) => {
          return tx.subscriptionPlanFamilyGroupItem.upsert({
            where: {
              familyId: seed.familyId!,
            },
            create: {
              groupId: seed.groupId!,
              familyId: seed.familyId!,
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
      `${LOG_PREFIX} :: plantSubscriptionPlanFamilyGroupItemSeeds :: An unknown error occurred`,
      error
    );
  }
};
