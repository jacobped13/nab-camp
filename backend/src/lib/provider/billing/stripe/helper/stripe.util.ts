import Stripe from 'stripe';

/**
 * Creates a redirect URL for the checkout session.
 *
 * @returns The full redirect URL with the session ID placeholder.
 */
export const createCheckoutSessionRedirectUrl = (
  baseUrl: string,
  sessionParamKey: string
): string => {
  const url = new URL(baseUrl);

  // Since we have to inject the template variable for the session ID,
  // we cannot use the search params API because it would encode the value.
  // Instead, we manually set the search parameter.
  const params = url.searchParams.toString();
  const sessionParam = `${sessionParamKey}={CHECKOUT_SESSION_ID}`;
  const searchString = params
    ? `?${params}&${sessionParam}`
    : `?${sessionParam}`;

  return `${url.origin}${url.pathname}${searchString}`;
};

/**
 * Calculates the proration behavior for a subscription update.
 *
 * @returns The proration behavior for the subscription update.
 */
export const calculateProrationBehavior = (
  prorate: boolean,
  chargeImmediately: boolean
): Stripe.SubscriptionUpdateParams.ProrationBehavior => {
  if (!prorate) {
    return 'none';
  }

  if (chargeImmediately) {
    return 'always_invoice';
  }

  return 'create_prorations';
};
