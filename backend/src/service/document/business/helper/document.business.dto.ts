import { z } from 'zod';
import {
  SUPPORTED_DOCUMENT_FILE_EXTENSION_SET,
  SUPPORTED_DOCUMENT_FILE_MIME_TYPES,
} from './document.business.constant';
import { BusinessResultInputContextErrorDto } from '@common';

// -----------------------------------------------------------------
// Create Document Upload Url
// -----------------------------------------------------------------

export const CreateDocumentFileUploadUrlInputDtoSchema = z.object({
  workspaceId: z.string(),
  requestId: z.string().uuid().optional(),
  fileMimeType: z.enum(SUPPORTED_DOCUMENT_FILE_MIME_TYPES),
});

export type CreateDocumentFileUploadUrlInputDto = z.infer<
  typeof CreateDocumentFileUploadUrlInputDtoSchema
>;

export type CreateDocumentFileUploadUrlOutputDto = {
  fileId: string;
  fileExtension: string;
  uploadUrl: string;
  requestId?: string;
};

export type CreateDocumentFileUploadUrlErrorDto =
  BusinessResultInputContextErrorDto<CreateDocumentFileUploadUrlInputDto>;

// -----------------------------------------------------------------
// Create Document File Download Url
// -----------------------------------------------------------------

export const CreateDocumentFileDownloadUrlInputDtoSchema = z.object({
  workspaceId: z.string(),
  fileId: z.string(),
  fileExtension: z.string().refine((fileExtension) => {
    return SUPPORTED_DOCUMENT_FILE_EXTENSION_SET.has(fileExtension);
  }),
});

export type CreateDocumentFileDownloadUrlInputDto = z.infer<
  typeof CreateDocumentFileDownloadUrlInputDtoSchema
>;

export type CreateDocumentFileDownloadUrlOutputDto = {
  fileId: string;
  fileExtension: string;
  downloadUrl: string;
};

export type CreateDocumentFileDownloadUrlErrorDto =
  BusinessResultInputContextErrorDto<CreateDocumentFileDownloadUrlInputDto>;

// -----------------------------------------------------------------
// Process Document File
// -----------------------------------------------------------------

export const ProcessDocumentFileInputDtoSchema = z.object({
  fileId: z.string(),
  fileExtension: z.string().refine((fileExtension) => {
    return SUPPORTED_DOCUMENT_FILE_EXTENSION_SET.has(fileExtension);
  }),
  workspaceId: z.string(),
});

export type ProcessDocumentFileInputDto = z.infer<
  typeof ProcessDocumentFileInputDtoSchema
>;

export type ProcessDocumentFileOutputDto = {
  success: boolean;
};

export type ProcessDocumentFileErrorDto =
  BusinessResultInputContextErrorDto<ProcessDocumentFileInputDto>;
