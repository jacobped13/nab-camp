import {
  BILLING_PROVIDER,
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
} from '@service/billing';
import { APP_PATH } from '@lib/util/url.util';
import { TIMING } from '@shared-lib/timing';

/**
 * Represents the default billing provider for workspaces.
 */
export const DEFAULT_WORKSPACE_BILLING_PROVIDER: BILLING_PROVIDER =
  BILLING_PROVIDER.STRIPE;

/**
 * Represents the default path to redirect after a checkout session is processed.
 */
export const DEFAULT_WORKSPACE_CHECKOUT_SESSION_RESULT_PATH =
  APP_PATH.REGISTRATION;

/**
 * Represents the default path to redirect after a payment method management session is processed.
 */
export const DEFAULT_WORKSPACE_PAYMENT_METHOD_MANAGEMENT_SESSION_RETURN_PATH =
  APP_PATH.BILLING;

/**
 * Represents the default plan group key used for finding available access subscription plans.
 */
export const DEFAULT_ACCESS_SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY: SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY =
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY.PUBLIC_JULY_2025;

/**
 * Represents the expiration time in milliseconds for workspace email invites.
 */
export const WORKSPACE_EMAIL_INVITE_CODE_EXPIRATION_TIME_MILLISECONDS =
  TIMING.WEEK.IN_MILLISECONDS;
