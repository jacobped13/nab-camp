import { BusinessResultInputContextErrorDto } from 'src/common/util/business-result.util';
import { z } from 'zod';
import { DOCUMENT_FILE_TYPE } from './document.processor.constant';
import { TextAnnotation } from '@lib/provider/ocr/vision';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

export const DocumentClassificationDtoSchema = z.object({
  category: z.nativeEnum(DOCUMENT_FILE_TYPE),
  confidenceScore: z.number().min(0).max(1),
  justification: z.string(),
});

export type DocumentClassificationDto = z.infer<
  typeof DocumentClassificationDtoSchema
>;

export const DocumentProcessorDtoSchema = z.object({
  fieldName: z.string(),
  value: z.string().nullable(),
  coordinates: z.array(z.array(z.number())),
  confidenceScore: z.number().min(0).max(1),
});

export type DocumentProcessorDto = z.infer<typeof DocumentProcessorDtoSchema>;

export const DocumentProcessorDtoArraySchema = z.object({
  items: z.array(DocumentProcessorDtoSchema),
});

export type DocumentProcessorDtoArray = z.infer<
  typeof DocumentProcessorDtoArraySchema
>;

// -----------------------------------------------------------------
// Annotate Remote Document File
// -----------------------------------------------------------------

export const AnnotateRemoteDocumentFileInputDtoSchema = z.object({
  fileUrl: z.string().url(),
});

export type AnnotateRemoteDocumentFileInputDto = z.infer<
  typeof AnnotateRemoteDocumentFileInputDtoSchema
>;

export type AnnotateRemoteDocumentFileOutputDto = {
  annotations: TextAnnotation;
};

export type AnnotateRemoteDocumentFileErrorDto =
  BusinessResultInputContextErrorDto<AnnotateRemoteDocumentFileInputDto>;

// -----------------------------------------------------------------
// Classify Document File Annotations
// -----------------------------------------------------------------

export const ClassifyDocumentFileAnnotationsInputDtoSchema = z.object({
  text: z.string(),
});

export type ClassifyDocumentFileAnnotationsInputDto = z.infer<
  typeof ClassifyDocumentFileAnnotationsInputDtoSchema
>;

export type ClassifyDocumentFileAnnotationsOutputDto = {
  category: DOCUMENT_FILE_TYPE;
  confidenceScore: number;
  justification: string;
};

export type ClassifyDocumentFileAnnotationsErrorDto =
  BusinessResultInputContextErrorDto<ClassifyDocumentFileAnnotationsInputDto>;

// -----------------------------------------------------------------
// Process Document File
// -----------------------------------------------------------------

export const ProcessDocumentFileInputDtoSchema = z.object({
  category: z.nativeEnum(DOCUMENT_FILE_TYPE),
  annotations: z.record(z.string(), z.any()),
  fileUrl: z.string().url(),
});

export type ProcessDocumentFileInputDto = z.infer<
  typeof ProcessDocumentFileInputDtoSchema
>;

export type ProcessDocumentFileOutputDto = {
  success: boolean;
};

export type ProcessDocumentFileErrorDto =
  BusinessResultInputContextErrorDto<ProcessDocumentFileInputDto>;
