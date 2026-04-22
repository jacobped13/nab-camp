import { Storage } from '@google-cloud/storage';
import { env } from '@env';
import { injectExceptionDetails, logger, Nullable } from '@common';
import { Bucket } from '../common/gcs.type';
import {
  ConfigureBucketCorsInputDto,
  CorsOptionDto,
  CreateBucketInputDto,
  FindBucketByNameInputDto,
  FindOrCreateBucketInputDto,
  GenerateSignedFileReadUrlInputDto,
  GenerateSignedFileWriteUrlInputDto,
  SignedFileUrlDto,
  UploadFileToBucketInputDto,
  ValidateFileExistsInputDto,
} from './helper/gcs.dto';
import {
  DEFAULT_SIGNED_URL_EXPIRATION_MS,
  DEFAULT_SIGNED_URL_VERSION,
} from './helper/gcs.constant';
import { GCS_SIGNED_URL_ACTION } from '../common/gcs.constant';
import {
  generateBucketFilePath,
  generateFileNameWithExtension,
} from '../common';

const LOG_PREFIX = 'Lib :: Provider :: Storage :: GCS';

const initializeClient = (serviceAccount: Record<string, string>): Storage => {
  const client = new Storage({
    projectId: serviceAccount.project_id,
    credentials: {
      ...serviceAccount,
    },
  });
  return client;
};

const client = initializeClient(env.GCS_SERVICE_ACCOUNT);

/**
 * Find a GCS bucket instance by name.
 *
 * @return The found bucket instance or null if not found.
 */
export const findBucketInstanceByName = (
  input: FindBucketByNameInputDto
): Nullable<Bucket> => {
  try {
    const { bucketName } = input;

    const bucket = client.bucket(bucketName);

    return bucket;
  } catch (_error: unknown) {
    return null;
  }
};

/**
 * Find a GCS bucket by name.
 *
 * @return The found bucket or null if not found.
 */
export const findBucketByName = async (
  input: FindBucketByNameInputDto
): Promise<Nullable<Bucket>> => {
  try {
    const { bucketName } = input;

    const [bucket] = await client.bucket(bucketName).get();

    return bucket;
  } catch (_error: unknown) {
    return null;
  }
};

/**
 * Create a GCS bucket.
 *
 * @return The created bucket.
 */
export const createBucket = async (
  input: CreateBucketInputDto
): Promise<Bucket> => {
  try {
    const { bucketName } = input;

    const [bucket] = await client.createBucket(bucketName);

    return bucket;
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: createBucket :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to create GCS bucket');
  }
};

/**
 * Find or create a GCS bucket by name.
 *
 * @return The found or created bucket.
 */
