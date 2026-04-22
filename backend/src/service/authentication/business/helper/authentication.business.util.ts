import { createHash } from 'crypto';

/**
 * Generates a random 6-digit authentication code.
 *
 * @returns A random 6-digit code as a string.
 */
export const generateAuthenticationCode = (): string => {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hashes the authentication code using SHA-256.
 *
 * @returns The hashed code as a hexadecimal string.
 */
export const hashAuthenticationCode = (code: string): string => {
  return createHash('sha256').update(code).digest('hex');
};

/**
 * Checks if the provided authentication code is valid.
 *
 * @returns True if the code is valid, false otherwise.
 */
export const isValidAuthenticationCode = (
  code: string,
  hashedCode: string
): boolean => {
  return hashAuthenticationCode(code) === hashedCode;
};
