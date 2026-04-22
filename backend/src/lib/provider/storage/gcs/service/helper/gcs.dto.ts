import { GCS_BUCKET_NAME } from '../../common/gcs.constant';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

export type SignedFileUrlDto = {
  signedUrl: string;
  fileName: string;
  fileExtension: string;
  fileNameWithExtension: string;
  expireAt: Date;
};

export type CorsOptionDto = {
  origin?: string[];
  method?: string[];
  maxAgeSeconds?: number;
  responseHeader?: string[];
};

// -----------------------------------------------------------------
// Find Bucket by Name
// -----------------------------------------------------------------

export type FindBucketByNameInputDto = {
  bucketName: GCS_BUCKET_NAME;
};

// -----------------------------------------------------------------
// Create Bucket
// -----------------------------------------------------------------

export type CreateBucketInputDto = {
  bucketName: GCS_BUCKET_NAME;
};

// -----------------------------------------------------------------
// Find or Create Bucket
// -----------------------------------------------------------------

export type FindOrCreateBucketInputDto = {
  bucketName: GCS_BUCKET_NAME;
};

// -----------------------------------------------------------------
// Configure Bucket CORS
// -----------------------------------------------------------------

export type ConfigureBucketCorsInputDto = {
  bucketName: GCS_BUCKET_NAME;
  options: CorsOptionDto[];
};

// -----------------------------------------------------------------
// Validate File Exists
// -----------------------------------------------------------------

export type ValidateFileExistsInputDto = {
  bucketName: GCS_BUCKET_NAME;
  basePath: string;
  fileName: string;
  fileExtension: string;
};

// -----------------------------------------------------------------
// Upload File to Bucket
// -----------------------------------------------------------------

export type UploadFileToBucketInputDto = {
  bucketName: GCS_BUCKET_NAME;
  file: string | Buffer;
  basePath: string;
  fileName: string;
  fileExtension: string;
};

// -----------------------------------------------------------------
// Generate Signed File Write URL
// -----------------------------------------------------------------

export type GenerateSignedFileWriteUrlInputDto = {
  bucketName: GCS_BUCKET_NAME;
  basePath: string;
  fileName: string;
  fileExtension: string;
  expirationInMilliseconds?: number;
};

// -----------------------------------------------------------------
// Generate Signed File Read URL
// -----------------------------------------------------------------

export type GenerateSignedFileReadUrlInputDto = {
  bucketName: GCS_BUCKET_NAME;
  basePath: string;
  fileName: string;
  fileExtension: string;
  expirationInMilliseconds?: number;
};
