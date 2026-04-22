import { env } from '@env';
import { AUTHENTICATION_CODE_VERIFICATION_ROUTE } from './email.provider.constant';

/**
 * Generates a URL string for verifying an authentication code.
 *
 * @returns The generated URL string.
 */
export const generateAuthenticationCodeURL = (
  code: string,
  email: string
): string => {
  const url = new URL(env.APP_BASE_URL);
  url.pathname = AUTHENTICATION_CODE_VERIFICATION_ROUTE;

  url.searchParams.set('code', code);
  url.searchParams.set('email', email);

  return url.toString();
};
