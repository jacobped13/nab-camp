import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { findAllPrices } from '@lib/provider/billing/stripe/stripe.service';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_PRICE_STATUS,
} from '@service/billing';
import { Nullable } from '@common';

const LOG_PREFIX = 'Seed :: Billing :: Price';

type PriceSeed = {
  provider: BILLING_PROVIDER;
  providerId: string;
  providerProductId: string;
  status: BILLING_PROVIDER_PRICE_STATUS;
  unitAmount: Nullable<number>;
  createdAt: Date;
  updatedAt: Date;
};

const generateStripePriceSeeds = async (): Promise<PriceSeed[]> => {
  const stripePrices = await findAllPrices();
  const currentDate = new Date();

  return stripePrices.map((price) => {
    return {
      provider: BILLING_PROVIDER.STRIPE,
      providerId: price.id,
      providerProductId: price.product as string,
      status: price.active
        ? BILLING_PROVIDER_PRICE_STATUS.ACTIVE
        : BILLING_PROVIDER_PRICE_STATUS.INACTIVE,
      unitAmount: price.unit_amount ?? null,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
  });
};

export const plantPriceSeeds = async () => {
  try {
    // Step 1: Retrieve all existing prices from our billing providers
    const billingProviderSeedSets = await Promise.all([
      generateStripePriceSeeds(),
    ]);

    // Step 2: Flatten the array of arrays into a single array
    const billingProviderSeeds = billingProviderSeedSets.flat();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        billingProviderSeeds.map(async (seed) => {
          // Ensure the product for the price exists before upserting the price
          const product = await tx.product.findUnique({
            where: {
              provider_providerId: {
                provider: seed.provider,
                providerId: seed.providerProductId,
              },
            },
          });

          // If the product does not exist, skip the price upsert
          if (!product) {
            return;
          }

          return tx.price.upsert({
            where: {
              provider_providerId: {
                provider: seed.provider,
                providerId: seed.providerId,
              },
            },
            create: {
              provider: seed.provider,
              providerId: seed.providerId,
              productId: product.id,
              unitAmount: seed.unitAmount,
              status: seed.status,
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
      `${LOG_PREFIX} :: plantProductSeeds :: An unknown error occurred`,
      error
    );
  }
};
