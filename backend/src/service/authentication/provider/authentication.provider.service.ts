import { AUTHENTICATION_SCHEME, logger, Nullable } from '@common';
import {
  IdentityCredential,
  IdentityProfile,
} from './helper/authentication.provider.model';
import { AUTHENTICATION_IDENTITY_PROVIDER } from './helper/authentication.provider.constant';
import { firebaseService } from '@lib/provider/authentication/firebase';
import {
  mapIdentityProviderIssuerURL,
  mapFirebaseIdentityProfile,
  mapFirebaseIdentityTokenCredential,
} from './helper/authentication.provider.util';
import { decode } from '@lib/util/jwt.util';

const LOG_PREFIX = 'Service :: Authentication :: AuthenticationProviderService';

const findProviderByBearerToken = (
  token: string
): Nullable<AUTHENTICATION_IDENTITY_PROVIDER> => {
  const decodedToken = decode(token);

  if (!decodedToken?.iss) {
    return null;
  }

  const issuerURL = new URL(decodedToken.iss);

  return mapIdentityProviderIssuerURL(issuerURL.origin);
};

export const findProviderBySchemeAndCredential = (
  scheme: AUTHENTICATION_SCHEME,
  credential: string
): Nullable<AUTHENTICATION_IDENTITY_PROVIDER> => {
  switch (scheme) {
    case AUTHENTICATION_SCHEME.BEARER: {
      return findProviderByBearerToken(credential);
    }
    default: {
      logger.warn(
        `${LOG_PREFIX} :: extractProviderFromSchemeAndCredential :: Unsupported authentication scheme`,
        {
          scheme: scheme,
          credential: credential,
        }
      );
      return null;
    }
  }
};

const verifyFirebaseIdentityTokenCredential = async (
  token: string
): Promise<Nullable<IdentityCredential>> => {
  return mapFirebaseIdentityTokenCredential(
    await firebaseService.verifyIdToken(token)
  ) as Nullable<IdentityCredential>;
};

const verifyFirebaseProviderCredential = async (
  scheme: AUTHENTICATION_SCHEME,
  credential: string
): Promise<Nullable<IdentityCredential>> => {
  switch (scheme) {
    case AUTHENTICATION_SCHEME.BEARER: {
      return verifyFirebaseIdentityTokenCredential(credential);
    }
    default: {
      logger.warn(
        `${LOG_PREFIX} :: verifyFirebaseProviderCredential :: Unsupported authentication scheme`,
        {
          scheme: scheme,
          credential: credential,
        }
      );
      return null;
    }
  }
};

export const verifyProviderCredential = async (
  scheme: AUTHENTICATION_SCHEME,
  credential: string,
  provider: AUTHENTICATION_IDENTITY_PROVIDER
): Promise<Nullable<IdentityCredential>> => {
  switch (provider) {
    case AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE:
      return await verifyFirebaseProviderCredential(scheme, credential);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: verifyProviderCredential :: Unsupported provider`,
        {
          provider: provider,
          credential: credential,
        }
      );
      return null;
    }
  }
};

const createFirebaseProviderCredential = async (
  profileId: string
): Promise<string> => {
  return await firebaseService.createCustomToken(profileId);
};

export const createProviderCredential = async (
  profileId: string,
  provider: AUTHENTICATION_IDENTITY_PROVIDER
): Promise<string> => {
  switch (provider) {
    case AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE:
      return await createFirebaseProviderCredential(profileId);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: createProviderCredential :: Unsupported provider`,
        {
          profileId: profileId,
          provider: provider,
        }
      );
      throw new Error('Unsupported provider');
    }
  }
};

const findFirebaseIdentityProfileById = async (
  id: string
): Promise<Nullable<IdentityProfile>> => {
  return mapFirebaseIdentityProfile(
    await firebaseService.findUserById(id)
  ) as Nullable<IdentityProfile>;
};

export const findIdentityProfileById = async (
  id: string,
  provider: AUTHENTICATION_IDENTITY_PROVIDER
): Promise<Nullable<IdentityProfile>> => {
  switch (provider) {
    case AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE:
      return await findFirebaseIdentityProfileById(id);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: findIdentityProfileById :: Unsupported provider`,
        {
          id: id,
          provider: provider,
        }
      );
      return null;
    }
  }
};

const findFirebaseIdentityProfileByEmail = async (
  email: string
): Promise<Nullable<IdentityProfile>> => {
  return mapFirebaseIdentityProfile(
    await firebaseService.findUserByEmail(email)
  ) as Nullable<IdentityProfile>;
};

export const findIdentityProfileByEmail = async (
  email: string,
  provider: AUTHENTICATION_IDENTITY_PROVIDER
): Promise<Nullable<IdentityProfile>> => {
  switch (provider) {
    case AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE:
      return await findFirebaseIdentityProfileByEmail(email);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: findIdentityProfileByEmail :: Unsupported provider`,
        {
          email: email,
          provider: provider,
        }
      );
      return null;
    }
  }
};

const createFirebaseIdentityProfile = async (
  email: string
): Promise<IdentityProfile> => {
  const firebaseUser = await firebaseService.createUser(email);
  return mapFirebaseIdentityProfile(firebaseUser) as IdentityProfile;
};

export const createIdentityProfile = async (
  email: string,
  provider: AUTHENTICATION_IDENTITY_PROVIDER
): Promise<IdentityProfile> => {
  switch (provider) {
    case AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE:
      return await createFirebaseIdentityProfile(email);
    default: {
      logger.warn(
        `${LOG_PREFIX} :: createIdentityProfile :: Unsupported provider`,
        {
          email: email,
          provider: provider,
        }
      );
      throw new Error('Unsupported provider');
    }
  }
};
