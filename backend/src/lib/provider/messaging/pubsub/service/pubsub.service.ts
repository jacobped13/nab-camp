import { injectExceptionDetails, logger, Nullable } from '@common';
import { env } from '@env';
import { PubSub } from '@google-cloud/pubsub';
import { Subscription, Topic, Unsubscribe, Message } from '../common';
import {
  CreateSubscriptionInputDto,
  CreateTopicInputDto,
  FindOrCreateSubscriptionInputDto,
  FindOrCreateTopicInputDto,
  FindSubscriptionInputDto,
  FindTopicInputDto,
  MessageDto,
  PublishMessageInputDto,
  SubscribeInputDto,
} from './helper/pubsub.dto';

const LOG_PREFIX = 'Lib :: Provider :: Messaging :: PubSub';

const initializeClient = (serviceAccount: Record<string, string>): PubSub => {
  const client = new PubSub({
    projectId: serviceAccount.project_id,
    credentials: {
      ...serviceAccount,
    },
  });
  return client;
};

const client = initializeClient(env.PUBSUB_SERVICE_ACCOUNT);

/**
 * Find a Pub/Sub topic by name.
 *
 * @returns The found topic or null if not found.
 */
export const findTopic = async (
  input: FindTopicInputDto
): Promise<Nullable<Topic>> => {
  try {
    const { topicName } = input;

    const topicRef = client.topic(topicName);

    const [existingTopic] = await topicRef.get();

    return existingTopic;
  } catch (_error: unknown) {
    return null;
  }
};

/**
 * Create a Pub/Sub topic.
 *
 * @returns The created topic.
 */
export const createTopic = async (
  input: CreateTopicInputDto
): Promise<Topic> => {
  try {
    const { topicName } = input;

    const existingTopic = await findTopic({
      topicName: topicName,
    });

    if (existingTopic) {
      return existingTopic;
    }

    const [createdTopic] = await client.createTopic(topicName);

    return createdTopic;
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createTopic :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to create topic');
  }
};

/**
 * Find or create a Pub/Sub topic.
 *
 * @returns The found or created topic.
 */
export const findOrCreateTopic = async (
  input: FindOrCreateTopicInputDto
): Promise<Topic> => {
  try {
    const { topicName } = input;

    const existingTopic = await findTopic({
      topicName: topicName,
    });

    if (existingTopic) {
      return existingTopic;
    }

    return await createTopic({
      topicName: topicName,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findOrCreateTopic :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to find or create topic');
  }
};

/**
 * Find a Pub/Sub subscription by topic and subscription name.
 *
 * @returns The found subscription or null if not found.
 */
export const findSubscription = async (
  input: FindSubscriptionInputDto
): Promise<Nullable<Subscription>> => {
  try {
    const { topicName, subscriptionName } = input;

    const topicRef = client.topic(topicName);
    const subscriptionRef = topicRef.subscription(subscriptionName);

    const [existingSubscription] = await subscriptionRef.get();

    return existingSubscription;
  } catch (_error: unknown) {
    return null;
  }
};

/**
 * Create a Pub/Sub subscription.
 *
 * @returns The created subscription.
 */
export const createSubscription = async (
  input: CreateSubscriptionInputDto
): Promise<Subscription> => {
  try {
    const { topicName, subscriptionName, options } = input;

    const topicRef = client.topic(topicName);
    const subscriptionRef = topicRef.subscription(subscriptionName);

    const [createdSubscription] = await subscriptionRef.create({
      name: subscriptionName,
      enableMessageOrdering: options?.enableMessageOrdering,
      enableExactlyOnceDelivery: options?.enableExactlyOnceDelivery,
    });

    return createdSubscription;
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createSubscription :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to create subscription');
  }
};

/**
 * Find or create a Pub/Sub subscription.
 *
 * @returns The found or created subscription.
 */
export const findOrCreateSubscription = async (
  input: FindOrCreateSubscriptionInputDto
): Promise<Subscription> => {
  try {
    const { topicName, subscriptionName, options } = input;

    const existingSubscription = await findSubscription({
      topicName: topicName,
      subscriptionName: subscriptionName,
    });

    if (existingSubscription) {
      return existingSubscription;
    }

    return await createSubscription({
      topicName: topicName,
      subscriptionName: subscriptionName,
      options: options,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findOrCreateSubscription :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to find or create subscription');
  }
};

/**
 * Subscribe to a Pub/Sub topic.
 *
 * @returns An unsubscribe function.
 */
export const subscribe = async <T>(
  input: SubscribeInputDto<T>
): Promise<Unsubscribe> => {
  try {
    const { topicName, subscriptionName, messageEncoder, onMessage } = input;

    const topicRef = client.topic(topicName);
    const subscriptionRef = topicRef.subscription(subscriptionName);

    const handleMessage = async (message: Message) => {
      try {
        const data = messageEncoder.decode(message.data);
        const messageData = new MessageDto<T>(message, data);

        await onMessage(messageData);
      } catch (error: unknown) {
        logger.error(
          `${LOG_PREFIX} :: subscribe :: Failed to handle message`,
          injectExceptionDetails(error, {
            input: input,
            message: message,
          })
        );
      }
    };

    subscriptionRef.on('message', handleMessage);

    return () => {
      subscriptionRef.off('message', handleMessage);
    };
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: subscribe :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to subscribe to topic');
  }
};

/**
 * Publish a message to a Pub/Sub topic.
 *
 * @returns The ID of the published message.
 */
export const publishMessage = async <T>(
  input: PublishMessageInputDto<T>
): Promise<string> => {
  try {
    const { topicName, messageEncoder, data } = input;

    const topicRef = client.topic(topicName);
    const messageBuffer = messageEncoder.encode(data);

    const messageId = await topicRef.publishMessage({
      data: messageBuffer,
    });

    return messageId;
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: publishMessage :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to publish message');
  }
};
