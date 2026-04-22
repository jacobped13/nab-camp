import { ROLE } from '@service/authorization';
import {
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  SubscriptionPlan,
} from '@service/billing';
import { Nullable } from '@common';

/**
 * Represents a membership in a workspace, including the member and their role.
 */
export class WorkspaceMembership {
  constructor(
    public readonly id: string,
    public readonly workspaceId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly firstName: Nullable<string>,
    public readonly lastName: Nullable<string>,
    public readonly role: ROLE,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

/**
 * Represents the access subscription for a workspace.
 * This subscription grants the workspace access to use the core features of the system.
 */
export class WorkspaceAccessSubscription {
  constructor(
    // -----------------------------------------------------------------
    // Subscription Connection
    // -----------------------------------------------------------------
    public readonly id: string,
    public readonly status: BILLING_PROVIDER_SUBSCRIPTION_STATUS,
    public readonly cancelAt: Nullable<Date>,
    // -----------------------------------------------------------------
    // Subscription Item Connection
    // -----------------------------------------------------------------
    public readonly itemId: string,
    public readonly quantity: number,
    public readonly currentPeriodStartAt: Date,
    public readonly currentPeriodEndAt: Date,
    // -----------------------------------------------------------------
    // Subscription Plan
    // -----------------------------------------------------------------
    public readonly plan: SubscriptionPlan
  ) {}

  public isActive(): boolean {
    return this.status === BILLING_PROVIDER_SUBSCRIPTION_STATUS.ACTIVE;
  }

  public isTrialing(): boolean {
    return this.status === BILLING_PROVIDER_SUBSCRIPTION_STATUS.TRIALING;
  }

  public isInactive(): boolean {
    return this.status === BILLING_PROVIDER_SUBSCRIPTION_STATUS.INACTIVE;
  }

  public isCancelled(): boolean {
    return this.status === BILLING_PROVIDER_SUBSCRIPTION_STATUS.CANCELLED;
  }

  public isServiceActive(): boolean {
    return this.isActive() || this.isTrialing();
  }
}

/**
 * Represents the owner of a workspace.
 */
export class WorkspaceOwner {
  constructor(
    public readonly id: string,
    public readonly workspaceId: string
  ) {}
}
