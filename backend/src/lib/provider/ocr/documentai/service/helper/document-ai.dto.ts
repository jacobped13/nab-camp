import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { DOCUMENT_AI_PROCESSOR } from './document-ai.constant';
import { MimeType } from '@shared-lib/file-types';

// -----------------------------------------------------------------
// Initialize Client
// -----------------------------------------------------------------

export type InitializeClientOutputDto = {
  client: DocumentProcessorServiceClient;
  projectId: string;
};

// -----------------------------------------------------------------
// Process Remote GCS Document
// -----------------------------------------------------------------

export type ProcessRemoteGCSDocumentInputDto = {
  bucketName: string;
  filePath: string;
  fileMimeType: MimeType;
  processor: DOCUMENT_AI_PROCESSOR;
};
