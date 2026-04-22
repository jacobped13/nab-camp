/**
 * Generates a file name with the appropriate extension based on the provided file extension.
 *
 * @returns The generated file name with extension.
 */
export const generateFileNameWithExtension = (
  fileName: string,
  fileExtension: string
): string => {
  return `${fileName}.${fileExtension}`;
};

/**
 * Generates a GCS bucket file path based on the provided file path, file name, and file extension.
 *
 * @returns The generated GCS bucket file path.
 */
export const generateBucketFilePath = (
  basePath: string,
  fileName: string
): string => {
  const url = new URL(basePath, 'https://test.com');
  const pathname = url.pathname.replace(/^\/+|\/+$/g, '');

  return `${pathname}/${fileName}`;
};
