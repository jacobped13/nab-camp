import { isProductionEnvironment } from '@env';
import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  BILLING_PROVIDER,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SUBSCRIPTION_PLAN_TYPE,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
} from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: SubscriptionPlanFamily';

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_SETUP_TYPE_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SUBSCRIPTION_PLAN_SETUP_TYPE
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]:
    SUBSCRIPTION_PLAN_SETUP_TYPE.SELF_SERVICE,
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: SUBSCRIPTION_PLAN_SETUP_TYPE.SELF_SERVICE,
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: SUBSCRIPTION_PLAN_SETUP_TYPE.MANUAL,
};

const mapSubscriptionPlanFamilyKeyToSetupType = (
  planKey: SUBSCRIPTION_PLAN_FAMILY_KEY
): SUBSCRIPTION_PLAN_SETUP_TYPE => {
  return SUBSCRIPTION_PLAN_FAMILY_KEY_TO_SETUP_TYPE_MAP[planKey];
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_TYPE_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SUBSCRIPTION_PLAN_TYPE
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: SUBSCRIPTION_PLAN_TYPE.ACCESS,
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: SUBSCRIPTION_PLAN_TYPE.ACCESS,
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: SUBSCRIPTION_PLAN_TYPE.ACCESS,
};

const mapSubscriptionPlanFamilyKeyToType = (
  planKey: SUBSCRIPTION_PLAN_FAMILY_KEY
): SUBSCRIPTION_PLAN_TYPE => {
  return SUBSCRIPTION_PLAN_FAMILY_KEY_TO_TYPE_MAP[planKey];
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_DESCRIPTION_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  string
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]:
    'All the basics for starting a new business',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]:
    'Everything you need for a growing business',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]:
    'Advanced features for scaling your business',
};

const mapSubscriptionPlanFamilyKeyToDescription = (
  planKey: SUBSCRIPTION_PLAN_FAMILY_KEY
): string => {
  return SUBSCRIPTION_PLAN_FAMILY_KEY_TO_DESCRIPTION_MAP[planKey];
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_TO_NAME_MAP: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  string
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: 'Creator',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: 'Pro',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: 'Business',
};

const mapSubscriptionPlanFamilyKeyToName = (
  planKey: SUBSCRIPTION_PLAN_FAMILY_KEY
): string => {
  return SUBSCRIPTION_PLAN_FAMILY_KEY_TO_NAME_MAP[planKey];
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_STRIPE_PRODUCT_ID_MAP_STAGING: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  string
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: 'prod_SeTKvygD6ALJ8t',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: 'prod_ScqzoPIG5P63Z8',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: 'prod_SfCe1cpvCApWyM',
};

const SUBSCRIPTION_PLAN_FAMILY_KEY_STRIPE_PRODUCT_ID_MAP_PRODUCTION: Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  string
> = {
  [SUBSCRIPTION_PLAN_FAMILY_KEY.CREATOR]: 'TODO_CREATOR_PRODUCT_ID',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.PRO]: 'TODO_PRO_PRODUCT_ID',
  [SUBSCRIPTION_PLAN_FAMILY_KEY.BUSINESS]: 'TODO_BUSINESS_PRODUCT_ID',
};

const getSubscriptionPlanFamilyKeyStripeProductIdMap = (): Record<
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  string
> => {
  if (isProductionEnvironment()) {
    return SUBSCRIPTION_PLAN_FAMILY_KEY_STRIPE_PRODUCT_ID_MAP_PRODUCTION;
  }
  return SUBSCRIPTION_PLAN_FAMILY_KEY_STRIPE_PRODUCT_ID_MAP_STAGING;
};

type SubscriptionPlanFamilySeed =
  Prisma.SubscriptionPlanFamilyCreateArgs['data'];

const generateStripeSubscriptionPlanFamilySeeds = async (): Promise<
  SubscriptionPlanFamilySeed[]
> => {
  const currentDate = new Date();
  const targetPlanKeyMap = getSubscriptionPlanFamilyKeyStripeProductIdMap();

  const subscriptionPlanFamilySeeds: SubscriptionPlanFamilySeed[] =
    await Promise.all(
      Object.entries(targetPlanKeyMap).map(async ([planKey, productId]) => {
        // Retrieve the product connection by the provider
        const productConnection = await prisma.product.findUnique({
          where: {
            provider_providerId: {
              provider: BILLING_PROVIDER.STRIPE,
              providerId: productId,
            },
          },
        });

        if (!productConnection) {
          throw new Error(
            `Product connection not found for product ID: ${productId}`
          );
        }

        const targetPlanKey = planKey as SUBSCRIPTION_PLAN_FAMILY_KEY;

        return {
          productId: productConnection.id,
          key: targetPlanKey,
          type: mapSubscriptionPlanFamilyKeyToType(targetPlanKey),
          setupType: mapSubscriptionPlanFamilyKeyToSetupType(targetPlanKey),
          name: mapSubscriptionPlanFamilyKeyToName(targetPlanKey),
          description: mapSubscriptionPlanFamilyKeyToDescription(targetPlanKey),
          createdAt: currentDate,
          updatedAt: currentDate,
        };
      })
    );

  return subscriptionPlanFamilySeeds;
};

export const plantSubscriptionPlanFamilySeeds = async () => {
  try {
    // Step 1: Retrieve all subscription plan family seeds for each billing provider
    const subscriptionPlanFamilySeedSets = await Promise.all([
      generateStripeSubscriptionPlanFamilySeeds(),
    ]);

    // Step 2: Flatten the array of arrays into a single array
    const subscriptionPlanFamilySeeds = subscriptionPlanFamilySeedSets.flat();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        subscriptionPlanFamilySeeds.map((seed) => {
          return tx.subscriptionPlanFamily.upsert({
            where: {
              key: seed.key,
            },
            create: {
              productId: seed.productId!,
              key: seed.key,
              name: seed.name,
              type: seed.type,
              setupType: seed.setupType,
              description: seed.description,
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
      `${LOG_PREFIX} :: plantSubscriptionPlanFamilySeeds :: An unknown error occurred`,
      error
    );
  }
};
