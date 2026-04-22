import { Nullable } from '@common';
import { decode as JWTDecode } from 'jsonwebtoken';

/**
 * Represents the payload of a JWT token.
 */
export type JWTPayload = {
  iss?: string;
};

/**
 * Decode a JWT token.
 *
 * @returns The decoded JWT payload or null if invalid.
 */
export const decode = <T extends JWTPayload = JWTPayload>(
  token: string
): Nullable<T> => {
  return JWTDecode(token) as Nullable<T>;
};
