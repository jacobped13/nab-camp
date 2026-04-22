import { TIMING } from '@shared-lib/timing';
import { AUTHENTICATION_IDENTITY_PROVIDER } from '../../provider/helper/authentication.provider.constant';

/**
 * The expiration time for email authentication codes.
 */
export const EMAIL_AUTHENTICATION_CODE_EXPIRATION_TIME_MILLISECONDS =
  TIMING.MINUTE.IN_MILLISECONDS * 15;

/**
 * The identity provider responsible for handling email authentication codes.
 */
export const EMAIL_AUTHENTICATION_CODE_PROVIDER: AUTHENTICATION_IDENTITY_PROVIDER =
  AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE;
