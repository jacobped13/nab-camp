import {
  BusinessErrorResult,
  BusinessResult,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  RESULT_ERROR_CODE,
} from '@common';
import {
  CreateDocumentFileDownloadUrlErrorDto,
  CreateDocumentFileDownloadUrlInputDto,
  CreateDocumentFileDownloadUrlInputDtoSchema,
  CreateDocumentFileDownloadUrlOutputDto,
  CreateDocumentFileUploadUrlErrorDto,
  CreateDocumentFileUploadUrlInputDto,
  CreateDocumentFileUploadUrlInputDtoSchema,
  CreateDocumentFileUploadUrlOutputDto,
  ProcessDocumentFileErrorDto,
  ProcessDocumentFileInputDto,
  ProcessDocumentFileInputDtoSchema,
  ProcessDocumentFileOutputDto,
} from './helper/document.business.dto';
import { getFileExtension } from '@shared-lib/file-types';
import { gcsService } from '@lib/provider/storage/gcs';
import { generateDocumentFileId } from './helper/document.business.util';
import {
  DOCUMENT_FILE_GCS_BUCKET_NAME,
  DOCUMENT_FILE_SIGNED_URL_READ_EXPIRATION_MS,
  DOCUMENT_FILE_SIGNED_URL_WRITE_EXPIRATION_MS,
} from './helper/document.business.constant';
import * as documentProcessorService from '../processor/document.processor.service';

const LOG_PREFIX = 'Service :: Document :: DocumentBusinessService';

/**
 * @package
 *
 * Creates a signed URL for uploading a document files.
 *
 * @returns A signed URL for uploading the document file.
 */
export const _createDocumentFileUploadUrl = async (
  executionContext: ExecutionContext,
  input: CreateDocumentFileUploadUrlInputDto
): Promise<
  BusinessResult<
    CreateDocumentFileUploadUrlOutputDto,
    CreateDocumentFileUploadUrlErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateDocumentFileUploadUrlInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const requestId = parsedInputData.requestId;
    const fileMimeType = parsedInputData.fileMimeType;
    const fileExtension = getFileExtension(fileMimeType);
    const fileId = generateDocumentFileId();

    // Step 2: Create upload URL
    const { signedUrl } = await gcsService.generateSignedFileWriteUrl({
      bucketName: DOCUMENT_FILE_GCS_BUCKET_NAME,
      basePath: workspaceId,
      fileName: fileId,
      fileExtension: fileExtension,
      expirationInMilliseconds: DOCUMENT_FILE_SIGNED_URL_WRITE_EXPIRATION_MS,
    });

    return BusinessResult.ok({
      fileId: fileId,
      fileExtension: fileExtension,
      uploadUrl: signedUrl,
      requestId: requestId,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createDocumentUploadUrl :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Creates multiple document file upload URLs.
 *
 * @returns A list of signed URLs for uploading document files.
 */
export const _createDocumentFileUploadUrls = async (
  executionContext: ExecutionContext,
  inputs: CreateDocumentFileUploadUrlInputDto[]
): Promise<
  BusinessResult<
    CreateDocumentFileUploadUrlOutputDto[],
    CreateDocumentFileUploadUrlErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const successResults: CreateDocumentFileUploadUrlOutputDto[] = [];
    const failureResults: CreateDocumentFileUploadUrlErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        try {
          const result = await _createDocumentFileUploadUrl(
            executionContext,
            input
          );

          if (result.isSuccess()) {
            successResults.push(result.data);
          }

          if (result.hasErrors()) {
            failureResults.push(...result.errors);
          }
        } catch (error: unknown) {
          logger.error(
            `${LOG_PREFIX} :: _createDocumentFileUploadUrls :: Failed to create upload URL`,
            injectExceptionDetails(error, {
              input: input,
              context: loggingContext,
            })
          );
          failureResults.push(
            BusinessErrorResult.with({
              code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
              detail: 'Failed to create upload URL',
              metadata: {
                input: input,
                context: executionContext,
              },
            })
          );
        }
      })
    );

    return BusinessResult.fromMultiResult(successResults, failureResults);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createDocumentFileUploadUrls :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Creates a signed URL for downloading a document file.
 *
 * @returns A signed URL for downloading the document file.
 */
