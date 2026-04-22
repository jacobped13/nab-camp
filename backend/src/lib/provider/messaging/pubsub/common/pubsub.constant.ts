/**
 * Represents the available topics in the Pub/Sub system.
 */
export enum PUBSUB_TOPIC_NAME {
  DOCUMENT_CREATED = 'document.created',
}

/**
 * Represents all of the available Pub/Sub topic names.
 */
export const PUBSUB_TOPIC_NAMES = Object.values(PUBSUB_TOPIC_NAME);

/**
 * Represents the available subscriptions in the Pub/Sub system.
 */
export enum PUBSUB_SUBSCRIPTION_NAME {
  DOCUMENT_CREATED = 'document.created.subscription',
}

/**
 * Represents all of the available Pub/Sub subscription names.
 */
export const PUBSUB_SUBSCRIPTION_NAMES = Object.values(
  PUBSUB_SUBSCRIPTION_NAME
);
