import { z } from 'zod';
import { BusinessResultInputContextErrorDto } from '@common';
import {
  AUTHENTICATION_IDENTITY_PROVIDER,
  StakeholderIdentityProviderEntity,
} from '@service/authentication';
import { UserEntity } from '../../data/helper/user.data.model';

// -----------------------------------------------------------------
// Find User by Email
// -----------------------------------------------------------------

export const FindUserByEmailInputDtoSchema = z.object({
  email: z.string().email(),
});

export type FindUserByEmailInputDto = z.infer<
  typeof FindUserByEmailInputDtoSchema
>;

export type CreateUserByIdentityProviderOutputDto = {
  user: UserEntity;
  identityProvider: StakeholderIdentityProviderEntity;
};

export type FindUserByEmailErrorDto =
  BusinessResultInputContextErrorDto<FindUserByEmailInputDto>;

// -----------------------------------------------------------------
// Find User by ID
// -----------------------------------------------------------------

export const FindUserByIdInputDtoSchema = z.object({
  id: z.string(),
});

export type FindUserByIdInputDto = z.infer<typeof FindUserByIdInputDtoSchema>;

export type FindUserByIdErrorDto =
  BusinessResultInputContextErrorDto<FindUserByIdInputDto>;

// -----------------------------------------------------------------
// Create User by Identity Provider
// -----------------------------------------------------------------

export const CreateUserByIdentityProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
  providerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type CreateUserByIdentityProviderInputDto = z.infer<
  typeof CreateUserByIdentityProviderInputDtoSchema
>;

export type CreateUserByIdentityProviderErrorDto =
  BusinessResultInputContextErrorDto<CreateUserByIdentityProviderInputDto>;

// -----------------------------------------------------------------
// Find User by Identity Provider
// -----------------------------------------------------------------

export const FindUserByIdentityProviderInputDtoSchema = z.object({
  providerId: z.string(),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
});

export type FindUserByIdentityProviderInputDto = z.infer<
  typeof FindUserByIdentityProviderInputDtoSchema
>;

export type FindUserByIdentityProviderOutputDto = {
  user: UserEntity;
  identityProvider: StakeholderIdentityProviderEntity;
};

export type FindUserByIdentityProviderErrorDto =
  BusinessResultInputContextErrorDto<FindUserByIdentityProviderInputDto>;

// -----------------------------------------------------------------
// Create User Identity Provider
// -----------------------------------------------------------------

export const CreateUserIdentityProviderInputDtoSchema = z.object({
  userId: z.string(),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
  providerId: z.string(),
});

export type CreateUserIdentityProviderInputDto = z.infer<
  typeof CreateUserIdentityProviderInputDtoSchema
>;

export type CreateUserIdentityProviderErrorDto =
  BusinessResultInputContextErrorDto<CreateUserIdentityProviderInputDto>;

// -----------------------------------------------------------------
// Find User Identity Provider by Provider
// -----------------------------------------------------------------

export const FindUserIdentityProviderByProviderInputDtoSchema = z.object({
  providerId: z.string(),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
});

export type FindUserIdentityProviderByProviderInputDto = z.infer<
  typeof FindUserIdentityProviderByProviderInputDtoSchema
>;

export type FindUserIdentityProviderByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindUserIdentityProviderByProviderInputDto>;

// -----------------------------------------------------------------
// Update User Profile
// -----------------------------------------------------------------

export const UpdateUserProfileInputDtoSchema = z
  .object({
    userId: z.string(),
    firstName: z.string().min(1).nullable().optional(),
    lastName: z.string().min(1).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.firstName === undefined && data.lastName === undefined) {
        return false;
      }
      return true;
    },
    {
      message: 'Must provide at least one field to update',
    }
  );

export type UpdateUserProfileInputDto = z.infer<
  typeof UpdateUserProfileInputDtoSchema
>;

export type UpdateUserProfileErrorDto =
  BusinessResultInputContextErrorDto<UpdateUserProfileInputDto>;
