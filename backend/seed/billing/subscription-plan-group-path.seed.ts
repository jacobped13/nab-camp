import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  BILLING_GRADE_CHANGE,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
} from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: SubscriptionPlanFamilyGroupPath';

type SubscriptionPlanFamilyGroupPathConfig = {
  fromKey: SUBSCRIPTION_PLAN_FAMILY_KEY;
  toKey: SUBSCRIPTION_PLAN_FAMILY_KEY;
  path: BILLING_GRADE_CHANGE;
};

const SUBSCRIPTION_PLAN_FAMILY_GROUP_TO_CONFIG_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  SubscriptionPlanFamilyGroupPathConfig[]
> = {
  [SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY.PUBLIC_JULY_2025]: [
    {
      fromKey: SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR,
      toKey: SUBSCRIPTION_PLAN_FAMILY_KEY.PRO,
      path: BILLING_GRADE_CHANGE.UPGRADE,
    },
    {
      fromKey: SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR,
      toKey: SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS,
      path: BILLING_GRADE_CHANGE.UPGRADE,
    },
    {
      fromKey: SUBSCRIPTION_PLAN_FAMILY_KEY.PRO,
      toKey: SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR,
      path: BILLING_GRADE_CHANGE.DOWNGRADE,
    },
    {
      fromKey: SUBSCRIPTION_PLAN_FAMILY_KEY.PRO,
      toKey: SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS,
      path: BILLING_GRADE_CHANGE.UPGRADE,
    },
  ],
};

type SubscriptionPlanFamilyGroupPathSeed =
  Prisma.SubscriptionPlanFamilyGroupPathCreateArgs['data'];

const generateSubscriptionPlanFamilyGroupPathSeeds = async (): Promise<
  SubscriptionPlanFamilyGroupPathSeed[]
> => {
  const currentDate = new Date();

  const subscriptionPlanFamilyGroupPathSeedSets: SubscriptionPlanFamilyGroupPathSeed[][] =
    await Promise.all(
      Object.entries(SUBSCRIPTION_PLAN_FAMILY_GROUP_TO_CONFIG_MAP).map(
        async ([groupKey, configs]) => {
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

          return await Promise.all(
            configs.map(async (config) => {
              const fromFamily = await prisma.subscriptionPlanFamily.findUnique(
                {
                  where: {
                    key: config.fromKey,
                  },
                }
              );

              if (!fromFamily) {
                throw new Error(
                  `From subscription plan family not found for key: ${config.fromKey}`
                );
              }

              const fromItem =
                await prisma.subscriptionPlanFamilyGroupItem.findUnique({
                  where: {
                    familyId: fromFamily.id,
                  },
                });

              if (!fromItem) {
                throw new Error(
                  `From subscription plan family group item not found for groupId: ${group.id}, familyId: ${fromFamily.id}`
                );
              }

              const toFamily = await prisma.subscriptionPlanFamily.findUnique({
                where: {
                  key: config.toKey,
                },
              });

              if (!toFamily) {
                throw new Error(
                  `To subscription plan family not found for key: ${config.toKey}`
                );
              }

              const toItem =
                await prisma.subscriptionPlanFamilyGroupItem.findUnique({
                  where: {
                    familyId: toFamily.id,
                  },
                });

              if (!toItem) {
                throw new Error(
                  `To subscription plan group item not found for groupId: ${group.id}, familyId: ${toFamily.id}`
                );
              }

              return {
                groupId: group.id,
                fromItemId: fromItem.id,
                toItemId: toItem.id,
                path: config.path,
                createdAt: currentDate,
                updatedAt: currentDate,
              };
            })
          );
        }
      )
    );

  return subscriptionPlanFamilyGroupPathSeedSets.flat();
};

export const plantSubscriptionPlanFamilyGroupPathSeeds = async () => {
  try {
    const subscriptionPlanFamilyGroupPathSeeds =
      await generateSubscriptionPlanFamilyGroupPathSeeds();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        subscriptionPlanFamilyGroupPathSeeds.map((seed) => {
          return tx.subscriptionPlanFamilyGroupPath.upsert({
            where: {
              groupId_fromItemId_toItemId: {
                groupId: seed.groupId!,
                fromItemId: seed.fromItemId!,
                toItemId: seed.toItemId!,
              },
            },
            create: {
              groupId: seed.groupId!,
              path: seed.path,
              fromItemId: seed.fromItemId!,
              toItemId: seed.toItemId!,
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
      `${LOG_PREFIX} :: plantSubscriptionPlanFamilyGroupPathSeeds :: An unknown error occurred`,
      error
    );
  }
};
