import {
  CreateSubscriptionInputDto,
  PUBSUB_SUBSCRIPTION_NAME,
  PUBSUB_TOPIC_NAME,
  pubSubService,
} from '@lib/provider/messaging/pubsub';

const LOG_PREFIX = 'Seed :: Messaging :: Topic';

export type SubscriptionConfig = Omit<CreateSubscriptionInputDto, 'topicName'>;

export const TOPIC_NAME_SUBSCRIPTION_MAP: Partial<
  Record<PUBSUB_TOPIC_NAME, SubscriptionConfig[]>
> = {
  [PUBSUB_TOPIC_NAME.DOCUMENT_CREATED]: [
    {
      subscriptionName: PUBSUB_SUBSCRIPTION_NAME.DOCUMENT_CREATED,
      options: {
        enableMessageOrdering: true,
        enableExactlyOnceDelivery: true,
      },
    },
  ],
};

export const plantMessagingSubscriptionSeeds = async () => {
  try {
    await Promise.all(
      Object.entries(TOPIC_NAME_SUBSCRIPTION_MAP).map(
        async ([topicName, subscriptionConfigs]) => {
          const normalizedTopicName = topicName as PUBSUB_TOPIC_NAME;
          await Promise.all(
            subscriptionConfigs.map(async (subscriptionConfig) => {
              await pubSubService.findOrCreateSubscription({
                topicName: normalizedTopicName,
                ...subscriptionConfig,
              });
            })
          );
        }
      )
    );
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantMessagingSubscriptionSeeds :: An unknown error occurred`,
      error
    );
  }
};
