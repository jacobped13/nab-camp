import { InvoiceStatus } from './stripe.type';

/**
 * Represents the header name for Stripe signature verification.
 */
export const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

/**
 * Represents the maximum number of items that can be retrieved in a single query to Stripe.
 */
export const MAX_STRIPE_QUERY_LIMIT = 100;

/**
 * Represents all possible invoice statuses.
 */
export const INVOICE_STATUSES: InvoiceStatus[] = [
  'draft',
  'open',
  'paid',
  'uncollectible',
  'void',
];
