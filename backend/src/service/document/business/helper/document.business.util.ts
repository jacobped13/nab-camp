import { v7 as uuid } from 'uuid';

/**
 * Generates a unique identifier for a document file.
 *
 * @return A unique document file identifier.
 */
export const generateDocumentFileId = () => {
  return uuid();
};
