import { env } from '@env';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import {
  InitializeClientOutputDto,
  ProcessRemoteGCSDocumentInputDto,
} from './helper/document-ai.dto';
import { injectExceptionDetails, logger, Nullable } from '@common';
import { generateProcessorPath } from './helper/document-ai.util';
import { DEFAULT_DOCUMENT_AI_LOCATION } from './helper/document-ai.constant';
import { Document } from '../common';

const LOG_PREFIX = 'Lib :: Provider :: OCR :: DocumentAI';

const initializeClient = (
  serviceAccount: Record<string, string>
): InitializeClientOutputDto => {
  const projectId = serviceAccount.project_id;

  const client = new DocumentProcessorServiceClient({
    projectId: serviceAccount.project_id,
    credentials: {
      ...serviceAccount,
    },
  });
  return {
    client: client,
    projectId: projectId,
  };
};

const { client, projectId } = initializeClient(
  env.GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT
);

/**
 * Processes a document stored in Google Cloud Storage.
 */
export const processRemoteGCSDocument = async (
  input: ProcessRemoteGCSDocumentInputDto
): Promise<Nullable<Document>> => {
  try {
    const { bucketName, filePath, fileMimeType, processor } = input;

    const processorPath = generateProcessorPath(
      projectId,
      DEFAULT_DOCUMENT_AI_LOCATION,
      processor
    );

    const [result] = await client.processDocument({
      name: processorPath,
      gcsDocument: {
        gcsUri: `gs://${bucketName}/${filePath}`,
        mimeType: fileMimeType,
      },
      imagelessMode: true,
    });

    return result.document ?? null;
  } catch (error) {
    logger.error(
      `${LOG_PREFIX} :: processRemoteGCSDocument :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to process remote GCS document');
  }
};
