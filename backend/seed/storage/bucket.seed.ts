import { isProductionEnvironment } from '@env';
import {
  CorsOptionDto,
  GCS_BUCKET_NAMES,
  gcsService,
} from '@lib/provider/storage/gcs';
import { TIMING } from '@shared-lib/timing';

const LOG_PREFIX = 'Seed :: Storage :: Bucket';

const CORS_CONFIGURATION_STAGING: CorsOptionDto[] = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAgeSeconds: TIMING.HOUR.IN_SECONDS,
    responseHeader: ['Content-Type'],
  },
];

const CORS_CONFIGURATION_PRODUCTION: CorsOptionDto[] = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAgeSeconds: TIMING.HOUR.IN_SECONDS,
    responseHeader: ['Content-Type'],
  },
];

const getEnvironmentCorsConfiguration = (): CorsOptionDto[] => {
  if (isProductionEnvironment()) {
    return CORS_CONFIGURATION_PRODUCTION;
  }
  return CORS_CONFIGURATION_STAGING;
};

export const plantStorageBucketSeeds = async () => {
  try {
    await Promise.all(
      GCS_BUCKET_NAMES.map(async (bucketName) => {
        // Step 1: Find or create the bucket
        await gcsService.findOrCreateBucket({
          bucketName: bucketName,
        });

        // Step 2: Check if the bucket already has CORS configured
        const corsConfigurations = await gcsService.getCorsConfigurations({
          bucketName: bucketName,
        });

        // Step 3: Configure CORS for the bucket
        if (!corsConfigurations.length) {
          await gcsService.configureBucketCors({
            bucketName: bucketName,
            options: getEnvironmentCorsConfiguration(),
          });
        }
      })
    );
  } catch (error: unknown) {
    console.error(
      `${LOG_PREFIX} :: plantStorageBucketSeeds :: An unknown error occurred`,
      error
    );
  }
};
