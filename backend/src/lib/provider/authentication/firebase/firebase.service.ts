import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';
import {
  DecodedIdToken,
  FirebaseAuthError,
  UserRecord,
  getAuth,
} from 'firebase-admin/auth';
import { env } from '@env';
import { Nullable, injectExceptionDetails, logger } from '@common';

const LOG_PREFIX = 'Lib :: Provider :: Authentication :: Firebase';

// -----------------------------------------------------------------
// Client
// -----------------------------------------------------------------

const initializeFirebase = (serviceAccount: Record<string, unknown>) => {
  try {
    if (getApps().length) {
      return getApp();
    }

    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: initializeFirebase :: An unknown error occcurred`,
      injectExceptionDetails(error)
    );
    throw new Error('Failed to initialize Firebase client');
  }
};

const firebaseClient = initializeFirebase(env.FIREBASE_AUTH_SERVICE_ACCOUNT);
const firebaseAuthClient = getAuth(firebaseClient);

// -----------------------------------------------------------------
// Functions
// -----------------------------------------------------------------

export const verifyIdToken = async (
  token: string,
  validateRevoked?: boolean
): Promise<Nullable<DecodedIdToken>> => {
  try {
    return await firebaseAuthClient.verifyIdToken(token, validateRevoked);
  } catch (error: unknown) {
    // Swallow firebase auth errors to return null
    // By default, FirebaseAuthError is thrown when the token is invalid or expired
    if (error instanceof FirebaseAuthError) {
      return null;
    }
    logger.error(
      `${LOG_PREFIX} :: verifyIdToken :: An unknown error occurred`,
      injectExceptionDetails(error, {
        token: token,
      })
    );
    throw new Error('Failed to verify ID token');
  }
};

export const findUserById = async (
  userId: string
): Promise<Nullable<UserRecord>> => {
  try {
    return await firebaseAuthClient.getUser(userId);
  } catch (error: unknown) {
    // Swallow firebase auth errors to return null
    // By default, FirebaseAuthError is thrown when the user does not exist
    if (error instanceof FirebaseAuthError) {
      return null;
    }
    logger.error(
      `${LOG_PREFIX} :: findUserById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        userId: userId,
      })
    );
    throw new Error('Failed to find user by ID');
  }
};

export const findUserByEmail = async (
  email: string
): Promise<Nullable<UserRecord>> => {
  try {
    return await firebaseAuthClient.getUserByEmail(email);
  } catch (error: unknown) {
    // Swallow firebase auth errors to return null
    // By default, FirebaseAuthError is thrown when the user does not exist
    if (error instanceof FirebaseAuthError) {
      return null;
    }
    logger.error(
      `${LOG_PREFIX} :: findUserByEmail :: An unknown error occurred`,
      injectExceptionDetails(error, {
        email: email,
      })
    );
    throw new Error('Failed to find user by email');
  }
};

export const createCustomToken = async (userId: string): Promise<string> => {
  try {
    return await firebaseAuthClient.createCustomToken(userId);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createCustomToken :: An unknown error occurred`,
      injectExceptionDetails(error, {
        userId: userId,
      })
    );
    throw new Error('Failed to create custom token');
  }
};

export const createUser = async (email: string): Promise<UserRecord> => {
  try {
    return await firebaseAuthClient.createUser({
      email: email,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createUser :: An unknown error occurred`,
      injectExceptionDetails(error, {
        email: email,
      })
    );
    throw new Error('Failed to create user');
  }
};
