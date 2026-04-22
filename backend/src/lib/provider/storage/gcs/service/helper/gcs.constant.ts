import { TIMING } from '@shared-lib/timing';

/**
 * Represents the default expiration time for signed URLs in GCS.
 */
export const DEFAULT_SIGNED_URL_EXPIRATION_MS = TIMING.HOUR.IN_MILLISECONDS;

/**
 * Represents the default version for signed URLs in GCS.
 */
export const DEFAULT_SIGNED_URL_VERSION = 'v4';
