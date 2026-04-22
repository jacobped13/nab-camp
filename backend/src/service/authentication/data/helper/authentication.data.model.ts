import { Nullable } from '@common';
import {
  AUTHENTICATION_CODE_TARGET_TYPE,
  AUTHENTICATION_IDENTITY_PROVIDER,
  AUTHENTICATION_STAKEHOLDER_TYPE,
} from '../../common/authentication.constant';

/**
 * Represents an authentication code.
 */
export class AuthenticationCodeEntity {
  constructor(
    public readonly id: string,
    public readonly targetId: string,
    public readonly targetType: AUTHENTICATION_CODE_TARGET_TYPE,
    public readonly codeHash: string,
    public readonly acceptedAt: Nullable<Date>,
    public readonly expireAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public isEmailTarget(): boolean {
    return this.targetType === AUTHENTICATION_CODE_TARGET_TYPE.EMAIL;
  }

  public isExpired(): boolean {
    return this.expireAt.getTime() < Date.now();
  }

  public isAccepted(): boolean {
    return this.acceptedAt !== null;
  }
}

/**
 * Represents a normalized stakeholder identity provider connection in the system.
 */
export class StakeholderIdentityProviderEntity {
  constructor(
    public readonly id: string,
    public readonly stakeholderId: string,
    public readonly stakeholderType: AUTHENTICATION_STAKEHOLDER_TYPE,
    public readonly providerId: string,
    public readonly provider: AUTHENTICATION_IDENTITY_PROVIDER,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
