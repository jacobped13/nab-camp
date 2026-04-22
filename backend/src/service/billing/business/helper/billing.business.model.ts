import { Nullable } from '@common';
import {
  BILLING_FREQUENCY,
  SUBSCRIPTION_PLAN_FAMILY_KEY,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
  SUBSCRIPTION_PLAN_TYPE,
  BILLING_PROVIDER,
} from '../../common/billing.constant';

/**
 * Represents a subscription plan in the system.
 */
export class SubscriptionPlan {
  constructor(
    // -----------------------------------------------------------------
    // Plan
    // -----------------------------------------------------------------
    public readonly id: string,
    public readonly priceId: string,
    public readonly frequency: BILLING_FREQUENCY,
    // -----------------------------------------------------------------
    // Family
    // -----------------------------------------------------------------
    public readonly familyId: string,
    public readonly familyKey: SUBSCRIPTION_PLAN_FAMILY_KEY,
    public readonly productId: string,
    public readonly type: SUBSCRIPTION_PLAN_TYPE,
    public readonly setupType: SUBSCRIPTION_PLAN_SETUP_TYPE,
    public readonly name: string,
    public readonly description: Nullable<string>,
    // -----------------------------------------------------------------
    // Family Features
    // -----------------------------------------------------------------
    public readonly features: string[],
    // -----------------------------------------------------------------
    // Price
    // -----------------------------------------------------------------
    public readonly amount: number,
    public readonly provider: BILLING_PROVIDER
  ) {}

  public isSelfService(): boolean {
    return this.setupType === SUBSCRIPTION_PLAN_SETUP_TYPE.SELF_SERVICE;
  }
}
