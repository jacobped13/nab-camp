import { Nullable } from '@common';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  IdentityProviderDto,
  StakeholderDto,
} from './helper/authentication.data.dto';
import { AUTHENTICATION_CODE_TARGET_TYPE } from '../common/authentication.constant';
import {
  AuthenticationCodeEntity,
  StakeholderIdentityProviderEntity,
} from './helper/authentication.data.model';
import {
  mapAuthenticationCodeEntity,
  mapStakeholderIdentityProviderEntity,
} from './helper/authentication.data.util';

export const findStakeholderIdentityProviderByProvider = async (
  provider: IdentityProviderDto
): Promise<Nullable<StakeholderIdentityProviderEntity>> => {
  return mapStakeholderIdentityProviderEntity(
    await prisma.stakeholderIdentityProvider.findUnique({
      where: {
        provider_providerId: {
          provider: provider.provider,
          providerId: provider.providerId,
        },
      },
    })
  ) as StakeholderIdentityProviderEntity;
};

export const createStakeholderIdentityProvider = async (
  stakeholder: StakeholderDto,
  provider: IdentityProviderDto
): Promise<StakeholderIdentityProviderEntity> => {
  const currentDate = new Date();

  return mapStakeholderIdentityProviderEntity(
    await prisma.stakeholderIdentityProvider.create({
      data: {
        stakeholderId: stakeholder.stakeholderId,
        stakeholderType: stakeholder.stakeholderType,
        provider: provider.provider,
        providerId: provider.providerId,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as StakeholderIdentityProviderEntity;
};

export const findLatestEmailAuthenticationCodeByEmail = async (
  email: string
): Promise<Nullable<AuthenticationCodeEntity>> => {
  return mapAuthenticationCodeEntity(
    await prisma.authenticationCode.findFirst({
      where: {
        targetId: email,
        targetType: AUTHENTICATION_CODE_TARGET_TYPE.EMAIL,
      },
      orderBy: {
        // Get the most recent code
        createdAt: 'desc',
      },
    })
  ) as Nullable<AuthenticationCodeEntity>;
};

export const createEmailAuthenticationCode = async (
  email: string,
  codeHash: string,
  expireAt: Date
): Promise<AuthenticationCodeEntity> => {
  return mapAuthenticationCodeEntity(
    await prisma.authenticationCode.create({
      data: {
        targetId: email,
        targetType: AUTHENTICATION_CODE_TARGET_TYPE.EMAIL,
        codeHash: codeHash,
        acceptedAt: null,
        expireAt: expireAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  ) as AuthenticationCodeEntity;
};

export const acceptAuthenticationCodeById = async (
  id: string
): Promise<AuthenticationCodeEntity> => {
  const currentDate = new Date();

  return mapAuthenticationCodeEntity(
    await prisma.authenticationCode.update({
      where: {
        id: id,
      },
      data: {
        acceptedAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as AuthenticationCodeEntity;
};
