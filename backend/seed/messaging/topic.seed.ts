import {
  PUBSUB_TOPIC_NAMES,
  pubSubService,
} from '@lib/provider/messaging/pubsub';

const LOG_PREFIX = 'Seed :: Messaging :: Topic';

export const plantMessagingTopicSeeds = async () => {
  try {
    await Promise.all(
      PUBSUB_TOPIC_NAMES.map(async (topicName) => {
        await pubSubService.findOrCreateTopic({
          topicName: topicName,
        });
      })
    );
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantMessagingTopicSeeds :: An unknown error occurred`,
      error
    );
  }
};
