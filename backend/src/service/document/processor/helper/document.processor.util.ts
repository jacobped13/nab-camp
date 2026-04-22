import {
  DOCUMENT_FILE_PROCESSOR,
  DOCUMENT_FILE_TYPE,
  DOCUMENT_TYPE_PROCESSOR,
} from './document.processor.constant';

/**
 * Get the document file type processor for a given document type.
 *
 * @returns The document file processor for the given document type.
 */
export const getDocumentFileTypeProcessor = (
  documentType: DOCUMENT_FILE_TYPE
): DOCUMENT_FILE_PROCESSOR => {
  return DOCUMENT_TYPE_PROCESSOR[documentType]!;
};
