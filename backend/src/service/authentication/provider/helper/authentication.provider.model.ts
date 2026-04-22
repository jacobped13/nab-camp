import { Nullable } from '@common';
import { AUTHENTICATION_IDENTITY_PROVIDER } from './authentication.provider.constant';

/**
 * Represents a credential issued by an identity provider.
 */
export class IdentityCredential {
  constructor(
    public readonly id: string,
    public readonly provider: AUTHENTICATION_IDENTITY_PROVIDER,
    public readonly altId: Nullable<string>,
    public readonly issueAt: Nullable<Date>,
    public readonly expireAt: Nullable<Date>
  ) {}
}

/**
 * Represents a profile from an identity provider.
 */
export class IdentityProfile {
  constructor(
    public readonly id: string,
    public readonly email: Nullable<string>,
    public readonly provider: AUTHENTICATION_IDENTITY_PROVIDER
  ) {}
}