export const _createDocumentFileDownloadUrl = async (
  executionContext: ExecutionContext,
  input: CreateDocumentFileDownloadUrlInputDto
): Promise<
  BusinessResult<
    CreateDocumentFileDownloadUrlOutputDto,
    CreateDocumentFileDownloadUrlErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateDocumentFileDownloadUrlInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const fileId = parsedInputData.fileId;
    const fileExtension = parsedInputData.fileExtension;

    // Step 2: Validate that the file exists in GCS
    const fileExists = await gcsService.validateFileExists({
      bucketName: DOCUMENT_FILE_GCS_BUCKET_NAME,
      basePath: workspaceId,
      fileName: fileId,
      fileExtension: fileExtension,
    });

    if (!fileExists) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Document file not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Generate download URL
    const { signedUrl } = await gcsService.generateSignedFileReadUrl({
      bucketName: DOCUMENT_FILE_GCS_BUCKET_NAME,
      basePath: workspaceId,
      fileName: fileId,
      fileExtension: fileExtension,
      expirationInMilliseconds: DOCUMENT_FILE_SIGNED_URL_READ_EXPIRATION_MS,
    });

    return BusinessResult.ok({
      fileId: fileId,
      fileExtension: fileExtension,
      downloadUrl: signedUrl,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createDocumentFileUploadUrl :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Creates signed URLs for downloading document files.
 *
 * @returns A list of signed URLs for downloading document files.
 */
export const _createDocumentFileDownloadUrls = async (
  executionContext: ExecutionContext,
  inputs: CreateDocumentFileDownloadUrlInputDto[]
): Promise<
  BusinessResult<
    CreateDocumentFileDownloadUrlOutputDto[],
    CreateDocumentFileDownloadUrlErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const successResults: CreateDocumentFileDownloadUrlOutputDto[] = [];
    const failureResults: CreateDocumentFileDownloadUrlErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        try {
          const result = await _createDocumentFileDownloadUrl(
            executionContext,
            input
          );

          if (result.isSuccess()) {
            successResults.push(result.data);
          }

          if (result.hasErrors()) {
            failureResults.push(...result.errors);
          }
        } catch (error: unknown) {
          logger.error(
            `${LOG_PREFIX} :: _createDocumentFileDownloadUrls :: Failed to create download URL`,
            injectExceptionDetails(error, {
              input: input,
              context: loggingContext,
            })
          );
          failureResults.push(
            BusinessErrorResult.with({
              code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
              detail: 'Failed to create download URL',
              metadata: {
                input: input,
                context: executionContext,
              },
            })
          );
        }
      })
    );

    return BusinessResult.fromMultiResult(successResults, failureResults);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createDocumentFileDownloadUrls :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Processes an uploaded document file.
 *
 * @returns The processed document file.
 */
export const _processDocumentFile = async (
  executionContext: ExecutionContext,
  input: ProcessDocumentFileInputDto
): Promise<
  BusinessResult<ProcessDocumentFileOutputDto, ProcessDocumentFileErrorDto>
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = ProcessDocumentFileInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const fileId = parsedInputData.fileId;
    const fileExtension = parsedInputData.fileExtension;

    // Step 2: Find the document file in GCS
    const downloadResult = await _createDocumentFileDownloadUrl(
      executionContext,
      {
        fileId: fileId,
        fileExtension: fileExtension,
        workspaceId: workspaceId,
      }
    );

    if (!downloadResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _processDocumentFile :: Failed to find document file`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find document file',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const fileUrl = downloadResult.data.downloadUrl;

    // Step 3: Using the extracted text, determine the type of document
    const annotationResult =
      await documentProcessorService._annotateRemoteDocumentFile(
        executionContext,
        {
          fileUrl: fileUrl,
        }
      );

    if (!annotationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _processDocumentFile :: Failed to annotate document file`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to annotate document file',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const annotationResultData = annotationResult.data;
    const annotations = annotationResultData.annotations;
    const annotationText = annotations.text ?? '';

    // Step 4: Classify the document type using the extracted text
    const classificationResult =
      await documentProcessorService._classifyDocumentFileAnnotations(
        executionContext,
        {
          text: annotationText,
        }
      );

    if (!classificationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _processDocumentFile :: Failed to classify document file`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to classify document file',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const classificationResultData = classificationResult.data;
    const category = classificationResultData.category;

    const processingResult =
      await documentProcessorService._processDocumentFile(executionContext, {
        category: category,
        annotations: annotations,
        fileUrl: fileUrl,
      });

    if (!processingResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _processDocumentFile :: Failed to process document file`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to process document file',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      success: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _processDocumentFile :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Creates multiple document file upload URLs.
 *
 * @returns A list of signed URLs for uploading document files.
 */
export const createDocumentFileUploadUrls = async (
  executionContext: ExecutionContext,
  inputs: CreateDocumentFileUploadUrlInputDto[]
): Promise<
  BusinessResult<
    CreateDocumentFileUploadUrlOutputDto[],
    CreateDocumentFileUploadUrlErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // TODO: Add authorization check for document file upload permission
    return await _createDocumentFileUploadUrls(executionContext, inputs);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createDocumentFileUploadUrls :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * Creates multiple document file download URLs.
 *
 * @returns A list of signed URLs for downloading document files.
 */
export const createDocumentFileDownloadUrls = async (
  executionContext: ExecutionContext,
  inputs: CreateDocumentFileDownloadUrlInputDto[]
): Promise<
  BusinessResult<
    CreateDocumentFileDownloadUrlOutputDto[],
    CreateDocumentFileDownloadUrlErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // TODO: Add authorization check for document file download permission
    return await _createDocumentFileDownloadUrls(executionContext, inputs);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createDocumentFileDownloadUrls :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};
