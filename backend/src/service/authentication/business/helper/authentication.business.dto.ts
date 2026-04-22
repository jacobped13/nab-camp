import { z } from 'zod';
import {
  AUTHENTICATION_SCHEME,
  BusinessResultInputContextErrorDto,
} from '@common';
import {
  AUTHENTICATION_IDENTITY_PROVIDER,
  AUTHENTICATION_STAKEHOLDER_TYPE,
} from '../../common/authentication.constant';
import { AuthenticationCodeEntity } from '../../data/helper/authentication.data.model';

// -----------------------------------------------------------------
// Verify Authenticaiton Credential
// -----------------------------------------------------------------

export const VerifyAuthenticationCredentialInputDtoSchema = z.object({
  credential: z.string(),
  scheme: z.nativeEnum(AUTHENTICATION_SCHEME),
});

export type VerifyAuthenticationCredentialInputDto = z.infer<
  typeof VerifyAuthenticationCredentialInputDtoSchema
>;

export type VerifyAuthenticationCredentialErrorDto =
  BusinessResultInputContextErrorDto<VerifyAuthenticationCredentialInputDto>;

// -----------------------------------------------------------------
// Find Identity Profile by Provider Id
// -----------------------------------------------------------------

export const FindIdentityProfileByProviderIdInputDtoSchema = z.object({
  providerId: z.string(),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
});

export type FindIdentityProfileByProviderIdInputDto = z.infer<
  typeof FindIdentityProfileByProviderIdInputDtoSchema
>;

export type FindIdentityProfileByProviderIdErrorDto =
  BusinessResultInputContextErrorDto<FindIdentityProfileByProviderIdInputDto>;

// -----------------------------------------------------------------
// Find Identity Profile by Provider Email
// -----------------------------------------------------------------

export const FindIdentityProfileByProviderEmailInputDtoSchema = z.object({
  email: z.string().email(),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
});

export type FindIdentityProfileByProviderEmailInputDto = z.infer<
  typeof FindIdentityProfileByProviderEmailInputDtoSchema
>;

export type FindIdentityProfileByProviderEmailErrorDto =
  BusinessResultInputContextErrorDto<FindIdentityProfileByProviderEmailInputDto>;

// -----------------------------------------------------------------
// Create Identity Profile
// -----------------------------------------------------------------

export const CreateIdentityProfileInputDtoSchema = z.object({
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
  email: z.string().email(),
});

export type CreateIdentityProfileInputDto = z.infer<
  typeof CreateIdentityProfileInputDtoSchema
>;

export type CreateIdentityProfileErrorDto =
  BusinessResultInputContextErrorDto<CreateIdentityProfileInputDto>;

// -----------------------------------------------------------------
// Find Identity Provider by Provider
// -----------------------------------------------------------------

export const FindIdentityProviderByProviderInputDtoSchema = z.object({
  providerId: z.string(),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
});

export type FindIdentityProviderByProviderInputDto = z.infer<
  typeof FindIdentityProviderByProviderInputDtoSchema
>;

export type FindIdentityProviderByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindIdentityProviderByProviderInputDto>;

// -----------------------------------------------------------------
// Create Stakeholder Identity Provider
// -----------------------------------------------------------------

export const CreateStakeholderIdentityProviderInputDtoSchema = z.object({
  stakeholderId: z.string(),
  stakeholderType: z.nativeEnum(AUTHENTICATION_STAKEHOLDER_TYPE),
  provider: z.nativeEnum(AUTHENTICATION_IDENTITY_PROVIDER),
  providerId: z.string(),
});

export type CreateStakeholderIdentityProviderInputDto = z.infer<
  typeof CreateStakeholderIdentityProviderInputDtoSchema
>;

export type CreateStakeholderIdentityProviderErrorDto =
  BusinessResultInputContextErrorDto<CreateStakeholderIdentityProviderInputDto>;

// -----------------------------------------------------------------
// Find Effective Email Authentication Code by Email
// -----------------------------------------------------------------

export const FindEffectiveEmailAuthenticationCodeByEmailInputDtoSchema =
  z.object({
    email: z.string().email(),
  });

export type FindEffectiveEmailAuthenticationCodeByEmailInputDto = z.infer<
  typeof FindEffectiveEmailAuthenticationCodeByEmailInputDtoSchema
>;

export type FindEffectiveEmailAuthenticationCodeByEmailErrorDto =
  BusinessResultInputContextErrorDto<FindEffectiveEmailAuthenticationCodeByEmailInputDto>;

// -----------------------------------------------------------------
// Create Unique Email Authentication Code
// -----------------------------------------------------------------

export const CreateEmailAuthenticationCodeInputDtoSchema = z.object({
  email: z.string().email(),
});

export type CreateEmailAuthenticationCodeInputDto = z.infer<
  typeof CreateEmailAuthenticationCodeInputDtoSchema
>;

export type CreateEmailAuthenticationCodeOutputDto = {
  code: string;
  authenticationCode: AuthenticationCodeEntity;
};

export type CreateEmailAuthenticationCodeErrorDto =
  BusinessResultInputContextErrorDto<CreateEmailAuthenticationCodeInputDto>;

// -----------------------------------------------------------------
// Send Email Authentication Code
// -----------------------------------------------------------------

export const SendEmailAuthenticationCodeInputDtoSchema = z.object({
  email: z.string().email(),
});

export type SendEmailAuthenticationCodeInputDto = z.infer<
  typeof SendEmailAuthenticationCodeInputDtoSchema
>;

export type SendEmailAuthenticationCodeOutputDto = {
  code: string;
  authenticationCode: AuthenticationCodeEntity;
};

export type SendEmailAuthenticationCodeErrorDto =
  BusinessResultInputContextErrorDto<SendEmailAuthenticationCodeInputDto>;

// -----------------------------------------------------------------
// Verify Email Authentication Code
// -----------------------------------------------------------------

export const VerifyEmailAuthenticationCodeInputDtoSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export type VerifyEmailAuthenticationCodeInputDto = z.infer<
  typeof VerifyEmailAuthenticationCodeInputDtoSchema
>;

export type VerifyEmailAuthenticationCodeErrorDto =
  BusinessResultInputContextErrorDto<VerifyEmailAuthenticationCodeInputDto>;

// -----------------------------------------------------------------
// Accept Email Authentication Code
// -----------------------------------------------------------------

export const AcceptEmailAuthenticationCodeInputDtoSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export type AcceptEmailAuthenticationCodeInputDto = z.infer<
  typeof AcceptEmailAuthenticationCodeInputDtoSchema
>;

export type AcceptEmailAuthenticationCodeErrorDto =
  BusinessResultInputContextErrorDto<AcceptEmailAuthenticationCodeInputDto>;
