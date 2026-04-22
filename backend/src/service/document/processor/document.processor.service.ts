import {
  BusinessErrorResult,
  BusinessResult,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  RESULT_ERROR_CODE,
} from '@common';
import {
  AnnotateRemoteDocumentFileErrorDto,
  AnnotateRemoteDocumentFileInputDto,
  AnnotateRemoteDocumentFileInputDtoSchema,
  AnnotateRemoteDocumentFileOutputDto,
  ClassifyDocumentFileAnnotationsErrorDto,
  ClassifyDocumentFileAnnotationsInputDto,
  ClassifyDocumentFileAnnotationsInputDtoSchema,
  ClassifyDocumentFileAnnotationsOutputDto,
  DocumentClassificationDto,
  DocumentClassificationDtoSchema,
  DocumentProcessorDto,
  DocumentProcessorDtoArraySchema,
  ProcessDocumentFileErrorDto,
  ProcessDocumentFileInputDto,
  ProcessDocumentFileInputDtoSchema,
  ProcessDocumentFileOutputDto,
} from './helper/document.processor.dto';
import {
  DOCUMENT_CLASSIFICATION_PROMPT_V1,
  DOCUMENT_PROCESSOR_PROMPT_W2_V1,
} from './helper/document.processor.prompt';
import { DOCUMENT_FILE_PROCESSOR } from './helper/document.processor.constant';
import { visionService } from '@lib/provider/ocr/vision';
import { openaiService } from '@lib/provider/ai/openai';
import { getDocumentFileTypeProcessor } from './helper/document.processor.util';

const LOG_PREFIX = 'Service :: Document :: DocumentProcessorService';

/**
 * @package
 */
export const _annotateRemoteDocumentFile = async (
  executionContext: ExecutionContext,
  input: AnnotateRemoteDocumentFileInputDto
): Promise<
  BusinessResult<
    AnnotateRemoteDocumentFileOutputDto,
    AnnotateRemoteDocumentFileErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AnnotateRemoteDocumentFileInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const fileUrl = parsedInputData.fileUrl;

    // Step 2: Process the document file using OCR
    const { fullTextAnnotation } = await visionService.detectRemoteImageText({
      imageUri: fileUrl,
    });

    return BusinessResult.ok({
      annotations: fullTextAnnotation,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _annotateRemoteDocumentFile :: An unknown error occurred`,
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
 */
export const _classifyDocumentFileAnnotations = async (
  executionContext: ExecutionContext,
  input: ClassifyDocumentFileAnnotationsInputDto
): Promise<
  BusinessResult<
    ClassifyDocumentFileAnnotationsOutputDto,
    ClassifyDocumentFileAnnotationsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      ClassifyDocumentFileAnnotationsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const text = parsedInputData.text;

    // Step 2: Classify the document file annotations
    const classificationResult =
      await openaiService.createCompletionWithSchema<DocumentClassificationDto>(
        {
          model: 'gpt-4.1-nano',
          messages: [
            {
              role: 'system',
              content: DOCUMENT_CLASSIFICATION_PROMPT_V1,
            },
            {
              role: 'user',
              content: text,
            },
          ],
          schema: DocumentClassificationDtoSchema,
          schemaName: 'DocumentClassification',
        }
      );

    return BusinessResult.ok({
      category: classificationResult.category,
      confidenceScore: classificationResult.confidenceScore,
      justification: classificationResult.justification,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _classifyDocumentFileAnnotations :: An unknown error occurred`,
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
    const category = parsedInputData.category;
    const processor = getDocumentFileTypeProcessor(category);

    switch (processor) {
      case DOCUMENT_FILE_PROCESSOR.FORM_W2_PROCESSOR: {
        return await _processW2DocumentFile(executionContext, parsedInputData);
      }
      default: {
        logger.warn(
          `${LOG_PREFIX} :: _processDocumentFile :: Unsupported document file type for processing`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
          detail: 'Unsupported document file type for processing',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }
    }
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
 * @package
 */
export const _processW2DocumentFile = async (
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
    const annotations = parsedInputData.annotations;

    await openaiService.createCompletionWithSchema<DocumentProcessorDto[]>({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: DOCUMENT_PROCESSOR_PROMPT_W2_V1,
        },
        {
          role: 'user',
          content: [
            {
              text: JSON.stringify(annotations, null),
              type: 'text',
            },
          ],
        },
      ],
      schema: DocumentProcessorDtoArraySchema,
      schemaName: 'DocumentProcessor',
    });

    return BusinessResult.ok({
      success: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _processW2DocumentFile :: An unknown error occurred`,
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