export const findOrCreateBucket = async (
  input: FindOrCreateBucketInputDto
): Promise<Bucket> => {
  try {
    const { bucketName } = input;

    const existingBucket = await findBucketByName({
      bucketName: bucketName,
    });

    if (existingBucket) {
      return existingBucket;
    }

    return await createBucket({
      bucketName: bucketName,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: findOrCreateBucket :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to find or create GCS bucket');
  }
};

/**
 * Get the CORS configuration for a GCS bucket.
 *
 * @returns The CORS configuration for the bucket.
 */
export const getCorsConfigurations = async (
  input: FindBucketByNameInputDto
): Promise<CorsOptionDto[]> => {
  try {
    const { bucketName } = input;

    const bucket = findBucketInstanceByName({
      bucketName: bucketName,
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    const [metadata] = await bucket.getMetadata();
    const cors = metadata.cors ?? [];

    return cors.map((option) => ({
      origin: option.origin,
      method: option.method,
      maxAgeSeconds: option.maxAgeSeconds,
      responseHeader: option.responseHeader,
    }));
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: getCorsConfigurations :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to get GCS bucket CORS configurations');
  }
};

/**
 * Configures CORS for a GCS bucket.
 */
export const configureBucketCors = async (
  input: ConfigureBucketCorsInputDto
): Promise<void> => {
  try {
    const { bucketName, options } = input;

    const bucket = findBucketInstanceByName({
      bucketName: bucketName,
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    await bucket.setCorsConfiguration(
      options.map((option) => ({
        origin: option.origin,
        method: option.method,
        maxAgeSeconds: option.maxAgeSeconds,
        responseHeader: option.responseHeader,
      }))
    );
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: configureBucketCors :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to configure GCS bucket CORS');
  }
};

/**
 * Validate if a file exists in a GCS bucket.
 *
 * @returns True if the file exists, false otherwise.
 */
export const validateFileExists = async (
  input: ValidateFileExistsInputDto
): Promise<boolean> => {
  try {
    const { bucketName, basePath, fileName, fileExtension } = input;

    const bucket = findBucketInstanceByName({
      bucketName: bucketName,
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    const fileNameWithExtension = generateFileNameWithExtension(
      fileName,
      fileExtension
    );
    const filePath = generateBucketFilePath(basePath, fileNameWithExtension);
    const file = bucket.file(filePath);
    const [exists] = await file.exists();

    return exists;
  } catch (_error: unknown) {
    return false;
  }
};

/**
 * Upload a file to a GCS bucket.
 */
export const uploadFileToBucket = async (
  input: UploadFileToBucketInputDto
): Promise<void> => {
  try {
    const { bucketName, file, basePath, fileName, fileExtension } = input;

    const bucket = findBucketInstanceByName({
      bucketName: bucketName,
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    const fileNameWithExtension = generateFileNameWithExtension(
      fileName,
      fileExtension
    );
    const filePath = generateBucketFilePath(basePath, fileNameWithExtension);
    const fileObject = bucket.file(filePath);

    await fileObject.save(file, {
      resumable: false,
    });
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: uploadFileToBucket :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to upload file to GCS bucket');
  }
};

/**
 * Generate a signed URL for writing a file in a GCS bucket.
 *
 * @returns The signed URL for the file.
 */
export const generateSignedFileWriteUrl = async (
  input: GenerateSignedFileWriteUrlInputDto
): Promise<SignedFileUrlDto> => {
  try {
    const {
      bucketName,
      basePath,
      fileName,
      fileExtension,
      expirationInMilliseconds,
    } = input;

    const bucket = findBucketInstanceByName({
      bucketName: bucketName,
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    const fileNameWithExtension = generateFileNameWithExtension(
      fileName,
      fileExtension
    );
    const filePath = generateBucketFilePath(basePath, fileNameWithExtension);
    const file = bucket.file(filePath);

    const expirationTime =
      expirationInMilliseconds ?? DEFAULT_SIGNED_URL_EXPIRATION_MS;
    const expirationDate = new Date(new Date().getTime() + expirationTime);

    const [url] = await file.getSignedUrl({
      version: DEFAULT_SIGNED_URL_VERSION,
      action: GCS_SIGNED_URL_ACTION.WRITE,
      expires: expirationDate,
    });

    return {
      signedUrl: url,
      fileName: fileName,
      fileExtension: fileExtension,
      fileNameWithExtension: fileNameWithExtension,
      expireAt: expirationDate,
    };
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: generateSignedFileWriteUrl :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to generate signed file write URL');
  }
};

/**
 * Generate a signed URL for reading a file in a GCS bucket.
 *
 * @returns The signed URL for the file.
 */
export const generateSignedFileReadUrl = async (
  input: GenerateSignedFileReadUrlInputDto
): Promise<SignedFileUrlDto> => {
  try {
    const {
      bucketName,
      basePath,
      fileName,
      fileExtension,
      expirationInMilliseconds,
    } = input;

    const bucket = findBucketInstanceByName({
      bucketName: bucketName,
    });

    if (!bucket) {
      throw new Error('Bucket not found');
    }

    const fileNameWithExtension = generateFileNameWithExtension(
      fileName,
      fileExtension
    );
    const filePath = generateBucketFilePath(basePath, fileNameWithExtension);
    const file = bucket.file(filePath);

    if (!file) {
      throw new Error('File not found in bucket');
    }

    const expirationTime =
      expirationInMilliseconds ?? DEFAULT_SIGNED_URL_EXPIRATION_MS;
    const expirationDate = new Date(new Date().getTime() + expirationTime);

    const [url] = await file.getSignedUrl({
      version: DEFAULT_SIGNED_URL_VERSION,
      action: GCS_SIGNED_URL_ACTION.READ,
      expires: expirationDate,
    });

    return {
      signedUrl: url,
      fileName: fileName,
      fileExtension: fileExtension,
      fileNameWithExtension: fileNameWithExtension,
      expireAt: expirationDate,
    };
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: generateSignedFileReadUrl :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to generate signed file read URL');
  }
};
