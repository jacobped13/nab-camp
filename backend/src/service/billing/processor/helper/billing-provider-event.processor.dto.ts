import { BILLING_PROVIDER } from '../../common/billing.constant';
import {
  BusinessResult,
  BusinessResultInputContextErrorDto,
  ExecutionContext,
} from '@common';
import { Event as StripeEvent } from '@lib/provider/billing/stripe';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

/**
 * Input type for billing provider event processing.
 */
export type BillingProviderEventProcessorInput<T> = {
  provider: BILLING_PROVIDER;
  providerId: string;
  publishedAt: Date;
  event: T;
};

/**
 * Output type for billing provider event processing.
 */
export type BillingProviderEventProcessorOutput = {
  processed: boolean;
};

/**
 * Error type for billing provider event processing.
 */
export type BillingProviderEventProcessorError<T> =
  BusinessResultInputContextErrorDto<BillingProviderEventProcessorInput<T>>;

/**
 * Function type for processing billing provider events.
 */
export type BillingProviderEventProcessor<T> = (
  executionContext: ExecutionContext,
  input: BillingProviderEventProcessorInput<T>
) => Promise<
  BusinessResult<
    BillingProviderEventProcessorOutput,
    BillingProviderEventProcessorError<T>
  >
>;

/**
 * Union type of all possible billing provider events
 */
export type BillingProviderEvent = StripeEvent;
