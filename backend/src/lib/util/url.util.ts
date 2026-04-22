import { env } from '@env';

/**
 * Represents the application paths used for redirection.
 */
export enum APP_PATH {
  BILLING = '/settings/billing',
  REACTIVATION = '/account/inactive',
  REGISTRATION = '/account/registration',
}

/**
 * Creates a URL for the application with the specified pathname.
 *
 * @returns The redirect URL containing the app base URL and the specified pathname.
 */
export const generateAppUrl = (pathname: APP_PATH): string => {
  const url = new URL(env.APP_BASE_URL);
  url.pathname = pathname;
  return url.toString();
};
