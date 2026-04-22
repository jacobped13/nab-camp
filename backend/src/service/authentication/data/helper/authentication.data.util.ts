import { Nullable } from '@common';
import { DataMapper } from '@common';
import {
  AuthenticationCode,
  StakeholderIdentityProvider,
} from '@prisma/client';
import {
  AuthenticationCodeEntity,
  StakeholderIdentityProviderEntity,
} from './authentication.data.model';
import {
  AUTHENTICATION_CODE_TARGET_TYPE,
  AUTHENTICATION_IDENTITY_PROVIDER,
  AUTHENTICATION_STAKEHOLDER_TYPE,
} from '../../common/authentication.constant';

// -----------------------------------------------------------------
// Authentication Code Mapper
// -----------------------------------------------------------------

class AuthenticationCodeMapper extends DataMapper<
  AuthenticationCode,
  AuthenticationCodeEntity
> {
  override mapInputObject(
    source: AuthenticationCode
  ): AuthenticationCodeEntity {
    return new AuthenticationCodeEntity(
      source.id,
      source.targetId,
      source.targetType as AUTHENTICATION_CODE_TARGET_TYPE,
      source.codeHash,
      source.acceptedAt,
      source.expireAt,
      source.createdAt,
      source.updatedAt
    );
  }
}

const authenticationCodeMapper = new AuthenticationCodeMapper();

/**
 * Maps an ORM authentication code record to a normalized {@link AuthenticationCodeEntity}.
 */
export const mapAuthenticationCodeEntity = (
  source: Nullable<AuthenticationCode> | AuthenticationCode[]
) => {
  return authenticationCodeMapper.map(source);
};

// -----------------------------------------------------------------
// Stakeholder Identity Provider Mapper
// -----------------------------------------------------------------

class StakeholderIdentityProviderMapper extends DataMapper<
  StakeholderIdentityProvider,
  StakeholderIdentityProviderEntity
> {
  override mapInputObject(
    source: StakeholderIdentityProvider
  ): StakeholderIdentityProviderEntity {
    return new StakeholderIdentityProviderEntity(
      source.id,
      source.stakeholderId,
      source.stakeholderType as AUTHENTICATION_STAKEHOLDER_TYPE,
      source.providerId,
      source.provider as AUTHENTICATION_IDENTITY_PROVIDER,
      source.createdAt,
      source.updatedAt
    );
  }
}

const stakeholderIdentityProviderMapper =
  new StakeholderIdentityProviderMapper();

/**
 * Maps an ORM stakeholder identity provider record to a normalized {@link StakeholderIdentityProviderEntity}.
 */
export const mapStakeholderIdentityProviderEntity = (
  source: Nullable<StakeholderIdentityProvider> | StakeholderIdentityProvider[]
) => {
  return stakeholderIdentityProviderMapper.map(source);
};
