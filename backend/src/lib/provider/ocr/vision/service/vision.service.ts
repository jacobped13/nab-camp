import { env } from '@env';
import { injectExceptionDetails, logger } from '@common';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import {
  AnnotationDto,
  DetectRemoteImageTextInputDto,
} from './helper/vision.dto';

const LOG_PREFIX = 'Lib :: Provider :: OCR :: Vision';

const initializeClient = (
  serviceAccount: Record<string, string>
): ImageAnnotatorClient => {
  const client = new ImageAnnotatorClient({
    projectId: serviceAccount.project_id,
    credentials: {
      ...serviceAccount,
    },
  });
  return client;
};

const client = initializeClient(env.GOOGLE_VISION_SERVICE_ACCOUNT);

/**
 * Detects text in a remote image.
 *
 * @returns An array of entity annotations found in the remote image.
 */
export const detectRemoteImageText = async (
  input: DetectRemoteImageTextInputDto
): Promise<AnnotationDto> => {
  try {
    const { imageUri } = input;

    const [result] = await client.documentTextDetection({
      image: {
        source: {
          imageUri: imageUri,
        },
      },
    });

    const textAnnotations = result.textAnnotations ?? [];
    const fullTextAnnotation = result.fullTextAnnotation!;

    return {
      textAnnotations: textAnnotations,
      fullTextAnnotation: fullTextAnnotation,
    };
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: detectRemoteImageText :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to detect remote image text');
  }
};
