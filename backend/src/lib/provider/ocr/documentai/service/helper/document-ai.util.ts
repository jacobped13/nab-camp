import {
  DOCUMENT_AI_LOCATION,
  DOCUMENT_AI_PROCESSOR,
} from './document-ai.constant';

/**
 * Generates the resource path for a Document AI processor.
 *
 * @returns The resource path for the Document AI processor.
 */
export const generateProcessorPath = (
  projectId: string,
  location: DOCUMENT_AI_LOCATION,
  processor: DOCUMENT_AI_PROCESSOR
): string => {
  return `projects/${projectId}/locations/${location}/processors/${processor}`;
};
