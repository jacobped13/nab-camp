import { GCS_BUCKET_NAME } from '@lib/provider/storage/gcs';
import { MimeType, MIME_TYPES, getFileExtension } from '@shared-lib/file-types';
import { TIMING } from '@shared-lib/timing';

/**
 * Represents the GCS bucket name for document files.
 */
export const DOCUMENT_FILE_GCS_BUCKET_NAME: GCS_BUCKET_NAME =
  GCS_BUCKET_NAME.DOCUMENT;

/**
 * Represents the supported MIME types for document files.
 */
export const SUPPORTED_DOCUMENT_FILE_MIME_TYPES = [
  ...MIME_TYPES,
] as const satisfies [MimeType, ...MimeType[]];

/**
 * Represents the set of supported MIME types for document files.
 */
export const SUPPORTED_DOCUMENT_FILE_MIME_TYPE_SET = new Set<MimeType>(
  SUPPORTED_DOCUMENT_FILE_MIME_TYPES
);

/**
 * Represents the set of supported MIME types for document file keys.
 */
export const SUPPORTED_DOCUMENT_FILE_EXTENSIONS =
  SUPPORTED_DOCUMENT_FILE_MIME_TYPES.map((mimeType) =>
    getFileExtension(mimeType)
  ).filter(Boolean);

/**
 * Represents the set of supported document file extensions.
 */
export const SUPPORTED_DOCUMENT_FILE_EXTENSION_SET = new Set<string>(
  SUPPORTED_DOCUMENT_FILE_EXTENSIONS
);

/**
 * Represents the expiration time for signed URLs used to upload document files.
 * This is set to 1 minute since it has elevated permissions.
 */
export const DOCUMENT_FILE_SIGNED_URL_WRITE_EXPIRATION_MS =
  TIMING.MINUTE.IN_MILLISECONDS;

/**
 * Represents the expiration time for signed URLs used to read document files.
 * This is set to 1 day since it has read-only permissions.
 */
export const DOCUMENT_FILE_SIGNED_URL_READ_EXPIRATION_MS =
  TIMING.DAY.IN_MILLISECONDS;
