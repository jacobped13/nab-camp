import { isProductionEnvironment } from '@env';
import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  BILLING_PROVIDER,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  BILLING_FREQUENCY,
} from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: SubscriptionPlan';

type SubscriptionPlanFrequencyMap = Partial<Record<BILLING_FREQUENCY, string>>;

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_FREQUENCY_STRIPE_PRICE_ID_MAP_STAGING: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SubscriptionPlanFrequencyMap
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: {
    [BILLING_FREQUENCY.MONTHLY]: 'price_1RjscwH9b8EvLaPoGjI2rSet',
    [BILLING_FREQUENCY.YEARLY]: 'price_1RjsdgH9b8EvLaPoOk10FhpW',
  },
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: {
    [BILLING_FREQUENCY.MONTHLY]: 'price_1RjsfVH9b8EvLaPoqGTWbcDa',
    [BILLING_FREQUENCY.YEARLY]: 'price_1RjsfoH9b8EvLaPobgWyQ2EL',
  },
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: {
    [BILLING_FREQUENCY.MONTHLY]: 'price_1RlISaH9b8EvLaPoWoa5xYUX',
    [BILLING_FREQUENCY.YEARLY]: 'price_1RlISnH9b8EvLaPoQ7EkYW5K',
  },
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_FREQUENCY_STRIPE_PRICE_ID_MAP_PRODUCTION: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SubscriptionPlanFrequencyMap
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: {
    [BILLING_FREQUENCY.MONTHLY]: 'TODO_CREATOR_PRICE_ID_MONTHLY',
    [BILLING_FREQUENCY.YEARLY]: 'TODO_CREATOR_PRICE_ID_YEARLY',
  },
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: {
    [BILLING_FREQUENCY.MONTHLY]: 'TODO_PRO_PRICE_ID_MONTHLY',
    [BILLING_FREQUENCY.YEARLY]: 'TODO_PRO_PRICE_ID_YEARLY',
  },
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: {
    // Intention leaveing this empty to force manual setup
  },
};

const getSubscriptionPlanKeyToPriceIdMap = (): Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SubscriptionPlanFrequencyMap
> => {
  if (isProductionEnvironment()) {
    return SUBSCRIPTION_PLAN_FAMILY_KEY_TO_FREQUENCY_STRIPE_PRICE_ID_MAP_PRODUCTION;
  }
  return SUBSCRIPTION_PLAN_FAMILY_KEY_TO_FREQUENCY_STRIPE_PRICE_ID_MAP_STAGING;
};

type SubscriptionPlanSeed = Prisma.SubscriptionPlanCreateArgs['data'];

const generateStripeSubscriptionPlanSeeds = async (): Promise<
  SubscriptionPlanSeed[]
> => {
  const currentDate = new Date();
  const frequencyPriceIdMap = getSubscriptionPlanKeyToPriceIdMap();

  const subscriptionPlanSeedSets: SubscriptionPlanSeed[][] = await Promise.all(
    Object.entries(frequencyPriceIdMap).map(async ([planKey, frequencyMap]) => {
      // Step 1: Retrieve the subscription plan family by key
      const subscriptionPlanFamily =
        await prisma.subscriptionPlanFamily.findUnique({
          where: {
            key: planKey as SUBSCRIPTION_PLAN_FAMILY_KEY,
          },
        });

      if (!subscriptionPlanFamily) {
        throw new Error(
          `Subscription plan family not found for key: ${planKey}`
        );
      }

      // Step 2: For each frequency, create a seed
      const subscriptionPlanSeeds: SubscriptionPlanSeed[] = await Promise.all(
        Object.entries(frequencyMap).map(async ([frequency, priceId]) => {
          // Retrieve the price by provider and ID
          const price = await prisma.price.findUnique({
            where: {
              provider_providerId: {
                provider: BILLING_PROVIDER.STRIPE,
                providerId: priceId,
              },
            },
          });

          if (!price) {
            throw new Error(`Price not found for provider ID: ${priceId}`);
          }

          return {
            familyId: subscriptionPlanFamily.id,
            frequency: frequency as BILLING_FREQUENCY,
            priceId: price.id,
            createdAt: currentDate,
            updatedAt: currentDate,
          };
        })
      );

      return subscriptionPlanSeeds;
    })
  );

  return subscriptionPlanSeedSets.flat();
};

export const plantSubscriptionPlanSeeds = async () => {
  try {
    // Retrieve all subscription plan seeds
    const subscriptionPlanSeedSets = await Promise.all([
      generateStripeSubscriptionPlanSeeds(),
    ]);

    // Step 2: Flatten the array of arrays into a single array
    const subscriptionPlanSeeds = subscriptionPlanSeedSets.flat();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        subscriptionPlanSeeds.map((seed) => {
          return tx.subscriptionPlan.upsert({
            where: {
              familyId_frequency: {
                familyId: seed.familyId!,
                frequency: seed.frequency,
              },
            },
            create: {
              familyId: seed.familyId!,
              priceId: seed.priceId!,
              frequency: seed.frequency,
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
      `${LOG_PREFIX} :: plantSubscriptionPlanSeeds :: An unknown error occurred`,
      error
    );
  }
};
