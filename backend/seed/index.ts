import '@env';
import { plantAuthorizationSeeds } from './authorization';
import { plantBillingSeeds } from './billing';
import { plantMessagingSeeds } from './messaging';
import { plantStorageSeeds } from './storage';

const plantSeeds = async () => {
  try {
    console.log('Planting seeds...');

    await Promise.all([
      // Step 1: Authorization Seeds
      plantAuthorizationSeeds(),

      // Step 2: Billing Seeds
      plantBillingSeeds(),

      // Step 3: Messaging Seeds
      plantMessagingSeeds(),

      // Step 4: Storage Seeds
      plantStorageSeeds(),
    ]);

    console.log('Successfully planted all seeds (in your mum)');
  } catch (error: unknown) {
    console.error('An error occurred while planting seeds:', error);
  }
};

plantSeeds();
