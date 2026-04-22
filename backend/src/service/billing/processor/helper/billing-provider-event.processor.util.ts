import { BILLING_PROVIDER } from '@service/billing/common/billing.constant';
import { BillingProviderEvent } from './billing-provider-event.processor.dto';
import { TIMING } from '@shared-lib/timing';
import { generateBillingProviderResourceVersion } from '../../provider/helper/billing.provider.util';

const extractStripeResourceVersionFromEvent = (
  provider: BILLING_PROVIDER,
  event: BillingProviderEvent
) => {
  return generateBillingProviderResourceVersion(
    provider,
    new Date(event.created * TIMING.SECOND.IN_MILLISECONDS),
    event.id
  );
};

/**
 * Extract the resource version from a billing provider event.
 */
export const extractBillingProviderResourceVersionFromEvent = (
  provider: BILLING_PROVIDER,
  event: BillingProviderEvent
): string => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return extractStripeResourceVersionFromEvent(provider, event);
    default:
      throw new Error(`Unknown billing provider: ${provider}`);
  }
};
