import {
  PUBSUB_TOPIC_NAME,
  PUBSUB_SUBSCRIPTION_NAME,
  Message,
  MessageEncoder,
} from '../../common';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

export class MessageDto<T> {
  constructor(
    public readonly _message: Message,
    public readonly data: T
  ) {}

  public ack(): void {
    this._message.ack();
  }

  public nack(): void {
    this._message.nack();
  }

  public get publishedAt(): Date {
    return this._message.publishTime;
  }
}

export type MessageHandler<T> = (
  message: MessageDto<T>
) => Promise<void> | void;

// -----------------------------------------------------------------
// Find Topic
// -----------------------------------------------------------------

export type FindTopicInputDto = {
  topicName: PUBSUB_TOPIC_NAME;
};

// -----------------------------------------------------------------
// Create Topic
// -----------------------------------------------------------------

export type CreateTopicInputDto = {
  topicName: PUBSUB_TOPIC_NAME;
};

// -----------------------------------------------------------------
// Find or Create Topic
// -----------------------------------------------------------------

export type FindOrCreateTopicInputDto = {
  topicName: PUBSUB_TOPIC_NAME;
};

// -----------------------------------------------------------------
// Find Subscription
// -----------------------------------------------------------------

export type FindSubscriptionInputDto = {
  topicName: PUBSUB_TOPIC_NAME;
  subscriptionName: PUBSUB_SUBSCRIPTION_NAME;
};

// -----------------------------------------------------------------
// Create Subscription
// -----------------------------------------------------------------

export type CreateSubscriptionOptionsDto = {
  enableMessageOrdering?: boolean;
  enableExactlyOnceDelivery?: boolean;
};

export type CreateSubscriptionInputDto = {
  topicName: PUBSUB_TOPIC_NAME;
  subscriptionName: PUBSUB_SUBSCRIPTION_NAME;
  options?: CreateSubscriptionOptionsDto;
};

// -----------------------------------------------------------------
// Find or Create Subscription
// -----------------------------------------------------------------

export type FindOrCreateSubscriptionInputDto = {
  topicName: PUBSUB_TOPIC_NAME;
  subscriptionName: PUBSUB_SUBSCRIPTION_NAME;
  options?: CreateSubscriptionOptionsDto;
};

// -----------------------------------------------------------------
// Publish Message
// -----------------------------------------------------------------

export type PublishMessageInputDto<T> = {
  topicName: PUBSUB_TOPIC_NAME;
  messageEncoder: MessageEncoder<T>;
  data: T;
};

// -----------------------------------------------------------------
// Subscribe to Topic
// -----------------------------------------------------------------

export type SubscribeInputDto<T> = {
  topicName: PUBSUB_TOPIC_NAME;
  subscriptionName: PUBSUB_SUBSCRIPTION_NAME;
  messageEncoder: MessageEncoder<T>;
  onMessage: MessageHandler<T>;
};
