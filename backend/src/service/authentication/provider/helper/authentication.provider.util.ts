import { DataMapper, Nullable } from '@common';
import {
  DecodedIdToken as FirebaseIdToken,
  UserRecord as FirebaseUserRecord,
} from '@lib/provider/authentication/firebase';
import {
  IdentityCredential,
  IdentityProfile,
} from './authentication.provider.model';
import { AUTHENTICATION_IDENTITY_PROVIDER } from './authentication.provider.constant';
import { TIMING } from '@shared-lib/timing';

// -----------------------------------------------------------------
// Identity Credential Mappers
// -----------------------------------------------------------------

class FirebseIdentityTokenCredentialMapper extends DataMapper<
  FirebaseIdToken,
  IdentityCredential
> {
  override mapInputObject(source: FirebaseIdToken): IdentityCredential {
    // Firebase timestamps are in seconds, convert to milliseconds.
    const timeMultiplier = TIMING.SECOND.IN_MILLISECONDS;

    const expireAt = new Date(source.exp * timeMultiplier);
    const issueAt = new Date(source.iat * timeMultiplier);

    return new IdentityCredential(
      source.sub,
      AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE,
      source.email ?? null,
      issueAt,
      expireAt
    );
  }
}

const firebaseIdentityTokenCredentialMapper =
  new FirebseIdentityTokenCredentialMapper();

/**
 * Maps a firebase identity token to a normalized {@link IdentityCredential identity credential}.
 */
export const mapFirebaseIdentityTokenCredential = (
  token: Nullable<FirebaseIdToken> | FirebaseIdToken[]
) => {
  return firebaseIdentityTokenCredentialMapper.map(token);
};

// -----------------------------------------------------------------
// Identity Profile Mappers
// -----------------------------------------------------------------

class FirebaseIdentityProfileMapper extends DataMapper<
  FirebaseUserRecord,
  IdentityProfile
> {
  override mapInputObject(source: FirebaseUserRecord): IdentityProfile {
    return new IdentityProfile(
      source.uid,
      source.email ?? null,
      AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE
    );
  }
}

export const firebaseIdentityProfileMapper =
  new FirebaseIdentityProfileMapper();

/**
 * Maps a firebase user record to a normalized {@link IdentityProfile identity profile}.
 */
export const mapFirebaseIdentityProfile = (
  profile: Nullable<FirebaseUserRecord> | FirebaseUserRecord[]
) => {
  return firebaseIdentityProfileMapper.map(profile);
};

// -----------------------------------------------------------------
// Identity Token Subject Mapper
// -----------------------------------------------------------------

/**
 * Maps an identity provider to its corresponding token issuer URL.
 */
export const IDENTITY_PROVIDER_TO_TOKEN_ISSUER_MAP: Partial<
  Record<AUTHENTICATION_IDENTITY_PROVIDER, string>
> = {
  [AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE]: 'https://securetoken.google.com',
};

/**
 * Maps an identity token issuer URL to its corresponding provider.
 */
export const IDENTITY_TOKEN_ISSUER_TO_PROVIDER_MAP: Partial<
  Record<string, AUTHENTICATION_IDENTITY_PROVIDER>
> = Object.fromEntries(
  Object.entries(IDENTITY_PROVIDER_TO_TOKEN_ISSUER_MAP).map(
    ([provider, issuer]) => [
      issuer,
      provider as AUTHENTICATION_IDENTITY_PROVIDER,
    ]
  )
);

/**
 * Maps an identity provider issuer URL to its corresponding provider.
 */
export const mapIdentityProviderIssuerURL = (
  issuerURL: string
): Nullable<AUTHENTICATION_IDENTITY_PROVIDER> => {
  return IDENTITY_TOKEN_ISSUER_TO_PROVIDER_MAP[issuerURL] ?? null;
};
