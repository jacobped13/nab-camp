/**
 * Represents the available buckets in the GCS system.
 */
export enum GCS_BUCKET_NAME {
  DOCUMENT = 'ab-ads-app-document',
}

/**
 * Represents all of the available GCS bucket names.
 */
export const GCS_BUCKET_NAMES = Object.values(GCS_BUCKET_NAME);

/**
 * Represents the available actions for signed URLs in GCS.
 */
export enum GCS_SIGNED_URL_ACTION {
  READ = 'read',
  WRITE = 'write',
}
