import {
  BILLING_PROVIDER,
  BILLING_GRADE_CHANGE,
  BILLING_FREQUENCY,
  BILLING_FREQUENCY_LEVEL,
} from './billing.constant';

const validateLatestStripeResourceVersion = (
  targetResourceVersion: string,
  sourceResourceVersion: string
): boolean => {
  // The identifier for Stripe events is the event ID itself.
  return targetResourceVersion > sourceResourceVersion;
};

/**
 * Validates that the target resource version is greater than the source resource version.
 *
 * @returns {boolean} - Returns true if the target resource version is greater than the source resource version, false otherwise.
 */
export const validateLatestBillingProviderResourceVersion = (
  provider: BILLING_PROVIDER,
  targetResourceVersion: string,
  sourceResourceVersion: string
): boolean => {
  switch (provider) {
    case BILLING_PROVIDER.STRIPE:
      return validateLatestStripeResourceVersion(
        targetResourceVersion,
        sourceResourceVersion
      );
    default:
      throw new Error(`Unknown billing provider: ${provider}`);
  }
};

/**
 * Determines the billing grade change based on the quantity and unit amount changes.
 *
 * @returns The billing grade change.
 */
export const calculateBillingPriceGradeChange = (
  quantity: number,
  fromUnitAmount: number,
  toUnitAmount: number
): BILLING_GRADE_CHANGE => {
  const fromTotal = quantity * fromUnitAmount;
  const toTotal = quantity * toUnitAmount;

  if (toTotal > fromTotal) {
    return BILLING_GRADE_CHANGE.UPGRADE;
  }

  if (toTotal < fromTotal) {
    return BILLING_GRADE_CHANGE.DOWNGRADE;
  }

  return BILLING_GRADE_CHANGE.SIDEGRADE;
};

/**
 * Calculates the billing frequency grade change.
 *
 * @returns The billing grade change.
 */
export const calculateBillingFrequencyGradeChange = (
  fromFrequency: BILLING_FREQUENCY,
  toFrequency: BILLING_FREQUENCY
): BILLING_GRADE_CHANGE => {
  const fromLevel = BILLING_FREQUENCY_LEVEL[fromFrequency];
  const toLevel = BILLING_FREQUENCY_LEVEL[toFrequency];

  if (toLevel > fromLevel) {
    return BILLING_GRADE_CHANGE.UPGRADE;
  }

  if (toLevel < fromLevel) {
    return BILLING_GRADE_CHANGE.DOWNGRADE;
  }

  return BILLING_GRADE_CHANGE.SIDEGRADE;
};
