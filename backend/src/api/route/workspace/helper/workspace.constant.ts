import { PAGINATION_DIRECTION, SORT_DIRECTION } from '@api-contracts/common';
import {
  WORKSPACE_EMAIL_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_SORT_FIELD,
} from '@api-contracts/workspace';
import { BILLING_PROVIDER_INVOICE_STATUS } from '@service/billing/common/billing.constant';

// -----------------------------------------------------------------
// Workspace Email Invite
// -----------------------------------------------------------------

/**
 * Represents the default limit for workspace email invite queries.
 */
export const DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_LIMIT = 100;

/**
 * Represents the default pagination direction for workspace email invite queries.
 */
export const DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_PAGINATION_DIRECTION: PAGINATION_DIRECTION =
  PAGINATION_DIRECTION.FORWARD;

/**
 * Represents the default sort direction for workspace email invite queries.
 */
export const DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_SORT_FIELD: WORKSPACE_EMAIL_INVITE_SORT_FIELD =
  WORKSPACE_EMAIL_INVITE_SORT_FIELD.CREATED_AT;

/**
 * Represents the default sort direction for workspace email invite queries.
 */
export const DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_SORT_DIRECTION: SORT_DIRECTION =
  SORT_DIRECTION.DESC;

// -----------------------------------------------------------------
// Workspace Member
// -----------------------------------------------------------------

/**
 * Represents the default limit for workspace member queries.
 */
export const DEFAULT_WORKSPACE_MEMBER_QUERY_LIMIT = 100;

/**
 * Represents the default pagination direction for workspace member queries.
 */
export const DEFAULT_WORKSPACE_MEMBER_QUERY_PAGINATION_DIRECTION: PAGINATION_DIRECTION =
  PAGINATION_DIRECTION.FORWARD;

/**
 * Represents the default sort direction for workspace member queries.
 */
export const DEFAULT_WORKSPACE_MEMBER_QUERY_SORT_FIELD: WORKSPACE_MEMBER_SORT_FIELD =
  WORKSPACE_MEMBER_SORT_FIELD.CREATED_AT;

/**
 * Represents the default sort direction for workspace member queries.
 */
export const DEFAULT_WORKSPACE_MEMBER_QUERY_SORT_DIRECTION: SORT_DIRECTION =
  SORT_DIRECTION.DESC;

// -----------------------------------------------------------------
// Workspace Invoice
// -----------------------------------------------------------------

/**
 * Represents the default limit for workspace invoice queries.
 */
export const DEFAULT_WORKSPACE_INVOICE_QUERY_LIMIT = 100;

/**
 * Represents the default pagination direction for workspace invoice queries.
 */
export const DEFAULT_WORKSPACE_INVOICE_QUERY_PAGINATION_DIRECTION: PAGINATION_DIRECTION =
  PAGINATION_DIRECTION.FORWARD;

/**
 * Represents the default filter statuses for workspace invoice queries.
 */
export const DEFAULT_WORKSPACE_INVOICE_FILTER_STATUSES = [
  BILLING_PROVIDER_INVOICE_STATUS.PAID,
  BILLING_PROVIDER_INVOICE_STATUS.OPEN,
];
