import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { SUBSCRIPTION_PLAN_FAMILY_GROUP_KEYS } from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: SubscriptionPlanFamilyGroup';

type SubscriptionPlanFamilyGroupSeed =
  Prisma.SubscriptionPlanFamilyGroupCreateArgs['data'];

const generateSubscriptionPlanFamilyGroupSeeds =
  (): SubscriptionPlanFamilyGroupSeed[] => {
    const currentDate = new Date();

    return SUBSCRIPTION_PLAN_FAMILY_GROUP_KEYS.map((groupKey) => {
      return {
        key: groupKey,
        createdAt: currentDate,
        updatedAt: currentDate,
      };
    });
  };

export const plantSubscriptionPlanFamilyGroupSeeds = async () => {
  try {
    const subscriptionPlanFamilyGroupSeeds =
      generateSubscriptionPlanFamilyGroupSeeds();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        subscriptionPlanFamilyGroupSeeds.map((seed) => {
          return tx.subscriptionPlanFamilyGroup.upsert({
            where: {
              key: seed.key,
            },
            create: {
              key: seed.key,
              createdAt: seed.createdAt,
              updatedAt: seed.updatedAt,
            },
            update: {
              // Leaving the `update` empty to avoid updating existing records
            },
          });
        })
      );
    });
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantSubscriptionPlanFamilyGroupSeeds :: An unknown error occurred`,
      error
    );
  }
};
