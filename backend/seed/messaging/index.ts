import { plantMessagingTopicSeeds } from './topic.seed';
import { plantMessagingSubscriptionSeeds } from './subscription.seed';

export const plantMessagingSeeds = async () => {
  // Step 1: Plant topic seeds
  await plantMessagingTopicSeeds();

  // Step 2: Plant subscription seeds
  await plantMessagingSubscriptionSeeds();
};
