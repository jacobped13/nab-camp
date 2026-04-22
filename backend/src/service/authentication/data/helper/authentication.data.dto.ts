import {
  AUTHENTICATION_IDENTITY_PROVIDER,
  AUTHENTICATION_STAKEHOLDER_TYPE,
} from '../../common/authentication.constant';

export type StakeholderDto = {
  stakeholderId: string;
  stakeholderType: AUTHENTICATION_STAKEHOLDER_TYPE;
};

export type IdentityProviderDto = {
  providerId: string;
  provider: AUTHENTICATION_IDENTITY_PROVIDER;
};
