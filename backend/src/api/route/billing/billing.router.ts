import { createRouter } from '@common';
import * as billingHandler from './billing.handler';

export enum BILLING_ROUTE {
  ROOT = '/',
  CHECKOUT_SESSION = '/checkout-session',
  CHECKOUT_SESSION_ID = '/checkout-session/:id',
  PROVIDER_STRIPE_WEBHOOK = '/provider/stripe/webhook',
  PLAN = '/plan',
  PLAN_ID_PATH = '/plan/:id/path',
}

export const billingRouter = createRouter()
  // -----------------------------------------------------------------
  // Create Checkout Session Operation
  // -----------------------------------------------------------------
  .post(BILLING_ROUTE.CHECKOUT_SESSION, ...billingHandler.createCheckoutSession)
  // -----------------------------------------------------------------
  // Find Checkout Session by ID Operation
  // -----------------------------------------------------------------
  .get(
    BILLING_ROUTE.CHECKOUT_SESSION_ID,
    ...billingHandler.findCheckoutSessionById
  )
  // -----------------------------------------------------------------
  // Stripe Webhook Event Processor
  // -----------------------------------------------------------------
  .post(
    BILLING_ROUTE.PROVIDER_STRIPE_WEBHOOK,
    ...billingHandler.processStripeEvent
  )
  // -----------------------------------------------------------------
  // Find All Subscription Plans Operation
  // -----------------------------------------------------------------
  .get(BILLING_ROUTE.PLAN, ...billingHandler.findAllSubscriptionPlans)
  // -----------------------------------------------------------------
  // Find Subscription Plan Paths by ID Operation
  // -----------------------------------------------------------------
  .get(
    BILLING_ROUTE.PLAN_ID_PATH,
    ...billingHandler.findSubscriptionPlanPathsById
  );
