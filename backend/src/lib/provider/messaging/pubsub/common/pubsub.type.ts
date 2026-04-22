import {
  Subscription as PubSubSubscription,
  Topic as PubSubTopic,
  CreateSubscriptionOptions as CreatePubSubSubscriptionOptions,
  Message as PubSubMessage,
} from '@google-cloud/pubsub';

// -----------------------------------------------------------------
// Provider Types
// -----------------------------------------------------------------

export type Subscription = PubSubSubscription;

export type Topic = PubSubTopic;

export type CreateSubscriptionOptions = CreatePubSubSubscriptionOptions;

export type Message = PubSubMessage;

export type Unsubscribe = () => void;
