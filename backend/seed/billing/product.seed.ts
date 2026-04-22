import { Prisma } from '@prisma/client';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import { findAllProducts } from '@lib/provider/billing/stripe/stripe.service';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_PRODUCT_STATUS,
} from '@service/billing';

const LOG_PREFIX = 'Seed :: Billing :: Product';

type ProductSeed = Prisma.ProductCreateArgs['data'];

const generateStripeProductSeeds = async (): Promise<ProductSeed[]> => {
  const stripeProducts = await findAllProducts();
  const currentDate = new Date();

  return stripeProducts.map((product) => {
    return {
      provider: BILLING_PROVIDER.STRIPE,
      providerId: product.id,
      status: product.active
        ? BILLING_PROVIDER_PRODUCT_STATUS.ACTIVE
        : BILLING_PROVIDER_PRODUCT_STATUS.INACTIVE,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
  });
};

export const plantProductSeeds = async () => {
  try {
    // Step 1: Retrieve all existing products from our billing providers
    const billingProviderSeedSets = await Promise.all([
      generateStripeProductSeeds(),
    ]);

    // Step 2: Flatten the array of arrays into a single array
    const billingProviderSeeds = billingProviderSeedSets.flat();

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        billingProviderSeeds.map((seed) => {
          return tx.product.upsert({
            where: {
              provider_providerId: {
                provider: seed.provider,
                providerId: seed.providerId,
              },
            },
            create: {
              provider: seed.provider,
              providerId: seed.providerId,
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
