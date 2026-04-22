import {
  BusinessErrorResult,
  BusinessResult,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  Nullable,
  RESULT_ERROR_CODE,
} from '@common';
import {
  AssignDefaultWorkspaceErrorDto,
  AssignDefaultWorkspaceInputDto,
  AssignDefaultWorkspaceInputDtoSchema,
  AssignDefaultWorkspaceOutputDto,
  AssignWorkspaceMemberRoleErrorDto,
  AssignWorkspaceMemberRoleInputDto,
  AssignWorkspaceMemberRoleInputDtoSchema,
  AssignWorkspaceMemberRoleOutputDto,
  AssignWorkspaceOwnerErrorDto,
  AssignWorkspaceOwnerInputDto,
  AssignWorkspaceOwnerInputDtoSchema,
  AssignWorkspaceOwnerOutputDto,
  CreateWorkspaceAndMemberErrorDto,
  CreateWorkspaceAndMemberInputDto,
  CreateWorkspaceAndMemberInputDtoSchema,
  CreateWorkspaceAndMemberOutputDto,
  CreateWorkspaceBillingProviderErrorDto,
  CreateWorkspaceBillingProviderInputDto,
  CreateWorkspaceBillingProviderInputDtoSchema,
  CreateWorkspaceBillingProviderOutputDto,
  ExtractPrimarySubscriptionConnectionsErrorDto,
  ExtractPrimarySubscriptionConnectionsInputDto,
  ExtractPrimarySubscriptionConnectionsOutputDto,
  FindAllAccessSubscriptionsByWorkspaceIdsErrorDto,
  FindAllAccessSubscriptionsByWorkspaceIdsInputDto,
  FindAllAccessSubscriptionsByWorkspaceIdsInputDtoSchema,
  FindAllAccessSubscriptionsByWorkspaceIdsOutputDto,
  FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsErrorDto,
  FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDto,
  FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDtoSchema,
  FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsOutputDto,
  FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdErrorDto,
  FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDto,
  FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDtoSchema,
  FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdOutputDto,
  FindAllPrimarySubscriptionConnectionsByWorkspaceIdsErrorDto,
  FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDto,
  FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDtoSchema,
  FindAllPrimarySubscriptionConnectionsByWorkspaceIdsOutputDto,
  FindAllWorkspacesAndMembershipsByUserIdErrorDto,
  FindAllWorkspacesAndMembershipsByUserIdInputDto,
  FindAllWorkspacesAndMembershipsByUserIdInputDtoSchema,
  FindAllWorkspacesAndMembershipsByUserIdOutputDto,
  FindWorkspaceAndMembershipByUserDefaultErrorDto,
  FindWorkspaceAndMembershipByUserDefaultInputDto,
  FindWorkspaceAndMembershipByUserDefaultInputDtoSchema,
  FindWorkspaceAndMembershipByUserDefaultOutputDto,
  FindWorkspaceBillingProviderConnectionErrorDto,
  FindWorkspaceBillingProviderConnectionInputDto,
  FindWorkspaceBillingProviderConnectionInputDtoSchema,
  FindWorkspaceBillingProviderConnectionOutputDto,
  FindWorkspaceBillingProviderErrorDto,
  FindWorkspaceBillingProviderInputDto,
  FindWorkspaceBillingProviderInputDtoSchema,
  FindWorkspaceBillingProviderOutputDto,
  FindWorkspaceByIdErrorDto,
  FindWorkspaceByIdInputDto,
  FindWorkspaceByIdInputDtoSchema,
  FindWorkspaceCheckoutSessionByIdErrorDto,
  FindWorkspaceCheckoutSessionByIdInputDto,
  FindWorkspaceCheckoutSessionByIdInputDtoSchema,
  FindWorkspaceCheckoutSessionByIdOutputDto,
  FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdErrorDto,
  FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDto,
  FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDtoSchema,
  FindWorkspaceMembershipByWorkspaceIdAndUserIdErrorDto,
  FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDto,
  FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDtoSchema,
  RemoveDefaultWorkspaceErrorDto,
  RemoveDefaultWorkspaceInputDto,
  RemoveDefaultWorkspaceInputDtoSchema,
  RemoveDefaultWorkspaceOutputDto,
  UpdateWorkspaceDetailsErrorDto,
  UpdateWorkspaceDetailsInputDto,
  UpdateWorkspaceDetailsInputDtoSchema,
  FindAllAccessSubscriptionPlansOutputDto,
  FindAllAccessSubscriptionPlansErrorDto,
  CreateAccessSubscriptionCheckoutSessionInputDto,
  CreateAccessSubscriptionCheckoutSessionOutputDto,
  CreateAccessSubscriptionCheckoutSessionErrorDto,
  CreateAccessSubscriptionCheckoutSessionInputDtoSchema,
  CancelAccessSubscriptionAtPeriodEndInputDto,
  CancelAccessSubscriptionAtPeriodEndOutputDto,
  CancelAccessSubscriptionAtPeriodEndErrorDto,
  CancelAccessSubscriptionAtPeriodEndInputDtoSchema,
  FindAccessSubscriptionByWorkspaceIdInputDtoSchema,
  FindAccessSubscriptionByWorkspaceIdInputDto,
  FindAccessSubscriptionByWorkspaceIdOutputDto,
  FindAccessSubscriptionByWorkspaceIdErrorDto,
  ResumeCancelledAccessSubscriptionInputDto,
  ResumeCancelledAccessSubscriptionOutputDto,
  ResumeCancelledAccessSubscriptionErrorDto,
  ResumeCancelledAccessSubscriptionInputDtoSchema,
  CreatePaymentMethodManagementSessionInputDto,
  CreatePaymentMethodManagementSessionOutputDto,
  CreatePaymentMethodManagementSessionErrorDto,
  CreatePaymentMethodManagementSessionInputDtoSchema,
  ChangeAccessSubscriptionPlanInputDto,
  ChangeAccessSubscriptionPlanOutputDto,
  ChangeAccessSubscriptionPlanErrorDto,
  ChangeAccessSubscriptionPlanInputDtoSchema,
  CreateWorkspaceEmailInviteInputDto,
  CreateWorkspaceEmailInviteErrorDto,
  CreateWorkspaceEmailInviteOutputDto,
  CreateWorkspaceEmailInviteInputDtoSchema,
  SendWorkspaceEmailInviteInputDto,
  SendWorkspaceEmailInviteOutputDto,
  SendWorkspaceEmailInviteErrorDto,
  SendWorkspaceEmailInviteInputDtoSchema,
  ExpireWorkspaceEmailInviteInputDto,
  ExpireWorkspaceEmailInviteOutputDto,
  ExpireWorkspaceEmailInviteErrorDto,
  ExpireWorkspaceEmailInviteInputDtoSchema,
  FindEffectiveWorkspaceEmailInviteByIdInputDto,
  FindEffectiveWorkspaceEmailInviteByIdOutputDto,
  FindEffectiveWorkspaceEmailInviteByIdErrorDto,
  FindEffectiveWorkspaceEmailInviteByIdInputDtoSchema,
  CursorPaginateWorkspaceEmailInvitesInputDto,
  CursorPaginateWorkspaceEmailInvitesOutputDto,
  CursorPaginateWorkspaceEmailInvitesErrorDto,
  CursorPaginateWorkspaceEmailInvitesInputDtoSchema,
  VerifyWorkspaceEmailInviteInputDto,
  VerifyWorkspaceEmailInviteOutputDto,
  VerifyWorkspaceEmailInviteErrorDto,
  VerifyWorkspaceEmailInviteInputDtoSchema,
  AcceptWorkspaceEmailInviteInputDto,
  AcceptWorkspaceEmailInviteOutputDto,
  AcceptWorkspaceEmailInviteErrorDto,
  AcceptWorkspaceEmailInviteInputDtoSchema,
  AddUserToWorkspaceInputDto,
  AddUserToWorkspaceOutputDto,
  AddUserToWorkspaceErrorDto,
  AddUserToWorkspaceInputDtoSchema,
  CursorPaginateWorkspaceEmailInvitesByWorkspaceIdInputDto,
  FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDto,
  FindEffectiveWorkspaceEmailInviteByCodeAndUserIdOutputDto,
  FindEffectiveWorkspaceEmailInviteByCodeAndUserIdErrorDto,
  FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDtoSchema,
  DeclineWorkspaceEmailInviteInputDto,
  DeclineWorkspaceEmailInviteOutputDto,
  DeclineWorkspaceEmailInviteErrorDto,
  CursorPaginateWorkspaceMembershipsInputDto,
  CursorPaginateWorkspaceMembershipsOutputDto,
  CursorPaginateWorkspaceMembershipsErrorDto,
  CursorPaginateWorkspaceMembershipsInputDtoSchema,
  CursorPaginateWorkspaceMembershipsByWorkspaceIdInputDto,
  RemoveWorkspaceMembershipInputDto,
  RemoveWorkspaceMembershipOutputDto,
  RemoveWorkspaceMembershipErrorDto,
  RemoveWorkspaceMembershipInputDtoSchema,
  FindWorkspaceMembershipByIdInputDto,
  FindWorkspaceMembershipByIdOutputDto,
  FindWorkspaceMembershipByIdErrorDto,
  FindWorkspaceMembershipByIdInputDtoSchema,
  FindWorkspaceOwnerOutputDto,
  FindWorkspaceOwnerInputDto,
  FindWorkspaceOwnerErrorDto,
  FindWorkspaceOwnerInputDtoSchema,
  FindAllWorkspaceOwnersByWorkspaceIdsInputDto,
  FindAllWorkspaceOwnersByWorkspaceIdsOutputDto,
  FindAllWorkspaceOwnersByWorkspaceIdsErrorDto,
  FindAllWorkspaceOwnersByWorkspaceIdsInputDtoSchema,
  UpdateWorkspaceMemberRoleInputDto,
  UpdateWorkspaceMemberRoleOutputDto,
  UpdateWorkspaceMemberRoleErrorDto,
  UpdateWorkspaceMemberRoleInputDtoSchema,
  CursorPaginateWorkspaceInvoicesInputDto,
  CursorPaginateWorkspaceInvoicesOutputDto,
  CursorPaginateWorkspaceInvoicesErrorDto,
  CursorPaginateWorkspaceInvoicesInputDtoSchema,
} from './helper/workspace.business.dto';
import * as workspaceDataService from '../data/workspace.data.service';
import {
  ANY_RESOURCE_ID,
  authorizationBusinessService,
  PERMISSION,
  AUTHORIZATION_RESOURCE_TYPE,
  ROLE,
  AUTHORIZATION_STAKEHOLDER_TYPE,
} from '@service/authorization';
import {
  generateWorkspaceInviteCode,
  hashWorkspaceInviteCode,
  mapWorkspaceAccessSubscription,
  mapWorkspaceMembership,
} from './helper/workspace.business.util';
import {
  WorkspaceAccessSubscription,
  WorkspaceMembership,
  WorkspaceOwner,
} from './helper/workspace.business.model';
import { WorkspaceEntity } from '../data/helper/workspace.data.model';
import {
  BILLING_PROVIDER_STAKEHOLDER_TYPE,
  billingBusinessService,
  CustomerConnectionEntity,
  SUBSCRIPTION_PLAN_TYPE,
  SubscriptionConnectionEntity,
} from '@service/billing';
import {
  DEFAULT_ACCESS_SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  DEFAULT_WORKSPACE_BILLING_PROVIDER,
  DEFAULT_WORKSPACE_CHECKOUT_SESSION_RESULT_PATH,
  DEFAULT_WORKSPACE_PAYMENT_METHOD_MANAGEMENT_SESSION_RETURN_PATH,
  WORKSPACE_EMAIL_INVITE_CODE_EXPIRATION_TIME_MILLISECONDS,
} from './helper/workspace.business.constant';
import { SubscriptionItemConnectionPlanDto } from '@service/billing/business/helper/billing.business.dto';
import { generateAppUrl } from '@lib/util/url.util';
import { isDevelopmentEnvironment } from '@env';
import { userBusinessService } from '@service/user';

const LOG_PREFIX = 'Service :: Workspace :: WorkspaceBusinessService';

/**
 * @package
 *
 * Assigns a user as the owner of a workspace.
 *
 * @returns The workspace ID and user ID of the assigned owner.
 */
export const _assignWorkspaceOwner = async (
  executionContext: ExecutionContext,
  input: AssignWorkspaceOwnerInputDto
): Promise<
  BusinessResult<AssignWorkspaceOwnerOutputDto, AssignWorkspaceOwnerErrorDto>
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = AssignWorkspaceOwnerInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const userId = parsedInputData.userId;

    // Step 2: Assign the owner of the workspace
    const assignOwnerResult =
      await authorizationBusinessService.assignUniqueStakeholderRoleToResource(
        executionContext,
        {
          resourceId: workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          stakeholderId: userId,
          stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.USER,
          role: ROLE.WORKSPACE_OWNER,
        }
      );

    if (!assignOwnerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _assignWorkspaceOwner :: Failed to assign owner`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign owner to the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const owner: WorkspaceOwner = {
      id: userId,
      workspaceId: workspaceId,
    };

    return BusinessResult.ok({
      owner: owner,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _assignWorkspaceOwner :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds the owner of a workspace by its ID.
 *
 * @returns The workspace ID and user ID of the assigned owner, or null if not found.
 */
export const _findWorkspaceOwner = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceOwnerInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceOwnerOutputDto>,
    FindWorkspaceOwnerErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindWorkspaceOwnerInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find the owner of the workspace
    const workspaceOwnerResult =
      await authorizationBusinessService.findAllStakeholdersByResourceRoleAndStakeholderType(
        executionContext,
        {
          role: ROLE.WORKSPACE_OWNER,
          resourceId: workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.USER,
        }
      );

    if (!workspaceOwnerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceOwner :: Failed to find workspace owner`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace owner not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceOwnerResultData = workspaceOwnerResult.data;
    const stakeholders = workspaceOwnerResultData.stakeholders;

    // If there are multiple owners, return an error
    if (stakeholders.length > 1) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceOwner :: Multiple workspace owners found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Multiple workspace owners found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!stakeholders.length) {
      return BusinessResult.ok(null);
    }

    const targetStakeholder = stakeholders[0];

    const owner: WorkspaceOwner = {
      id: targetStakeholder.stakeholderId,
      workspaceId: workspaceId,
    };

    return BusinessResult.ok({
      owner: owner,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceOwner :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds all owners of a list of workspaces by their IDs.
 *
 * @returns A map of workspace IDs to their assigned owner user IDs, or an empty map if not found.
 */
export const _findAllWorkspaceOwnersByWorkspaceIds = async (
  executionContext: ExecutionContext,
  input: FindAllWorkspaceOwnersByWorkspaceIdsInputDto
): Promise<
  BusinessResult<
    FindAllWorkspaceOwnersByWorkspaceIdsOutputDto,
    FindAllWorkspaceOwnersByWorkspaceIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllWorkspaceOwnersByWorkspaceIdsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceIds = parsedInputData.workspaceIds;

    // Step 2: Find all workspace owners by workspace IDs
    const workspaceOwnersResult =
      await authorizationBusinessService.findAllResourceStakeholdersByResourceRolesAndStakeholderType(
        executionContext,
        {
          resources: workspaceIds.map((workspaceId) => ({
            resourceId: workspaceId,
            resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          })),
          role: ROLE.WORKSPACE_OWNER,
          stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.USER,
        }
      );

    if (!workspaceOwnersResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllWorkspaceOwnersByWorkspaceIds :: Failed to find workspace owners`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace owners not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceOwnersResultData = workspaceOwnersResult.data;
    const resourceStakeholders = workspaceOwnersResultData.resourceStakeholders;

    // If there are multiple owners for a workspace, return an error
    const owners: WorkspaceOwner[] = [];
    const ownerMap = new Map<string, WorkspaceOwner>();

    for (const stakeholder of resourceStakeholders) {
      const workspaceId = stakeholder.resourceId;
      const userId = stakeholder.stakeholderId;

      if (ownerMap.has(workspaceId)) {
        logger.error(
          `${LOG_PREFIX} :: _findAllWorkspaceOwnersByWorkspaceIds :: Multiple workspace owners found for workspace ${workspaceId}`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
          detail: `Multiple workspace owners found for workspace ${workspaceId}`,
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }

      const owner: WorkspaceOwner = {
        id: userId,
        workspaceId: workspaceId,
      };

      owners.push(owner);
      ownerMap.set(workspaceId, owner);
    }

    return BusinessResult.ok({
      owners: owners,
      ownerMap: ownerMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllWorkspaceOwnersByWorkspaceIds :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Assigns a role to a workspace member.
 *
 * @returns The workspace ID, workspace member ID, and the assigned role.
 */
export const _assignWorkspaceMemberRole = async (
  executionContext: ExecutionContext,
  input: AssignWorkspaceMemberRoleInputDto
): Promise<
  BusinessResult<
    AssignWorkspaceMemberRoleOutputDto,
    AssignWorkspaceMemberRoleErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AssignWorkspaceMemberRoleInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const workspaceMemberId = parsedInputData.workspaceMemberId;
    const role = parsedInputData.role;

    // Step 2: Assign the workspace member role
    const assignMemberRoleResult =
      await authorizationBusinessService.assignUniqueStakeholderRoleToResource(
        executionContext,
        {
          resourceId: workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          stakeholderId: workspaceMemberId,
          stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.WORKSPACE_MEMBER,
          role: role,
        }
      );

    if (!assignMemberRoleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _assignWorkspaceMemberRole :: Failed to assign member role`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign member role to the workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      workspaceId: workspaceId,
      workspaceMemberId: workspaceMemberId,
      role: role,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _assignWorkspaceMemberRole :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Assigns a user's default workspace.
 *
 * @return The default workspace entity.
 */
export const _assignDefaultWorkspace = async (
  executionContext: ExecutionContext,
  input: AssignDefaultWorkspaceInputDto
): Promise<
  BusinessResult<
    AssignDefaultWorkspaceOutputDto,
    AssignDefaultWorkspaceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = AssignDefaultWorkspaceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Ensure the user is a member of the workspace
    const workspaceMembershipResult =
      await _findWorkspaceMembershipByWorkspaceIdAndUserId(executionContext, {
        userId: userId,
        workspaceId: workspaceId,
      });

    if (!workspaceMembershipResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _assignDefaultWorkspace :: Failed to find workspace membership`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace membership',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMembership = workspaceMembershipResult.data;

    if (!workspaceMembership) {
      logger.error(
        `${LOG_PREFIX} :: _assignDefaultWorkspace :: No workspace membership found for user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No workspace membership found for user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Assign the user's default workspace
    const workspaceEntity =
      await workspaceDataService.upsertUserDefaultWorkspace(
        userId,
        workspaceId
      );

    return BusinessResult.ok({
      workspace: workspaceEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _assignDefaultWorkspace :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Removes a user's default workspace.
 *
 * @return The default workspace entity.
 */
export const _removeDefaultWorkspace = async (
  executionContext: ExecutionContext,
  input: RemoveDefaultWorkspaceInputDto
): Promise<
  BusinessResult<
    RemoveDefaultWorkspaceOutputDto,
    RemoveDefaultWorkspaceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = RemoveDefaultWorkspaceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;

    // Step 2: Ensure the user has a default workspace
    const existingDefaultWorkspaceEntity =
      await workspaceDataService.findUserDefaultWorkspace(userId);

    if (!existingDefaultWorkspaceEntity) {
      logger.error(
        `${LOG_PREFIX} :: _removeDefaultWorkspace :: No default workspace found for user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No default workspace found for user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Remove the user's default workspace
    await workspaceDataService.removeUserDefaultWorkspace(userId);

    return BusinessResult.ok({
      workspace: existingDefaultWorkspaceEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _removeDefaultWorkspace :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Updates a workspace's details.
 *
 * @returns The updated workspace entity.
 */
export const _updateWorkspaceDetails = async (
  executionContext: ExecutionContext,
  input: UpdateWorkspaceDetailsInputDto
): Promise<BusinessResult<WorkspaceEntity, UpdateWorkspaceDetailsErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = UpdateWorkspaceDetailsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const workspaceName = parsedInputData.workspaceName;
    const workspaceUrl = parsedInputData.workspaceUrl;

    // Step 2: Validate that the workspace exists
    const workspaceResult = await _findWorkspaceById(executionContext, {
      id: workspaceId,
    });

    if (!workspaceResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve workspace by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingWorkspaceEntity = workspaceResult.data;

    if (!existingWorkspaceEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Update the workspace
    const updatedWorkspaceEntity = await workspaceDataService.updateWorkspace(
      workspaceId,
      workspaceName,
      workspaceUrl
    );

    return BusinessResult.ok(updatedWorkspaceEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateWorkspaceDetails :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace's billing provider connection.
 *
 * @returns The billing provider connection, or null if not found.
 */
export const _findWorkspaceBillingProviderConnection = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceBillingProviderConnectionInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceBillingProviderConnectionOutputDto>,
    FindWorkspaceBillingProviderConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceBillingProviderConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find the workspace billing provider connection
    const billingProviderConnectionResult =
      await billingBusinessService._findCustomerConnectionByStakeholder(
        executionContext,
        {
          stakeholderId: workspaceId,
          stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE.WORKSPACE,
        }
      );

    if (!billingProviderConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceBillingProviderConnection :: Failed to find billing provider connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnection = billingProviderConnectionResult.data;

    if (!billingProviderConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: billingProviderConnection.connection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceBillingProviderConnection :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds all workspace billing provider connections by workspace IDs.
 *
 * @returns The billing provider connections.
 */
export const _findAllWorkspaceBillingProviderConnectionsByWorkspaceIds = async (
  executionContext: ExecutionContext,
  input: FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDto
): Promise<
  BusinessResult<
    FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsOutputDto,
    FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllWorkspaceBillingProviderConnectionsByWorkspaceIdsInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceIds = parsedInputData.workspaceIds;

    // Step 2: Find all workspace billing provider connections
    const billingProviderConnectionsResult =
      await billingBusinessService._findAllCustomerConnectionsByStakeholders(
        executionContext,
        {
          stakeholders: workspaceIds.map((workspaceId) => ({
            stakeholderId: workspaceId,
            stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE.WORKSPACE,
          })),
        }
      );

    if (!billingProviderConnectionsResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllWorkspaceBillingProviderConnectionsByWorkspaceIds :: Failed to find billing provider connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnectionsResultData =
      billingProviderConnectionsResult.data;
    const connections = billingProviderConnectionsResultData.connections;

    const connectionMap = new Map<string, CustomerConnectionEntity>();

    for (const connection of connections) {
      connectionMap.set(connection.stakeholderId, connection);
    }

    return BusinessResult.ok({
      connections: connections,
      connectionMap: connectionMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllWorkspaceBillingProviderConnectionsByWorkspaceIds :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace's billing provider.
 *
 * @returns The billing provider connection and provider information, or null if not found.
 */
export const _findWorkspaceBillingProvider = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceBillingProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceBillingProviderOutputDto>,
    FindWorkspaceBillingProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceBillingProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find the workspace billing provider
    const billingProviderResult =
      await billingBusinessService._findCustomerByStakeholder(
        executionContext,
        {
          stakeholderId: workspaceId,
          stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE.WORKSPACE,
        }
      );

    if (!billingProviderResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceBillingProvider :: Failed to find billing provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProvider = billingProviderResult.data;

    if (!billingProvider) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: billingProvider.connection,
      provider: billingProvider.provider,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceBillingProvider :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Creates a workspace billing provider.
 *
 * @returns The billing provider connection and provider information if successful,
 */
export const _createWorkspaceBillingProvider = async (
  executionContext: ExecutionContext,
  input: CreateWorkspaceBillingProviderInputDto
): Promise<
  BusinessResult<
    CreateWorkspaceBillingProviderOutputDto,
    CreateWorkspaceBillingProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateWorkspaceBillingProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const email = parsedInputData.email;
    const workspaceId = parsedInputData.workspaceId;
    const provider = parsedInputData.provider;

    // Step 2: Create the workspace billing provider
    const createResult = await billingBusinessService._createCustomer(
      executionContext,
      {
        email: email,
        stakeholderId: workspaceId,
        stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE.WORKSPACE,
        provider: provider,
      }
    );

    if (!createResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create workspace billing provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProvider = createResult.data;

    return BusinessResult.ok({
      connection: billingProvider.connection,
      provider: billingProvider.provider,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createWorkspaceBillingProvider :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace checkout session by its ID.
 *
 * @returns The checkout session information, or null if not found.
 */
export const _findWorkspaceCheckoutSessionById = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceCheckoutSessionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceCheckoutSessionByIdOutputDto>,
    FindWorkspaceCheckoutSessionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceCheckoutSessionByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const sessionId = parsedInputData.sessionId;

    // Step 2: Find the billing provider connection for the workspace
    // We can reduce latency by finding the connection rather than the full provider
    const billingProviderConnectionResult =
      await _findWorkspaceBillingProviderConnection(executionContext, {
        workspaceId: workspaceId,
      });

    if (!billingProviderConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceSubscriptionCheckoutSessionById :: Failed to find billing provider connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!billingProviderConnectionResult.data) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceSubscriptionCheckoutSessionById :: No billing provider connection found for workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No billing provider connection found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnectionData = billingProviderConnectionResult.data;
    const provider = billingProviderConnectionData.connection.provider;
    const customerId = billingProviderConnectionData.connection.providerId;

    // Step 3: Find the checkout session by ID
    const checkoutSessionResult =
      await billingBusinessService._findProviderCheckoutSessionById(
        executionContext,
        {
          sessionId: sessionId,
          provider: provider,
        }
      );

    if (!checkoutSessionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceSubscriptionCheckoutSessionById :: Failed to find checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace subscription checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const checkoutSessionData = checkoutSessionResult.data;

    if (!checkoutSessionData) {
      return BusinessResult.ok(null);
    }

    const sessionCustomerId = checkoutSessionData.session.customerId;

    // Step 4: If the session is found, check if the session belongs to the workspace
    if (sessionCustomerId !== customerId) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceSubscriptionCheckoutSessionById :: Checkout session does not belong to workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Checkout session does not belong to the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok(checkoutSessionResult.data);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceSubscriptionCheckoutSessionById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace member's role by a workspace ID and the member ID.
 *
 * @returns The role of the workspace member, or null if not found.
 */
export const _findWorkspaceMemberRoleByWorkspaceIdAndMemberId = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDto
): Promise<
  BusinessResult<
    Nullable<ROLE>,
    FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceMemberRoleByWorkspaceIdAndMemberIdInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const workspaceMemberId = parsedInputData.workspaceMemberId;

    // Step 2: Find the role for the workspace member
    const roleResult =
      await authorizationBusinessService.findAllStakeholderRolesByStakeholderAndResource(
        executionContext,
        {
          resourceId: workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          stakeholderId: workspaceMemberId,
          stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.WORKSPACE_MEMBER,
        }
      );

    if (!roleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceMemberRoleByWorkspaceIdAndMemberId :: Failed to find roles for workspace member`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find roles for the workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Ensure that there is exactly one role for the member
    if (roleResult.data.stakeholderRole.roles.length > 1) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceMemberRoleByWorkspaceIdAndMemberId :: Multiple roles found for workspace member`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Multiple roles found for the workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const targetRole = roleResult.data.stakeholderRole.roles[0] ?? null;

    return BusinessResult.ok(targetRole);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceMemberRoleByWorkspaceIdAndMemberId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds all workspace member roles by workspace IDs and member IDs.
 *
 * @returns A mapping of workspace member roles, where each entry contains
 * the workspace, the workspace member, and the role of the member in that workspace.
 */
export const _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds = async (
  executionContext: ExecutionContext,
  input: FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDto
): Promise<
  BusinessResult<
    FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdOutputDto,
    FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceMembers = parsedInputData.workspaceMembers;

    // Step 2: Find all roles for the workspace members in the specified workspaces
    const rolesResult =
      await authorizationBusinessService.findAllStakeholderRolesByResourceStakeholders(
        executionContext,
        {
          resourceStakeholders: workspaceMembers.map((workspaceMember) => {
            return {
              resourceId: workspaceMember.workspaceId,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
              stakeholderId: workspaceMember.workspaceMemberId,
              stakeholderType: AUTHORIZATION_STAKEHOLDER_TYPE.WORKSPACE_MEMBER,
            };
          }),
        }
      );

    if (!rolesResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds :: Failed to find roles for workspace members`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find roles for workspace members',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const roleResultData = rolesResult.data;

    // Step 3: Map composite member + workspace Id to their roles
    const workspaceMemberRolesMap = roleResultData.reduce(
      (accumulator, currentValue) => {
        // Create a composite key using the resourceId (workspaceId) and stakeholderId (workspaceMemberId)
        const compositeKey = `${currentValue.resourceId}:${currentValue.stakeholderId}`;

        if (!accumulator[compositeKey]) {
          accumulator[compositeKey] = [];
        }

        accumulator[compositeKey].push(currentValue.role);

        return accumulator;
      },
      {} as Record<string, ROLE[]>
    );

    // Step 4: Map the roles to the output DTO
    const workspaceMemberRoles: FindAllWorkspaceMemberRolesByWorkspaceIdAndMemberIdOutputDto['roles'] =
      [];
    const workspaceMemberRoleMap: Map<string, ROLE> = new Map();

    for (const workspaceMember of workspaceMembers) {
      const compositeKey = `${workspaceMember.workspaceId}:${workspaceMember.workspaceMemberId}`;
      const roles = workspaceMemberRolesMap[compositeKey] ?? [];
      const targetRole = roles[0] ?? null;

      // If no role is found, then return a failure result
      if (!targetRole) {
        logger.error(
          `${LOG_PREFIX} :: _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds :: No role found for workspace member`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
          detail: 'No role found for the workspace member',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }

      // If multiple roles are found, return a failure result
      if (roles.length > 1) {
        logger.error(
          `${LOG_PREFIX} :: _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds :: Multiple roles found for workspace member`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
          detail: 'Multiple roles found for the workspace member',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }

      workspaceMemberRoleMap.set(workspaceMember.workspaceMemberId, targetRole);
      workspaceMemberRoles.push({
        workspaceId: workspaceMember.workspaceId,
        workspaceMemberId: workspaceMember.workspaceMemberId,
        role: targetRole,
      });
    }

    return BusinessResult.ok({
      roles: workspaceMemberRoles,
      roleMap: workspaceMemberRoleMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace membership by workspace ID and user ID.
 *
 * @returns The workspace membership if found, or null if not found.
 */
export const _findWorkspaceMembershipByWorkspaceIdAndUserId = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDto
): Promise<
  BusinessResult<
    Nullable<WorkspaceMembership>,
    FindWorkspaceMembershipByWorkspaceIdAndUserIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceMembershipByWorkspaceIdAndUserIdInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find workspace member by user ID and workspace ID
    const workspaceMemberAggregate =
      await workspaceDataService.findWorkspaceMemberByWorkspaceIdAndUserId(
        workspaceId,
        userId
      );

    if (!workspaceMemberAggregate) {
      return BusinessResult.ok(null);
    }

    const userEntity = workspaceMemberAggregate.user;
    const workspaceMemberEntity = workspaceMemberAggregate.workspaceMember;

    // Step 3: Find the role for the workspace member
    const memberRoleResult =
      await _findWorkspaceMemberRoleByWorkspaceIdAndMemberId(executionContext, {
        workspaceId: workspaceId,
        workspaceMemberId: workspaceMemberEntity.id,
      });

    if (!memberRoleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceMembershipByWorkspaceIdAndUserId :: Failed to find member role`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find member role',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const targetRole = memberRoleResult.data;

    if (!targetRole) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceMembershipByWorkspaceIdAndUserId :: No role found for workspace member`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No role found for the workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok(
      mapWorkspaceMembership({
        user: userEntity,
        member: workspaceMemberEntity,
        role: targetRole,
      }) as WorkspaceMembership
    );
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceMembershipByWorkspaceIdAndUserId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace and workspace membership by a user's default workspace.
 *
 * @return The user's default workspace and their membership in that workspace,
 * or null if no default workspace is found.
 */
export const _findWorkspaceAndMembershipByUserDefault = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceAndMembershipByUserDefaultInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceAndMembershipByUserDefaultOutputDto>,
    FindWorkspaceAndMembershipByUserDefaultErrorDto
  >
> => {
  const loggingPrefix = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceAndMembershipByUserDefaultInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;

    // Step 2: Find the user's default workspace
    const workspaceEntity =
      await workspaceDataService.findUserDefaultWorkspace(userId);

    if (!workspaceEntity) {
      return BusinessResult.ok(null);
    }

    // Step 3: Find workspace member by user ID and workspace ID
    const workspaceMembershipResult =
      await _findWorkspaceMembershipByWorkspaceIdAndUserId(executionContext, {
        userId: userId,
        workspaceId: workspaceEntity.id,
      });

    if (!workspaceMembershipResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceAndMembershipByUserDefault :: Failed to find workspace membership`,
        {
          input: input,
          context: loggingPrefix,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace membership',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMembership = workspaceMembershipResult.data;

    if (!workspaceMembership) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceAndMembershipByUserDefault :: No workspace membership found for user with a default workspace`,
        {
          input: input,
          context: loggingPrefix,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail:
          'No workspace membership found for user with a default workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      workspace: workspaceEntity,
      workspaceMembership: workspaceMembership,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceAndMembershipByUserDefault :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingPrefix,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds all workspaces and membership to those workspaces by a user ID.
 *
 * @returns A list of workspaces, the user's membership in each workspace,
 * and a flag indicating if the workspace is the user's default workspace.
 */
export const _findAllWorkspacesAndMembershipsByUserId = async (
  executionContext: ExecutionContext,
  input: FindAllWorkspacesAndMembershipsByUserIdInputDto
): Promise<
  BusinessResult<
    FindAllWorkspacesAndMembershipsByUserIdOutputDto,
    FindAllWorkspacesAndMembershipsByUserIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllWorkspacesAndMembershipsByUserIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;

    // Step 2: Find all workspaces and member by user ID
    // and find the default workspace for the user
    const [defaultWorkspace, workspacesWithMember] = await Promise.all([
      workspaceDataService.findUserDefaultWorkspace(userId),
      workspaceDataService.findAllWorkspacesAndMemberByUserId(userId),
    ]);

    // Step 3: For each workspace member, find the role
    const workspaceMemberRolesResults =
      await _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds(
        executionContext,
        {
          workspaceMembers: workspacesWithMember.map((workspaceWithMember) => {
            return {
              workspaceId: workspaceWithMember.workspace.id,
              workspaceMemberId: workspaceWithMember.workspaceMember.id,
            };
          }),
        }
      );

    if (!workspaceMemberRolesResults.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllWorkspacesAndMembershipsByUserId :: Failed to find workspace member roles`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace member roles',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMemberRoles = workspaceMemberRolesResults.data.roles;

    const workspaceMemberRolesMap = new Map(
      workspaceMemberRoles.map((workspaceMember) => {
        const compositeKey = `${workspaceMember.workspaceId}:${workspaceMember.workspaceMemberId}`;
        return [compositeKey, workspaceMember.role];
      })
    );

    // Step 4: Map the workspaces with their memberships
    const workspacesWithMemberships = workspacesWithMember.map(
      (workspaceWithMember) => {
        const user = workspaceWithMember.user;
        const workspace = workspaceWithMember.workspace;
        const workspaceMember = workspaceWithMember.workspaceMember;

        const workspaceId = workspace.id;
        const workspaceMemberId = workspaceMember.id;

        const compositeKey = `${workspaceId}:${workspaceMemberId}`;
        const role = workspaceMemberRolesMap.get(compositeKey)!;

        const isDefaultWorkspace = defaultWorkspace?.id === workspaceId;

        return {
          isDefault: isDefaultWorkspace,
          workspace: workspace,
          workspaceMembership: mapWorkspaceMembership({
            user: user,
            member: workspaceMember,
            role: role,
          }) as WorkspaceMembership,
        };
      }
    );

    return BusinessResult.ok({
      workspaces: workspacesWithMemberships,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllWorkspacesAndMembershipsByUserId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds a workspace membership by ID.
 *
 * @returns The workspace membership if found, or null if not found.
 */
export const _findWorkspaceMembershipById = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceMembershipByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceMembershipByIdOutputDto>,
    FindWorkspaceMembershipByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindWorkspaceMembershipByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceMemberId = parsedInputData.workspaceMemberId;

    // Step 2: Find the workspace membership
    const workspaceMemberAggregate =
      await workspaceDataService.findWorkspaceMemberById(workspaceMemberId);

    if (!workspaceMemberAggregate) {
      return BusinessResult.ok(null);
    }

    const userEntity = workspaceMemberAggregate.user;
    const workspaceMemberEntity = workspaceMemberAggregate.workspaceMember;
    const workspaceId = workspaceMemberEntity.workspaceId;

    // Step 3: Find the role for the workspace member
    const memberRoleResult =
      await _findWorkspaceMemberRoleByWorkspaceIdAndMemberId(executionContext, {
        workspaceId: workspaceId,
        workspaceMemberId: workspaceMemberId,
      });

    if (!memberRoleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceMembershipById :: Failed to find member role`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find member role',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const targetRole = memberRoleResult.data;

    if (!targetRole) {
      logger.error(
        `${LOG_PREFIX} :: _findWorkspaceMembershipById :: No role found for workspace member`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No role found for the workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMembership = mapWorkspaceMembership({
      user: userEntity,
      member: workspaceMemberEntity,
      role: targetRole,
    }) as WorkspaceMembership;

    return BusinessResult.ok({
      workspaceMembership: workspaceMembership,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceMembershipById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Cursor paginates workspace memberships.
 *
 * @returns The paginated workspace memberships.
 */
export const _cursorPaginateWorkspaceMemberships = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceMembershipsInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceMembershipsOutputDto,
    CursorPaginateWorkspaceMembershipsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CursorPaginateWorkspaceMembershipsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const pagination = parsedInputData.pagination;
    const sort = parsedInputData.sort;
    const filter = parsedInputData.filter;

    // Step 2: Find workspace membership aggregates
    const workspaceMemberPagination =
      await workspaceDataService.cursorPaginateWorkspaceMembers(
        pagination,
        sort,
        {
          workspaceId: filter?.workspaceId,
        }
      );

    // Step 3: Find the role for each member
    const workspaceMemberRoleResult =
      await _findAllWorkspaceMemberRolesByWorkspaceIdsAndMemberIds(
        executionContext,
        {
          workspaceMembers: workspaceMemberPagination.nodes.map(
            (aggregate) => ({
              workspaceId: aggregate.workspaceMember.workspaceId,
              workspaceMemberId: aggregate.workspaceMember.id,
            })
          ),
        }
      );

    if (!workspaceMemberRoleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cursorPaginateWorkspaceMemberships :: Failed to find workspace member roles`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace member roles',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMemberRoleResultData = workspaceMemberRoleResult.data;
    const workspaceMemberRoleMap = workspaceMemberRoleResultData.roleMap;

    // Step 4: Map the roles to each member
    const workspaceMemberships: WorkspaceMembership[] = [];

    for (const aggregate of workspaceMemberPagination.nodes) {
      const user = aggregate.user;
      const workspaceMember = aggregate.workspaceMember;
      const workspaceMemberId = workspaceMember.id;
      const workspaceMemberRole =
        workspaceMemberRoleMap.get(workspaceMemberId)!;

      // If a role is not found, the membership is corrupt and requires intervention
      if (!workspaceMemberRole) {
        logger.error(
          `${LOG_PREFIX} :: _cursorPaginateWorkspaceMemberships :: Workspace member does not have a role`,
          {
            input: input,
            context: loggingContext,
            workspaceMemberId: workspaceMemberId,
          }
        );
      }

      const workspaceMembership = mapWorkspaceMembership({
        user: user,
        member: workspaceMember,
        role: workspaceMemberRole,
      }) as WorkspaceMembership;

      workspaceMemberships.push(workspaceMembership);
    }

    return BusinessResult.ok({
      nodes: workspaceMemberships,
      totalCount: workspaceMemberPagination.totalCount,
      hasNextPage: workspaceMemberPagination.hasNextPage,
      hasPreviousPage: workspaceMemberPagination.hasPreviousPage,
      startCursor: workspaceMemberPagination.startCursor,
      endCursor: workspaceMemberPagination.endCursor,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cursorPaginateWorkspaceMemberships :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Cursor paginates workspace memberships by workspace ID.
 *
 * @returns The paginated workspace memberships.
 */
export const _cursorPaginateWorkspaceMembershipsByWorkspaceId = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceMembershipsByWorkspaceIdInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceMembershipsOutputDto,
    CursorPaginateWorkspaceMembershipsErrorDto
  >
> => {
  return _cursorPaginateWorkspaceMemberships(executionContext, {
    sort: input.sort,
    pagination: input.pagination,
    filter: {
      ...input.filter,
      workspaceId: input.workspaceId,
    },
  });
};

/**
 * @package
 *
 * Adds a user to a workspace.
 *
 * @returns The workspace membership if the user was successfully added,
 */
export const _addUserToWorkspace = async (
  executionContext: ExecutionContext,
  input: AddUserToWorkspaceInputDto
): Promise<
  BusinessResult<AddUserToWorkspaceOutputDto, AddUserToWorkspaceErrorDto>
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = AddUserToWorkspaceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const userId = parsedInputData.userId;
    const workspaceId = parsedInputData.workspaceId;
    const role = parsedInputData.role;
    const assignDefaultWorkspace =
      parsedInputData.assignDefaultWorkspace ?? false;

    // Step 2: Check if the user already has a membership in the workspace
    const existingMembershipResult =
      await _findWorkspaceMembershipByWorkspaceIdAndUserId(executionContext, {
        userId: userId,
        workspaceId: workspaceId,
      });

    if (!existingMembershipResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _addUserToWorkspace :: Failed to find existing workspace membership`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing workspace membership',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingWorkspaceMembership = existingMembershipResult.data;

    if (existingWorkspaceMembership) {
      logger.warn(
        `${LOG_PREFIX} :: _addUserToWorkspace :: User already has a membership in the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'User already has a membership in the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find the user
    const userResult = await userBusinessService._findUserById(
      executionContext,
      {
        id: userId,
      }
    );

    if (!userResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _addUserToWorkspace :: Failed to find user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    if (!userEntity) {
      logger.warn(`${LOG_PREFIX} :: _addUserToWorkspace :: User not found`, {
        input: input,
        context: loggingContext,
      });
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'User not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Create the workspace member
    const workspaceMemberEntity =
      await workspaceDataService.createWorkspaceMember(workspaceId, userId);
    const workspaceMemberId = workspaceMemberEntity.id;

    // Step 5: Assign the role to the workspace member
    const assignRoleResult = await _assignWorkspaceMemberRole(
      executionContext,
      {
        workspaceMemberId: workspaceMemberId,
        workspaceId: workspaceId,
        role: role,
      }
    );

    if (!assignRoleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _addUserToWorkspace :: Failed to assign role to workspace member`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign role to workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const assignRoleData = assignRoleResult.data;
    const assignedRole = assignRoleData.role;

    // Step 6: Assign the default workspace if requested
    if (assignDefaultWorkspace) {
      const assignDefaultWorkspaceResult = await _assignDefaultWorkspace(
        executionContext,
        {
          userId: userId,
          workspaceId: workspaceId,
        }
      );

      if (!assignDefaultWorkspaceResult.isSuccess()) {
        logger.error(
          `${LOG_PREFIX} :: _addUserToWorkspace :: Failed to assign default workspace`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
          detail: 'Failed to assign default workspace',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }
    }

    const workspaceMembership = mapWorkspaceMembership({
      user: userEntity,
      member: workspaceMemberEntity,
      role: assignedRole,
    }) as WorkspaceMembership;

    return BusinessResult.ok({
      isDefault: assignDefaultWorkspace,
      workspaceMembership: workspaceMembership,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _addUserToWorkspace :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Removes a member from a workspace.
 *
 * @returns The workspace membership if the user was successfully removed,
 */
export const _removeWorkspaceMembership = async (
  executionContext: ExecutionContext,
  input: RemoveWorkspaceMembershipInputDto
): Promise<
  BusinessResult<
    RemoveWorkspaceMembershipOutputDto,
    RemoveWorkspaceMembershipErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      RemoveWorkspaceMembershipInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const workspaceMemberId = parsedInputData.workspaceMemberId;

    // Step 2: Find workspace member by ID
    const workspaceMemberResult = await _findWorkspaceMembershipById(
      executionContext,
      {
        workspaceMemberId: workspaceMemberId,
      }
    );

    if (!workspaceMemberResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _removeWorkspaceMember :: Failed to find workspace member`,
        {
          input: input,
          context: executionContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMemberResultData = workspaceMemberResult.data;

    if (!workspaceMemberResultData) {
      logger.error(
        `${LOG_PREFIX} :: _removeWorkspaceMember :: Workspace member not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace member not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMembership = workspaceMemberResultData.workspaceMembership;
    const workspaceMemberWorkspaceId = workspaceMembership.workspaceId;
    const workspaceMemberUserId = workspaceMembership.userId;

    // Check if the member belongs to the input workspace
    if (workspaceMemberWorkspaceId !== workspaceId) {
      logger.warn(
        `${LOG_PREFIX} :: _removeWorkspaceMember :: Workspace member does not belong to the specified workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace member does not belong to the specified workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find the owner of the workspace
    const workspaceOwnerResult = await _findWorkspaceOwner(executionContext, {
      workspaceId: workspaceId,
    });

    if (!workspaceOwnerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _removeWorkspaceMember :: Failed to find workspace owner`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace owner not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceOwnerResultData = workspaceOwnerResult.data;
    const workspaceOwnerUserId = workspaceOwnerResultData?.owner?.id;

    // If a workspace owner is present, ensure that they cannot be removed from the workspace.
    if (workspaceMemberUserId === workspaceOwnerUserId) {
      logger.warn(
        `${LOG_PREFIX} :: _removeWorkspaceMember :: Workspace owner cannot be removed`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Workspace owner cannot be removed',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Remove workspace member
    await workspaceDataService.deleteWorkspaceMember(workspaceMemberId);

    return BusinessResult.ok({
      workspaceMembership: workspaceMembership,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _removeWorkspaceMember :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Removes multiple workspace memberships.
 *
 * @returns A list of results for removing workspace memberships.
 */
export const _removeWorkspaceMemberships = async (
  executionContext: ExecutionContext,
  inputs: RemoveWorkspaceMembershipInputDto[]
): Promise<
  BusinessResult<
    RemoveWorkspaceMembershipOutputDto[],
    RemoveWorkspaceMembershipErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const successResults: RemoveWorkspaceMembershipOutputDto[] = [];
    const failureResults: RemoveWorkspaceMembershipErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        try {
          const result = await _removeWorkspaceMembership(
            executionContext,
            input
          );

          if (result.isSuccess()) {
            successResults.push(result.data);
          }

          if (result.hasErrors()) {
            failureResults.push(...result.errors);
          }
        } catch (error: unknown) {
          logger.error(
            `${LOG_PREFIX} :: _removeWorkspaceMembership :: Failed to remove workspace membership`,
            injectExceptionDetails(error, {
              input: input,
              context: loggingContext,
            })
          );
          failureResults.push(
            BusinessErrorResult.with({
              code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
              detail: 'Failed to remove workspace membership',
              metadata: {
                input: input,
                context: executionContext,
              },
            })
          );
        }
      })
    );

    return BusinessResult.fromMultiResult(successResults, failureResults);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _removeWorkspaceMemberships :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Updates the role of a workspace member.
 *
 * @returns The updated workspace member if the role was successfully updated
 */
export const _updateWorkspaceMemberRole = async (
  executionContext: ExecutionContext,
  input: UpdateWorkspaceMemberRoleInputDto
): Promise<
  BusinessResult<
    UpdateWorkspaceMemberRoleOutputDto,
    UpdateWorkspaceMemberRoleErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdateWorkspaceMemberRoleInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const role = parsedInputData.role;
    const workspaceId = parsedInputData.workspaceId;
    const workspaceMemberId = parsedInputData.workspaceMemberId;

    // Step 2: Find the workspace membership
    const workspaceMemberResult = await _findWorkspaceMembershipById(
      executionContext,
      {
        workspaceMemberId,
      }
    );

    if (!workspaceMemberResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Failed to find workspace member`,
        {
          input: input,
          context: executionContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMemberResultData = workspaceMemberResult.data;

    if (!workspaceMemberResultData) {
      logger.error(
        `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Workspace member not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace member not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingWorkspaceMembership =
      workspaceMemberResultData.workspaceMembership;
    const workspaceMemberWorkspaceId = existingWorkspaceMembership.workspaceId;
    const workspaceMemberUserId = existingWorkspaceMembership.userId;

    // Check if the member belongs to the input workspace
    if (workspaceMemberWorkspaceId !== workspaceId) {
      logger.warn(
        `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Workspace member does not belong to the specified workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace member does not belong to the specified workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find the owner of the workspace
    const workspaceOwnerResult = await _findWorkspaceOwner(executionContext, {
      workspaceId: workspaceId,
    });

    if (!workspaceOwnerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Failed to find workspace owner`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace owner not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceOwnerResultData = workspaceOwnerResult.data;
    const workspaceOwnerUserId = workspaceOwnerResultData?.owner?.id;

    // If a workspace owner is present, ensure that they cannot be removed from the workspace.
    if (workspaceMemberUserId === workspaceOwnerUserId) {
      logger.warn(
        `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Workspace owner cannot be removed`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Workspace owner cannot be removed',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Assign the role to the workspace member
    const assignRoleResult = await _assignWorkspaceMemberRole(
      executionContext,
      {
        workspaceMemberId: workspaceMemberId,
        workspaceId: workspaceId,
        role: role,
      }
    );

    if (!assignRoleResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Failed to assign role to workspace member`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign role to workspace member',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const assignRoleData = assignRoleResult.data;
    const assignedRole = assignRoleData.role;

    const updatedWorkspaceMembership: WorkspaceMembership = {
      ...existingWorkspaceMembership,
      role: assignedRole,
    };

    return BusinessResult.ok({
      workspaceMembership: updatedWorkspaceMembership,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Updates multiple workspace member roles.
 *
 * @returns A list of results for updating workspace member roles.
 */
export const _updateWorkspaceMemberRoles = async (
  executionContext: ExecutionContext,
  inputs: UpdateWorkspaceMemberRoleInputDto[]
): Promise<
  BusinessResult<
    UpdateWorkspaceMemberRoleOutputDto[],
    UpdateWorkspaceMemberRoleErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const successResults: UpdateWorkspaceMemberRoleOutputDto[] = [];
    const failureResults: UpdateWorkspaceMemberRoleErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        try {
          const result = await _updateWorkspaceMemberRole(
            executionContext,
            input
          );

          if (result.isSuccess()) {
            successResults.push(result.data);
          }

          if (result.hasErrors()) {
            failureResults.push(...result.errors);
          }
        } catch (error: unknown) {
          logger.error(
            `${LOG_PREFIX} :: _updateWorkspaceMemberRole :: Failed to update workspace member role`,
            injectExceptionDetails(error, {
              input: input,
              context: loggingContext,
            })
          );
          failureResults.push(
            BusinessErrorResult.with({
              code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
              detail: 'Failed to update workspace member role',
              metadata: {
                input: input,
                context: executionContext,
              },
            })
          );
        }
      })
    );

    return BusinessResult.fromMultiResult(successResults, failureResults);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateWorkspaceMemberRoles :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Finds a workspace by their ID.
 *
 * @returns The workspace entity if found, or null if not found.
 */
export const _findWorkspaceById = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceByIdInputDto
): Promise<
  BusinessResult<Nullable<WorkspaceEntity>, FindWorkspaceByIdErrorDto>
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindWorkspaceByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    // Step 2: Find workspace by ID
    const workspaceEntity = await workspaceDataService.findWorkspaceById(
      parsedInput.data.id
    );

    if (!workspaceEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok(workspaceEntity);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findWorkspaceById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Extracts the primary subscription connection from a provided list of connections.
 *
 * @returns The extracted primary subscription connection or null if not found.
 */
export const _extractPrimarySubscriptionConnection = (
  executionContext: ExecutionContext,
  input: ExtractPrimarySubscriptionConnectionsInputDto
): BusinessResult<
  Nullable<ExtractPrimarySubscriptionConnectionsOutputDto>,
  ExtractPrimarySubscriptionConnectionsErrorDto
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const connections = input.connections;

    // Step 1: Separate terminal and actionable connections
    const terminalConnections = [];
    const actionableConnections = [];

    for (const connection of connections) {
      if (connection.isTerminal()) {
        terminalConnections.push(connection);
      } else {
        actionableConnections.push(connection);
      }
    }

    // Step 2: Check if there multiple actionable connections
    // If there are multiple actionable connections for the workspace,
    // we will not return them, as this is an error case
    if (actionableConnections.length > 1) {
      logger.error(
        `${LOG_PREFIX} :: _extractPrimarySubscriptionConnection :: Multiple actionable connections found for workspace ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: `Multiple actionable connections found for input workspace`,
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const targetActionableConnection = actionableConnections[0];

    // Step 3: If there is an actionable connection, return it
    if (targetActionableConnection) {
      return BusinessResult.ok({
        connection: targetActionableConnection,
      });
    }

    // Step 4: Finally, we need to find the most recent terminal access subscription
    // A subscription cannot be changed once it is in a terminal state
    // Because of this, we can safely find the most recent terminal subscription
    // by sorting the connection by the latest updated date
    const mostRecentTerminalConnection = terminalConnections.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )[0];

    // If there is no actionable connection and no terminal connection,
    // we will return null, as there is no access subscription for the workspace
    if (!mostRecentTerminalConnection) {
      return BusinessResult.ok(null);
    }

    // Step 5: Return the most recent terminal connection as the workspace access subscription
    return BusinessResult.ok({
      connection: mostRecentTerminalConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _extractPrimarySubscriptionConnection :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds the primary subscription connection for each workspace by their IDs.
 *
 * @returns The primary subscription connections for each workspace if found.
 */
export const _findAllPrimarySubscriptionConnectionsByWorkspaceIds = async (
  executionContext: ExecutionContext,
  input: FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDto
): Promise<
  BusinessResult<
    FindAllPrimarySubscriptionConnectionsByWorkspaceIdsOutputDto,
    FindAllPrimarySubscriptionConnectionsByWorkspaceIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllPrimarySubscriptionConnectionsByWorkspaceIdsInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceIds = parsedInputData.workspaceIds;

    // Step 2: Find the billing provider connections for each workspace
    const customerResult =
      await _findAllWorkspaceBillingProviderConnectionsByWorkspaceIds(
        executionContext,
        {
          workspaceIds: workspaceIds,
        }
      );

    if (!customerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllPrimarySubscriptionConnectionsByWorkspaceIds :: Failed to find billing provider connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerResultData = customerResult.data;
    const customerConnections = customerResultData.connections;
    const customerConnectionMap = customerResultData.connectionMap;
    const customerIds = customerConnections.map((connection) => connection.id);

    // If all the connections are not found, return an error
    const missingBillingProvider = workspaceIds.some(
      (workspaceId) => !customerConnectionMap.has(workspaceId)
    );

    if (missingBillingProvider) {
      logger.error(
        `${LOG_PREFIX} :: _findAllPrimarySubscriptionConnectionsByWorkspaceIds :: No billing provider connection found for some workspaces`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No billing provider connection found for some workspaces',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find all the primary subscription connections for each customer
    const subscriptionConnectionResults =
      await billingBusinessService._findAllSubscriptionConnectionsByCustomerIds(
        executionContext,
        {
          customerIds: customerIds,
        }
      );

    if (!subscriptionConnectionResults.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllPrimarySubscriptionConnectionsByWorkspaceIds :: Failed to find access subscriptions`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace access subscriptions',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionResultData = subscriptionConnectionResults.data;
    const subscriptionConnectionMap =
      subscriptionConnectionResultData.connectionMap;

    // Step 4: Extract the primary subscription connection for each workspace
    const primarySubscriptionMap = new Map<
      string,
      SubscriptionConnectionEntity
    >();

    for (const [workspaceId, customerConnection] of customerConnectionMap) {
      const subscriptionConnections =
        subscriptionConnectionMap.get(customerConnection.id) ?? [];

      const primarySubscriptionConnectionResult =
        _extractPrimarySubscriptionConnection(executionContext, {
          connections: subscriptionConnections,
        });

      if (!primarySubscriptionConnectionResult.isSuccess()) {
        logger.error(
          `${LOG_PREFIX} :: _findAllPrimarySubscriptionConnectionsByWorkspaceIds :: Failed to extract primary subscription connection`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
          detail: 'Failed to extract primary subscription connection',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }

      const primarySubscriptionConnectionResultData =
        primarySubscriptionConnectionResult.data;
      const primarySubscriptionConnection =
        primarySubscriptionConnectionResultData?.connection;

      if (primarySubscriptionConnection) {
        primarySubscriptionMap.set(workspaceId, primarySubscriptionConnection);
      }
    }

    return BusinessResult.ok({
      connections: Array.from(primarySubscriptionMap.values()),
      connectionMap: primarySubscriptionMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllPrimarySubscriptionConnectionsByWorkspaceIds :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds all access subscriptions by workspace IDs.
 *
 * @returns The access subscription groups containing the workspace ID and access subscription.
 */
export const _findAllAccessSubscriptionsByWorkspaceIds = async (
  executionContext: ExecutionContext,
  input: FindAllAccessSubscriptionsByWorkspaceIdsInputDto
): Promise<
  BusinessResult<
    FindAllAccessSubscriptionsByWorkspaceIdsOutputDto,
    FindAllAccessSubscriptionsByWorkspaceIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllAccessSubscriptionsByWorkspaceIdsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceIds = parsedInputData.workspaceIds;

    // Step 2: Find the primary subscription connections for each workspace
    const subscriptionConnectionResults =
      await _findAllPrimarySubscriptionConnectionsByWorkspaceIds(
        executionContext,
        {
          workspaceIds: workspaceIds,
        }
      );

    if (!subscriptionConnectionResults.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllAccessSubscriptionsByWorkspaceIds :: Failed to find primary subscription connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace access subscriptions',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionResultData = subscriptionConnectionResults.data;
    const subscriptionConnections =
      subscriptionConnectionResultData.connections;
    const subscriptionConnectionMap =
      subscriptionConnectionResultData.connectionMap;
    const subscriptionIds = subscriptionConnections.map(
      (connection) => connection.id
    );

    // Step 3: Find all the access subscription plans for each subscription connection
    const subscriptionPlanResults =
      await billingBusinessService._findAllSubscriptionPlansBySubscriptionIds(
        executionContext,
        {
          subscriptionIds: subscriptionIds,
          filter: {
            family: {
              types: [SUBSCRIPTION_PLAN_TYPE.ACCESS],
            },
          },
        }
      );

    if (!subscriptionPlanResults.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllAccessSubscriptionsByWorkspaceIds :: Failed to find access subscription plans`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscription plans',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionPlanResultData = subscriptionPlanResults.data;
    const subscriptionPlanMap = subscriptionPlanResultData.planMap;

    // Step 4: Extract the access subscription plan for each subscription connection
    const accessSubscriptionPlanMap = new Map<
      string,
      SubscriptionItemConnectionPlanDto
    >();

    for (const [
      workspaceId,
      subscriptionConnection,
    ] of subscriptionConnectionMap) {
      const subscriptionPlans =
        subscriptionPlanMap.get(subscriptionConnection.id) ?? [];

      // If there are multiple access subscription plans for the workspace,
      // we will not return them, as this is an error case
      if (subscriptionPlans.length > 1) {
        logger.error(
          `${LOG_PREFIX} :: _findAllAccessSubscriptionsByWorkspaceIds :: Multiple access subscription plans found for workspace primary subscription`,
          {
            input: input,
            context: loggingContext,
            workspaceId: workspaceId,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
          detail: `Multiple access subscription plans found for workspace`,
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }

      const targetAccessSubscriptionPlan = subscriptionPlans[0];

      if (targetAccessSubscriptionPlan) {
        accessSubscriptionPlanMap.set(
          workspaceId,
          targetAccessSubscriptionPlan
        );
      }
    }

    // Step 5: Finally, map the access subscriptions for each workspace
    const accessSubscriptionMap = new Map<
      string,
      WorkspaceAccessSubscription
    >();

    for (const workspaceId of workspaceIds) {
      const connection = subscriptionConnectionMap.get(workspaceId);
      const planConnection = accessSubscriptionPlanMap.get(workspaceId);

      if (!connection || !planConnection) {
        continue;
      }

      const accessSubscription = mapWorkspaceAccessSubscription({
        workspaceId: workspaceId,
        subscriptionConnection: connection,
        subscriptionPlan: planConnection.plan,
        subscriptionItemConnection: planConnection.connection,
      }) as WorkspaceAccessSubscription;

      accessSubscriptionMap.set(workspaceId, accessSubscription);
    }

    return BusinessResult.ok({
      subscriptions: Array.from(accessSubscriptionMap.values()),
      subscriptionMap: accessSubscriptionMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllAccessSubscriptionsByWorkspaceIds :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Find access subscription by workspace ID
 *
 * @returns The access subscription for the workspace, or null if not found.
 */
export const _findAccessSubscriptionByWorkspaceId = async (
  executionContext: ExecutionContext,
  input: FindAccessSubscriptionByWorkspaceIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindAccessSubscriptionByWorkspaceIdOutputDto>,
    FindAccessSubscriptionByWorkspaceIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAccessSubscriptionByWorkspaceIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find all access subscriptions by workspace ID
    // Since we have to fetch many workspace subscriptions/subscription items regardless,
    // the bulk function is used.
    const accessSubscriptionResult =
      await _findAllAccessSubscriptionsByWorkspaceIds(executionContext, {
        workspaceIds: [workspaceId],
      });

    if (!accessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAccessSubscriptionByWorkspaceId :: Failed to find access subscription for workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscription for workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscriptionResultData = accessSubscriptionResult.data;
    const accessSubscriptionMap = accessSubscriptionResultData.subscriptionMap;

    const targetAccessSubscription =
      accessSubscriptionMap.get(workspaceId) ?? null;

    if (!targetAccessSubscription) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      subscription: targetAccessSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAccessSubscriptionByWorkspaceId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Cancel the access subscription at the end of the billing period.
 *
 * @returns The cancelled access subscription.
 */
export const _cancelAccessSubscriptionAtPeriodEnd = async (
  executionContext: ExecutionContext,
  input: CancelAccessSubscriptionAtPeriodEndInputDto
): Promise<
  BusinessResult<
    CancelAccessSubscriptionAtPeriodEndOutputDto,
    CancelAccessSubscriptionAtPeriodEndErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CancelAccessSubscriptionAtPeriodEndInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find the access subscription for the workspace
    const accessSubscriptionResult = await _findAccessSubscriptionByWorkspaceId(
      executionContext,
      {
        workspaceId: workspaceId,
      }
    );

    if (!accessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelAccessSubscriptionAtPeriodEnd :: Failed to find access subscription for workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscription for workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscriptionResultData = accessSubscriptionResult.data;

    if (!accessSubscriptionResultData) {
      logger.error(
        `${LOG_PREFIX} :: _cancelAccessSubscriptionAtPeriodEnd :: Access subscription not found for the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Access subscription not found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscription = accessSubscriptionResultData.subscription;

    // Step 3: Check if the access subscription plan is self service
    if (!accessSubscription.plan.isSelfService()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelAccessSubscriptionAtPeriodEnd :: Access subscription plan is not self service`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Access subscription plan is not self service',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Cancel the access subscription at period end
    const cancelResult =
      await billingBusinessService._cancelSubscriptionAtPeriodEnd(
        executionContext,
        {
          subscriptionId: accessSubscription.id,
        }
      );

    if (!cancelResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelAccessSubscriptionAtPeriodEnd :: Failed to cancel access subscription at period end`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to cancel access subscription at period end',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Fetch the hydrated access subscription
    const hydratedAccessSubscriptionResult =
      await _findAccessSubscriptionByWorkspaceId(executionContext, {
        workspaceId: workspaceId,
      });

    if (!hydratedAccessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelAccessSubscriptionAtPeriodEnd :: Failed to refetch hydrated access subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to refetch hydrated access subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedAccessSubscriptionResultData =
      hydratedAccessSubscriptionResult.data;

    if (!hydratedAccessSubscriptionResultData) {
      logger.error(
        `${LOG_PREFIX} :: _cancelAccessSubscriptionAtPeriodEnd :: Hydrated access subscription not found for the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Hydrated access subscription not found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedAccessSubscription =
      hydratedAccessSubscriptionResultData.subscription;

    return BusinessResult.ok({
      subscription: hydratedAccessSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cancelPrimaryAccessSubscriptionAtPeriodEnd :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Resumes a cancelled access subscription.
 *
 * @returns The resumed access subscription.
 */
export const _resumeCancelledAccessSubscription = async (
  executionContext: ExecutionContext,
  input: ResumeCancelledAccessSubscriptionInputDto
): Promise<
  BusinessResult<
    ResumeCancelledAccessSubscriptionOutputDto,
    ResumeCancelledAccessSubscriptionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      ResumeCancelledAccessSubscriptionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;

    // Step 2: Find the access subscription for the workspace
    const accessSubscriptionResult = await _findAccessSubscriptionByWorkspaceId(
      executionContext,
      {
        workspaceId: workspaceId,
      }
    );

    if (!accessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: Failed to find access subscription for workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscription for workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscriptionResultData = accessSubscriptionResult.data;

    if (!accessSubscriptionResultData) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: Access subscription not found for the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Access subscription not found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscription = accessSubscriptionResultData.subscription;

    // Step 3: Check if the access subscription plan is self service
    if (!accessSubscription.plan.isSelfService()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: Access subscription plan is not self service`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Access subscription plan is not self service',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Resume the access subscription
    const resumeResult =
      await billingBusinessService._resumeCancelledSubscription(
        executionContext,
        {
          subscriptionId: accessSubscription.id,
        }
      );

    if (!resumeResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: Failed to resume access subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to resume access subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Fetch the hydrated access subscription
    const hydratedAccessSubscriptionResult =
      await _findAccessSubscriptionByWorkspaceId(executionContext, {
        workspaceId: workspaceId,
      });

    if (!hydratedAccessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: Failed to refetch hydrated access subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to refetch hydrated access subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedAccessSubscriptionResultData =
      hydratedAccessSubscriptionResult.data;

    if (!hydratedAccessSubscriptionResultData) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: Hydrated access subscription not found for the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Hydrated access subscription not found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedAccessSubscription =
      hydratedAccessSubscriptionResultData.subscription;

    return BusinessResult.ok({
      subscription: hydratedAccessSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _resumeCancelledAccessSubscription :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Creates a payment method management session for a workspace.
 *
 * @returns The payment method management session.
 */
export const _createPaymentMethodManagementSession = async (
  executionContext: ExecutionContext,
  input: CreatePaymentMethodManagementSessionInputDto
): Promise<
  BusinessResult<
    CreatePaymentMethodManagementSessionOutputDto,
    CreatePaymentMethodManagementSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreatePaymentMethodManagementSessionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const returnPath =
      parsedInputData.returnPath ??
      DEFAULT_WORKSPACE_PAYMENT_METHOD_MANAGEMENT_SESSION_RETURN_PATH;

    // Step 2: Find the workspace billing provider connection
    const billingProviderConnectionResult =
      await _findWorkspaceBillingProviderConnection(executionContext, {
        workspaceId: workspaceId,
      });

    if (!billingProviderConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createPaymentMethodManagementSession :: Failed to find workspace billing provider connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnectionData = billingProviderConnectionResult.data;

    if (!billingProviderConnectionData) {
      logger.error(
        `${LOG_PREFIX} :: _createPaymentMethodManagementSession :: Billing provider connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Billing provider connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnection = billingProviderConnectionData.connection;
    const customerId = billingProviderConnection.id;
    const returnUrl = generateAppUrl(returnPath);

    // Step 3: Create the payment method management session
    const sessionResult =
      await billingBusinessService._createCustomerPaymentMethodManagementSession(
        executionContext,
        {
          customerId: customerId,
          returnUrl: returnUrl,
        }
      );

    if (!sessionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createPaymentMethodManagementSession :: Failed to create payment method management session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create payment method management session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const sessionResultData = sessionResult.data;
    const session = sessionResultData.session;

    return BusinessResult.ok({
      session: session,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createPaymentMethodManagementSession :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds all access subscription plans by the default plan group key.
 *
 * @returns The access subscription plans.
 */
export const _findAllAccessSubscriptionPlans = async (
  executionContext: ExecutionContext
): Promise<
  BusinessResult<
    FindAllAccessSubscriptionPlansOutputDto,
    FindAllAccessSubscriptionPlansErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Find all access subscription plans
    const subscriptionPlanResults =
      await billingBusinessService._findAllSubscriptionPlansByFamilyGroupKey(
        executionContext,
        {
          groupKey: DEFAULT_ACCESS_SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
          filter: {
            family: {
              types: [SUBSCRIPTION_PLAN_TYPE.ACCESS],
            },
          },
        }
      );

    if (!subscriptionPlanResults.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllAccessSubscriptionPlans :: Failed to find access subscription plans`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscription plans',
        metadata: {
          context: executionContext,
        },
      });
    }

    const subscriptionPlanResultData = subscriptionPlanResults.data;
    const subscriptionPlans = subscriptionPlanResultData.plans;

    return BusinessResult.ok({
      plans: subscriptionPlans,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllAccessSubscriptionPlans :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Creates a checkout session for an access subscription.
 *
 * @returns The created checkout session information.
 */
export const _createAccessSubscriptionCheckoutSession = async (
  executionContext: ExecutionContext,
  input: CreateAccessSubscriptionCheckoutSessionInputDto
): Promise<
  BusinessResult<
    CreateAccessSubscriptionCheckoutSessionOutputDto,
    CreateAccessSubscriptionCheckoutSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateAccessSubscriptionCheckoutSessionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const planId = parsedInputData.planId;
    const quantity = parsedInputData.quantity;

    // Step 2: Find the workspace billing provider connection
    const billingProviderConnectionResult =
      await _findWorkspaceBillingProviderConnection(executionContext, {
        workspaceId: workspaceId,
      });

    if (!billingProviderConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: Failed to find workspace billing provider connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace billing provider connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnectionData = billingProviderConnectionResult.data;

    if (!billingProviderConnectionData) {
      logger.error(
        `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: No billing provider connection found for workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No billing provider connection found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnection = billingProviderConnectionData.connection;
    const customerId = billingProviderConnection.id;

    // Step 3: Find plans available for access subscriptions
    const subscriptionPlanResult =
      await _findAllAccessSubscriptionPlans(executionContext);

    if (!subscriptionPlanResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: Failed to find access subscription plans`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscription plans',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionPlanData = subscriptionPlanResult.data;
    const plans = subscriptionPlanData.plans;

    // Validate that the input plan ID is available for access subscriptions
    const targetPlan = plans.find((plan) => plan.id === planId);

    if (!targetPlan) {
      logger.error(
        `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: Plan not found in available access subscription plans`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Invalid plan ID for access subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Validate that the found plan is self service
    if (!targetPlan.isSelfService()) {
      logger.error(
        `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: Plan is not self service`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Invalid plan ID for access subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Create the checkout session
    const checkoutSessionResult =
      await billingBusinessService._createSubscriptionPlanCheckoutSession(
        executionContext,
        {
          customerId: customerId,
          planId: planId,
          quantity: quantity,
          redirectUrl: generateAppUrl(
            DEFAULT_WORKSPACE_CHECKOUT_SESSION_RESULT_PATH
          ),
        }
      );

    if (!checkoutSessionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: Failed to create checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create access subscription checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const checkoutSessionData = checkoutSessionResult.data;
    const checkoutSession = checkoutSessionData.session;

    return BusinessResult.ok({
      session: checkoutSession,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createAccessSubscriptionCheckoutSession :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Change the access subscription plan for a workspace.
 *
 * @returns The updated access subscription.
 */
export const _changeAccessSubscriptionPlan = async (
  executionContext: ExecutionContext,
  input: ChangeAccessSubscriptionPlanInputDto
): Promise<
  BusinessResult<
    ChangeAccessSubscriptionPlanOutputDto,
    ChangeAccessSubscriptionPlanErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      ChangeAccessSubscriptionPlanInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const planId = parsedInputData.planId;

    // Step 2: Find the access subscription for the workspace
    const accessSubscriptionResult = await _findAccessSubscriptionByWorkspaceId(
      executionContext,
      {
        workspaceId: workspaceId,
      }
    );

    if (!accessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeAccessSubscriptionPlan :: Failed to find access subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find access subscription for workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscriptionData = accessSubscriptionResult.data;

    if (!accessSubscriptionData) {
      logger.error(
        `${LOG_PREFIX} :: _changeAccessSubscriptionPlan :: Access subscription not found for the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Access subscription not found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const accessSubscription = accessSubscriptionData.subscription;
    const accessSubscriptionPlan = accessSubscription.plan;

    // Step 3: Change the subscription plan
    const changePlanResult =
      await billingBusinessService._changeSubscriptionPlan(executionContext, {
        subscriptionItemId: accessSubscription.itemId,
        fromPlanId: accessSubscriptionPlan.id,
        toPlanId: planId,
        quantity: accessSubscription.quantity,
      });

    if (!changePlanResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeAccessSubscriptionPlan :: Failed to change subscription plan`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to change access subscription plan',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Fetch the updated access subscription
    const hydratedAccessSubscriptionResult =
      await _findAccessSubscriptionByWorkspaceId(executionContext, {
        workspaceId: workspaceId,
      });

    if (!hydratedAccessSubscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeAccessSubscriptionPlan :: Failed to refetch hydrated access subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to refetch hydrated access subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedAccessSubscriptionResultData =
      hydratedAccessSubscriptionResult.data;

    if (!hydratedAccessSubscriptionResultData) {
      logger.error(
        `${LOG_PREFIX} :: _changeAccessSubscriptionPlan :: Hydrated access subscription not found for the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Hydrated access subscription not found for the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedAccessSubscription =
      hydratedAccessSubscriptionResultData.subscription;

    return BusinessResult.ok({
      subscription: hydratedAccessSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _changeAccessSubscriptionPlan :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Cursor paginates workspace invoices.
 *
 * @returns The paginated workspace invoices.
 */
export const _cursorPaginateWorkspaceInvoices = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceInvoicesInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceInvoicesOutputDto,
    CursorPaginateWorkspaceInvoicesErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CursorPaginateWorkspaceInvoicesInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const pagination = parsedInputData.pagination;
    const filter = parsedInputData.filter;

    // Step 2: Find the billing provider for the workspace
    const billingProviderResult = await _findWorkspaceBillingProviderConnection(
      executionContext,
      {
        workspaceId: workspaceId,
      }
    );

    if (!billingProviderResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cursorPaginateWorkspaceInvoices :: Failed to find billing provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find billing provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderResultData = billingProviderResult.data;

    if (!billingProviderResultData) {
      logger.error(
        `${LOG_PREFIX} :: _cursorPaginateWorkspaceInvoices :: Billing provider not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Billing provider not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProviderConnection = billingProviderResultData.connection;
    const billingProvider = billingProviderConnection.provider;
    const billingProviderId = billingProviderConnection.providerId;

    // Step 3: Find the invoices for the billing provider
    const invoiceResult =
      await billingBusinessService._cursorPaginateProviderCustomerInvoices(
        executionContext,
        {
          provider: billingProvider,
          providerCustomerId: billingProviderId,
          pagination: pagination,
          filter: {
            status: filter?.status,
          },
        }
      );

    if (!invoiceResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cursorPaginateWorkspaceInvoices :: Failed to find invoices`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find invoices',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const invoiceResultData = invoiceResult.data;

    return BusinessResult.ok({
      nodes: invoiceResultData.nodes,
      totalCount: invoiceResultData.totalCount,
      hasNextPage: invoiceResultData.hasNextPage,
      hasPreviousPage: invoiceResultData.hasPreviousPage,
      endCursor: invoiceResultData.endCursor,
      startCursor: invoiceResultData.startCursor,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cursorPaginateWorkspaceInvoices :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Creates a workspace and assigns the provided user as a member of that workspace.
 *
 * The user is assigned the role of workspace admin, and if specified,
 * the workspace is set as the user's default workspace.
 *
 * Finally, a {@link DEFAULT_WORKSPACE_BILLING_PROVIDER billing provider} is created for the workspace.
 *
 * @returns The created workspace, the workspace membership of the member, and the billing provider.
 */
export const _createWorkspaceAndMember = async (
  executionContext: ExecutionContext,
  input: CreateWorkspaceAndMemberInputDto
): Promise<
  BusinessResult<
    CreateWorkspaceAndMemberOutputDto,
    CreateWorkspaceAndMemberErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = CreateWorkspaceAndMemberInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceName = parsedInputData.workspaceName;
    const workspaceUrl = parsedInputData.workspaceUrl ?? null;
    const billingEmail = parsedInputData.billingEmail;
    const userId = parsedInputData.userId;

    // Step 2: Find the user
    const userResult = await userBusinessService._findUserById(
      executionContext,
      {
        id: userId,
      }
    );

    if (!userResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createWorkspaceAndMember :: Failed to find user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find user',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    if (!userEntity) {
      logger.warn(
        `${LOG_PREFIX} :: _createWorkspaceAndMember :: User not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'User not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Create workspace and member
    const workspaceWithMemberOperation =
      await workspaceDataService.createWorkspaceAndMember(
        workspaceName,
        workspaceUrl,
        userId
      );

    const workspaceEntity = workspaceWithMemberOperation.workspace;
    const workspaceMemberEntity = workspaceWithMemberOperation.workspaceMember;

    const workspaceId = workspaceEntity.id;
    const workspaceMemberId = workspaceMemberEntity.id;

    // Step 4: Assign the owner of the workspace
    const ownerAssignResult = await _assignWorkspaceOwner(executionContext, {
      workspaceId: workspaceId,
      userId: userId,
    });

    if (!ownerAssignResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createWorkspaceAndMember :: Failed to assign owner`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign workspace owner',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Assign the workspace member role
    const assignWorkspaceMemberResult = await _assignWorkspaceMemberRole(
      executionContext,
      {
        workspaceId: workspaceId,
        workspaceMemberId: workspaceMemberId,
        role: ROLE.WORKSPACE_ADMIN,
      }
    );

    if (!assignWorkspaceMemberResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createWorkspaceAndMember :: Failed to assign workspace member role`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to assign workspace member role',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 6: Conditionally assign the user's default workspace
    if (parsedInputData.assignDefaultWorkspace) {
      const assignDefaultWorkspaceResult = await _assignDefaultWorkspace(
        executionContext,
        {
          userId: userId,
          workspaceId: workspaceId,
        }
      );

      if (!assignDefaultWorkspaceResult.isSuccess()) {
        logger.error(
          `${LOG_PREFIX} :: _createWorkspaceAndMember :: Failed to assign user default workspace`,
          {
            input: input,
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
          detail: 'Failed to assign user default workspace',
          metadata: {
            input: input,
            context: executionContext,
          },
        });
      }
    }

    const workspaceMembership = mapWorkspaceMembership({
      user: userEntity,
      member: workspaceMemberEntity,
      role: ROLE.WORKSPACE_ADMIN,
    }) as WorkspaceMembership;

    // Step 7: Create the billing provider for the workspace
    const billingProviderResult = await _createWorkspaceBillingProvider(
      executionContext,
      {
        email: billingEmail,
        workspaceId: workspaceId,
        provider: DEFAULT_WORKSPACE_BILLING_PROVIDER,
      }
    );

    if (!billingProviderResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createWorkspaceAndMember :: Failed to create workspace billing provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create workspace billing provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const billingProvider = billingProviderResult.data;

    // Step 7: Return the workspace with members
    return BusinessResult.ok({
      workspace: workspaceEntity,
      workspaceMembership: workspaceMembership,
      billingProvider: billingProvider,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createWorkspaceAndMember :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds an effective workspace email invite by ID.
 *
 * @returns The effective workspace invite if found, or null if not found.
 */
export const _findEffectiveWorkspaceEmailInviteById = async (
  executionContext: ExecutionContext,
  input: FindEffectiveWorkspaceEmailInviteByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindEffectiveWorkspaceEmailInviteByIdOutputDto>,
    FindEffectiveWorkspaceEmailInviteByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindEffectiveWorkspaceEmailInviteByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const inviteId = parsedInputData.inviteId;

    // Step 2: Find the workspace email invite by ID
    const workspaceInviteEntity =
      await workspaceDataService.findEffectiveWorkspaceEmailInviteById(
        inviteId
      );

    // If no invite is found, return null
    if (!workspaceInviteEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      invite: workspaceInviteEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findEffectiveWorkspaceEmailInviteById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Finds an effective workspace email invite and relevant metadata by Code and User ID.
 *
 * @returns The effective workspace invite if found along with relevant metadata on the invitation, or null if not found.
 */
export const _findEffectiveWorkspaceEmailInviteByCodeAndUserId = async (
  executionContext: ExecutionContext,
  input: FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindEffectiveWorkspaceEmailInviteByCodeAndUserIdOutputDto>,
    FindEffectiveWorkspaceEmailInviteByCodeAndUserIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDtoSchema.safeParse(
        input
      );

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const code = parsedInputData.code;
    const codeHash = hashWorkspaceInviteCode(code);
    const userId = parsedInputData.userId;

    // Step 2: Find the workspace email invite by ID
    const workspaceInviteEntity =
      await workspaceDataService.findEffectiveWorkspaceEmailInviteByHash(
        codeHash
      );

    // If no invite is found, return null
    if (!workspaceInviteEntity) {
      return BusinessResult.ok(null);
    }

    const inviteEmail = workspaceInviteEntity.targetId;

    // Step 3: Find the user by ID
    const userResult = await userBusinessService._findUserById(
      executionContext,
      {
        id: userId,
      }
    );

    if (!userResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find user associated with invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    if (!userEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'User not found for the provided invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const invitedUserEmail = userEntity.email;

    // Check if the invited user's email address matches the email of the invite
    if (invitedUserEmail !== inviteEmail) {
      logger.error(
        `${LOG_PREFIX} :: _findEffectiveWorkspaceEmailInviteByCodeAndUserId :: Invited user does not match input user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Invited user email does not match the email of the invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceId = workspaceInviteEntity.workspaceId;

    // Step 4: Find the workspace associated with the invite
    const workspaceResult = await _findWorkspaceById(executionContext, {
      id: workspaceId,
    });

    if (!workspaceResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace associated with invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceEntity = workspaceResult.data;

    if (!workspaceEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Workspace not found for the provided invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      invite: workspaceInviteEntity,
      workspace: workspaceEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findEffectiveWorkspaceEmailInviteByCodeAndUserId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Cursor paginates workspace email invites.
 *
 * @returns The paginated workspace email invites.
 */
export const _cursorPaginateWorkspaceEmailInvites = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceEmailInvitesInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceEmailInvitesOutputDto,
    CursorPaginateWorkspaceEmailInvitesErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CursorPaginateWorkspaceEmailInvitesInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const sort = parsedInputData.sort;
    const pagination = parsedInputData.pagination;
    const filter = parsedInputData.filter;

    // Step 2: Cursor paginate workspace email invites
    const cursorPaginateOperation =
      await workspaceDataService.cursorPaginateWorkspaceEmailInvites(
        pagination,
        sort,
        {
          expired: filter?.expired,
          workspaceId: filter?.workspaceId,
          declined: filter?.declined,
          accepted: filter?.accepted,
        }
      );

    return BusinessResult.ok({
      nodes: cursorPaginateOperation.nodes,
      totalCount: cursorPaginateOperation.totalCount,
      hasNextPage: cursorPaginateOperation.hasNextPage,
      hasPreviousPage: cursorPaginateOperation.hasPreviousPage,
      startCursor: cursorPaginateOperation.startCursor,
      endCursor: cursorPaginateOperation.endCursor,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cursorPaginateWorkspaceEmailInvites :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Cursor paginates workspace email invites by workspace ID.
 *
 * @returns The paginated workspace email invites.
 */
export const _cursorPaginateWorkspaceEmailInvitesByWorkspaceId = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceEmailInvitesByWorkspaceIdInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceEmailInvitesOutputDto,
    CursorPaginateWorkspaceEmailInvitesErrorDto
  >
> => {
  return await _cursorPaginateWorkspaceEmailInvites(executionContext, {
    sort: input.sort,
    pagination: input.pagination,
    filter: {
      ...input.filter,
      workspaceId: input.workspaceId,
    },
  });
};

/**
 * @package
 *
 * Creates a new workspace email invite.
 *
 * @returns The created workspace invite if successful.
 */
export const _createWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: CreateWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    CreateWorkspaceEmailInviteOutputDto,
    CreateWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateWorkspaceEmailInviteInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const email = parsedInputData.email;

    // Step 2: Create the invitation code and hash it
    const code = generateWorkspaceInviteCode();
    const hashedCode = hashWorkspaceInviteCode(code);

    const expirationDate = new Date(
      new Date().getTime() +
        WORKSPACE_EMAIL_INVITE_CODE_EXPIRATION_TIME_MILLISECONDS
    );

    // Step 3: Create the workspace invite entity
    const workspaceInviteEntity =
      await workspaceDataService.createWorkspaceEmailInvite(
        workspaceId,
        email,
        hashedCode,
        expirationDate
      );

    // Step 4: Log the code for debugging in non-production environments
    if (isDevelopmentEnvironment()) {
      logger.info(
        `${LOG_PREFIX} :: _createWorkspaceEmailInvite :: Created workspace email invitation`,
        {
          email: email,
          code: code,
        }
      );
    }

    return BusinessResult.ok({
      code: code,
      invite: workspaceInviteEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Sends a workspace email invite.
 *
 * @returns The workspace email invite if the sending is successful.
 */
export const _sendWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: SendWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    SendWorkspaceEmailInviteOutputDto,
    SendWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = SendWorkspaceEmailInviteInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const email = parsedInputData.email;

    // Step 2: Create the workspace email invite
    const createInviteResult = await _createWorkspaceEmailInvite(
      executionContext,
      {
        email: email,
        workspaceId: workspaceId,
      }
    );

    if (!createInviteResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create email invitation',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const code = createInviteResult.data.code;
    const invite = createInviteResult.data.invite;

    // Step 3: Send the email invitation code
    if (!isDevelopmentEnvironment()) {
      // TODO: Implement email sending logic
    }

    return BusinessResult.ok({
      code: code,
      invite: invite,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _sendWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Sends multiple workspace email invites.
 *
 * @returns A list of results for sending email invites.
 */
export const _sendWorkspaceEmailInvites = async (
  executionContext: ExecutionContext,
  inputs: SendWorkspaceEmailInviteInputDto[]
): Promise<
  BusinessResult<
    SendWorkspaceEmailInviteOutputDto[],
    SendWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const successResults: SendWorkspaceEmailInviteOutputDto[] = [];
    const failureResults: SendWorkspaceEmailInviteErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        try {
          const result = await _sendWorkspaceEmailInvite(
            executionContext,
            input
          );

          if (result.isSuccess()) {
            successResults.push(result.data);
          }

          if (result.hasErrors()) {
            failureResults.push(...result.errors);
          }
        } catch (error: unknown) {
          logger.error(
            `${LOG_PREFIX} :: _sendWorkspaceEmailInvite :: Failed to send email invite`,
            injectExceptionDetails(error, {
              input: input,
              context: loggingContext,
            })
          );
          failureResults.push(
            BusinessErrorResult.with({
              code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
              detail: 'Failed to send email invite',
              metadata: {
                input: input,
                context: executionContext,
              },
            })
          );
        }
      })
    );

    return BusinessResult.fromMultiResult(successResults, failureResults);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _sendWorkspaceEmailInvites :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Expires a workspace email invite.
 *
 * @returns The expired workspace email invite if the expiration is successful.
 */
export const _expireWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: ExpireWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    ExpireWorkspaceEmailInviteOutputDto,
    ExpireWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      ExpireWorkspaceEmailInviteInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const workspaceId = parsedInputData.workspaceId;
    const inviteId = parsedInputData.inviteId;

    // Step 2: Find the email invitation code by email and code
    const emailInvitationCodeResult =
      await _findEffectiveWorkspaceEmailInviteById(executionContext, {
        inviteId: inviteId,
      });

    if (!emailInvitationCodeResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve email invitation code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const emailInvitationCodeEntity = emailInvitationCodeResult.data;

    if (!emailInvitationCodeEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'No email invitation code found for the provided email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const invite = emailInvitationCodeEntity.invite;
    const inviteWorkspaceId = invite.workspaceId;

    // Step 3: Validate that the invite belongs to the specified workspace
    if (inviteWorkspaceId !== workspaceId) {
      logger.error(
        `${LOG_PREFIX} :: _expireWorkspaceEmailInvite :: Workspace ID mismatch for email invitation`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Workspace ID mismatch for email invitation',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Expire the email invitation
    const expiredWorkspaceInviteEntity =
      await workspaceDataService.expireWorkspaceInvite(inviteId);

    return BusinessResult.ok({
      invite: expiredWorkspaceInviteEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _expireWorkspaceEmailInvitationCode :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Expires multiple workspace email invites.
 *
 * @returns A list of results for expiring email invites.
 */
export const _expireWorkspaceEmailInvites = async (
  executionContext: ExecutionContext,
  inputs: ExpireWorkspaceEmailInviteInputDto[]
): Promise<
  BusinessResult<
    ExpireWorkspaceEmailInviteOutputDto[],
    ExpireWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const successResults: ExpireWorkspaceEmailInviteOutputDto[] = [];
    const failureResults: ExpireWorkspaceEmailInviteErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        try {
          const result = await _expireWorkspaceEmailInvite(
            executionContext,
            input
          );

          if (result.isSuccess()) {
            successResults.push(result.data);
          }

          if (result.hasErrors()) {
            failureResults.push(...result.errors);
          }
        } catch (error: unknown) {
          logger.error(
            `${LOG_PREFIX} :: _expireWorkspaceEmailInvites :: Failed to expire email invite`,
            injectExceptionDetails(error, {
              input: input,
              context: loggingContext,
            })
          );
          failureResults.push(
            BusinessErrorResult.with({
              code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
              detail: 'Failed to expire email invite',
              metadata: {
                input: input,
                context: executionContext,
              },
            })
          );
        }
      })
    );

    return BusinessResult.fromMultiResult(successResults, failureResults);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _expireWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * @package
 *
 * Verifies a workspace email invite.
 *
 * @returns The workspace email invite if the verification is successful.
 */
export const _verifyWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: VerifyWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    VerifyWorkspaceEmailInviteOutputDto,
    VerifyWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      VerifyWorkspaceEmailInviteInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const inviteId = parsedInputData.inviteId;

    // Step 2: Verify the email invite code
    const inviteResult = await _findEffectiveWorkspaceEmailInviteById(
      executionContext,
      {
        inviteId: inviteId,
      }
    );

    if (!inviteResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to retrieve email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceInviteResultData = inviteResult.data;

    if (!workspaceInviteResultData) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'No email invite found for the provided email',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceInviteEntity = workspaceInviteResultData.invite;

    // Step 3: Verify that the target workspace has available seats
    // TODO: Implement logic to check if the workspace has enough seats available

    return BusinessResult.ok({
      invite: workspaceInviteEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _verifyWorkspaceEmailInvitationCode :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Accepts a workspace email invite.
 *
 * @returns The accepted workspace invite and the workspace membership if successful.
 */
export const _acceptWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: AcceptWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    AcceptWorkspaceEmailInviteOutputDto,
    AcceptWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AcceptWorkspaceEmailInviteInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const inviteId = parsedInputData.inviteId;
    const userId = parsedInputData.userId;

    // Step 2: Verify the email invite
    const verifyResult = await _verifyWorkspaceEmailInvite(executionContext, {
      inviteId: inviteId,
    });

    if (!verifyResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Invalid or expired workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!verifyResult.data) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Invalid or expired workspace email invite code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const verifyResultData = verifyResult.data;
    const workspaceInviteEntity = verifyResultData.invite;

    const workspaceId = workspaceInviteEntity.workspaceId;
    const inviteEmail = workspaceInviteEntity.targetId;

    // Step 3: Find the user by ID to ensure that the emails match
    const userResult = await userBusinessService._findUserById(
      executionContext,
      {
        id: userId,
      }
    );

    if (!userResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _acceptWorkspaceEmailInvite :: Failed to find user by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'User not found for the provided ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    if (!userEntity) {
      logger.error(
        `${LOG_PREFIX} :: _acceptWorkspaceEmailInvite :: User not found for the provided ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'User not found for the provided ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const invitedUserEmail = userEntity.email;

    // Check if the invited user's email address matches the email of the invite
    if (invitedUserEmail !== inviteEmail) {
      logger.error(
        `${LOG_PREFIX} :: _acceptWorkspaceEmailInvite :: Invited user does not match input user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Invited user email does not match the email of the invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Accept the workspace invite
    const acceptedWorkspaceInviteEntity =
      await workspaceDataService.acceptWorkspaceInvite(inviteId);

    // Step 5: Add the user to the workspace
    const workspaceMembershipResult = await _addUserToWorkspace(
      executionContext,
      {
        workspaceId: workspaceId,
        userId: userId,
        role: ROLE.WORKSPACE_MEMBER,
        assignDefaultWorkspace: true,
      }
    );

    if (!workspaceMembershipResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _acceptWorkspaceEmailInvite :: Failed to add user to workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to add user to workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const workspaceMembershipResultData = workspaceMembershipResult.data;
    const workspaceMembership =
      workspaceMembershipResultData.workspaceMembership;

    return BusinessResult.ok({
      invite: acceptedWorkspaceInviteEntity,
      workspaceMembership: workspaceMembership,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _acceptWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Declines a workspace email invite.
 *
 * @returns The declined workspace invite if successful.
 */
export const _declineWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: DeclineWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    DeclineWorkspaceEmailInviteOutputDto,
    DeclineWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      AcceptWorkspaceEmailInviteInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const inviteId = parsedInputData.inviteId;
    const userId = parsedInputData.userId;

    // Step 2: Find the workspace invite
    const inviteResult = await _findEffectiveWorkspaceEmailInviteById(
      executionContext,
      {
        inviteId: inviteId,
      }
    );

    if (!inviteResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Invalid or expired workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!inviteResult.data) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.VALIDATION_ERROR,
        detail: 'Invalid or expired workspace email invite code',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const inviteResultData = inviteResult.data;
    const workspaceInviteEntity = inviteResultData.invite;
    const inviteEmail = workspaceInviteEntity.targetId;

    // Step 3: Find the user by ID to ensure that the emails match
    const userResult = await userBusinessService._findUserById(
      executionContext,
      {
        id: userId,
      }
    );

    if (!userResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _declineWorkspaceEmailInvite :: Failed to find user by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'User not found for the provided ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    if (!userEntity) {
      logger.error(
        `${LOG_PREFIX} :: _declineWorkspaceEmailInvite :: User not found for the provided ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'User not found for the provided ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const invitedUserEmail = userEntity.email;

    // Check if the invited user's email address matches the email of the invite
    if (invitedUserEmail !== inviteEmail) {
      logger.error(
        `${LOG_PREFIX} :: _declineWorkspaceEmailInvite :: Invited user does not match input user`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Invited user email does not match the email of the invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Decline the workspace invite
    const declinedWorkspaceInviteEntity =
      await workspaceDataService.declineWorkspaceInvite(inviteId);

    return BusinessResult.ok({
      invite: declinedWorkspaceInviteEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _declineWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Creates a workspace and assigns the provided user as a member of that workspace.
 *
 * The user is assigned the role of workspace admin, and if specified,
 * the workspace is set as the user's default workspace.
 *
 * Finally, a {@link DEFAULT_WORKSPACE_BILLING_PROVIDER billing provider} is created for the workspace.
 *
 * @returns The created workspace, the workspace membership of the member, and the billing provider.
 */
export const createWorkspaceAndMember = async (
  executionContext: ExecutionContext,
  input: CreateWorkspaceAndMemberInputDto
): Promise<
  BusinessResult<
    CreateWorkspaceAndMemberOutputDto,
    CreateWorkspaceAndMemberErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to create a workspace
    const actorCanCreateWorkspace =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: ANY_RESOURCE_ID,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_CREATE,
        }
      );

    if (!actorCanCreateWorkspace.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: createWorkspaceAndMember :: Failed to validate actor access to create workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to create workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanCreateWorkspace.data) {
      logger.warn(
        `${LOG_PREFIX} :: createWorkspaceAndMember :: Actor does not have access to create a workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to create a workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return await _createWorkspaceAndMember(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createWorkspaceAndMember :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Assigns a user's default workspace.
 *
 * @return The default workspace entity.
 */
export const assignDefaultWorkspace = async (
  executionContext: ExecutionContext,
  input: AssignDefaultWorkspaceInputDto
): Promise<
  BusinessResult<
    AssignDefaultWorkspaceOutputDto,
    AssignDefaultWorkspaceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to view the workspace
    const actorCanViewWorkspace =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_VIEW,
        }
      );

    if (!actorCanViewWorkspace.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: assignDefaultWorkspace :: Failed to validate actor access to workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanViewWorkspace.data) {
      logger.warn(
        `${LOG_PREFIX} :: assignDefaultWorkspace :: Actor does not have access to the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to the workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Validate the actor can edit the user's default workspace
    const actorCanEditUserDefaultWorkspace =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.userId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
          permission: PERMISSION.USER_EDIT,
        }
      );

    if (!actorCanEditUserDefaultWorkspace.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: assignDefaultWorkspace :: Failed to validate actor access to user default workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to user default workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanEditUserDefaultWorkspace.data) {
      logger.warn(
        `${LOG_PREFIX} :: assignDefaultWorkspace :: Actor does not have access to edit the user's default workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: `Actor does not have access to edit the user's default workspace`,
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return await _assignDefaultWorkspace(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: assignDefaultWorkspace :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Removes a user's default workspace.
 *
 * @return The default workspace entity.
 */
export const removeDefaultWorkspace = async (
  executionContext: ExecutionContext,
  input: RemoveDefaultWorkspaceInputDto
): Promise<
  BusinessResult<
    RemoveDefaultWorkspaceOutputDto,
    RemoveDefaultWorkspaceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to edit the user's default workspace
    const actorCanEditUserDefaultWorkspace =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.userId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
          permission: PERMISSION.USER_EDIT,
        }
      );

    if (!actorCanEditUserDefaultWorkspace.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: removeDefaultWorkspace :: Failed to validate actor access to user default workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to user default workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanEditUserDefaultWorkspace.data) {
      logger.warn(
        `${LOG_PREFIX} :: removeDefaultWorkspace :: Actor does not have access to edit the user's default workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: `Actor does not have access to edit the user's default workspace`,
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return await _removeDefaultWorkspace(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: removeDefaultWorkspace :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Updates a workspace's details.
 *
 * @returns The updated workspace entity.
 */
export const updateWorkspaceDetails = async (
  executionContext: ExecutionContext,
  input: UpdateWorkspaceDetailsInputDto
): Promise<BusinessResult<WorkspaceEntity, UpdateWorkspaceDetailsErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate that actor can update the workspace
    const actorCanEditWorkspaceDetails =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_EDIT,
        }
      );

    if (!actorCanEditWorkspaceDetails.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: updateWorkspaceDetails :: Failed to validate actor access to workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to workspace',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanEditWorkspaceDetails.data) {
      logger.warn(
        `${LOG_PREFIX} :: updateWorkspaceDetails :: Actor does not have access to edit the workspace`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: `Actor does not have access to edit the workspace`,
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return _updateWorkspaceDetails(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: updateWorkspaceDetails :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds a workspace checkout session by its ID.
 *
 * @returns The checkout session information, or null if not found.
 */
export const findWorkspaceCheckoutSessionById = async (
  executionContext: ExecutionContext,
  input: FindWorkspaceCheckoutSessionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindWorkspaceCheckoutSessionByIdOutputDto>,
    FindWorkspaceCheckoutSessionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to view a checkout session
    const actorCanViewCheckoutSession =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_BILLING_MANAGE,
        }
      );

    if (!actorCanViewCheckoutSession.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findWorkspaceCheckoutSessionById :: Failed to validate actor access to view checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to view checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanViewCheckoutSession.data) {
      logger.warn(
        `${LOG_PREFIX} :: findWorkspaceCheckoutSessionById :: Actor does not have access to view checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to view checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return await _findWorkspaceCheckoutSessionById(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findWorkspaceCheckoutSessionById :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Creates a checkout session for an access subscription.
 *
 * @returns The result of the checkout session creation.
 */
export const createAccessSubscriptionCheckoutSession = async (
  executionContext: ExecutionContext,
  input: CreateAccessSubscriptionCheckoutSessionInputDto
): Promise<
  BusinessResult<
    CreateAccessSubscriptionCheckoutSessionOutputDto,
    CreateAccessSubscriptionCheckoutSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to create a checkout session
    const actorCanCreateCheckoutSession =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_BILLING_MANAGE,
        }
      );

    if (!actorCanCreateCheckoutSession.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: createAccessSubscriptionCheckoutSession :: Failed to validate actor access to create checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to create checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanCreateCheckoutSession.data) {
      logger.warn(
        `${LOG_PREFIX} :: createAccessSubscriptionCheckoutSession :: Actor does not have access to create checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to create checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Create the checkout session
    return await _createAccessSubscriptionCheckoutSession(
      executionContext,
      input
    );
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createAccessSubscriptionCheckoutSession :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Cancels an access subscription at the end of the billing period.
 *
 * @returns The cancelled access subscription.
 */
export const cancelAccessSubscriptionAtPeriodEnd = async (
  executionContext: ExecutionContext,
  input: CancelAccessSubscriptionAtPeriodEndInputDto
): Promise<
  BusinessResult<
    CancelAccessSubscriptionAtPeriodEndOutputDto,
    CancelAccessSubscriptionAtPeriodEndErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to cancel the subscription
    const actorCanCancelSubscription =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_BILLING_MANAGE,
        }
      );

    if (!actorCanCancelSubscription.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: cancelAccessSubscriptionAtPeriodEnd :: Failed to validate actor access to cancel subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to cancel subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanCancelSubscription.data) {
      logger.warn(
        `${LOG_PREFIX} :: cancelAccessSubscriptionAtPeriodEnd :: Actor does not have access to cancel subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to cancel subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Cancel the subscription
    return await _cancelAccessSubscriptionAtPeriodEnd(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: cancelAccessSubscriptionAtPeriodEnd :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Resumes a cancelled access subscription.
 *
 * @returns The resumed access subscription.
 */
export const resumeCancelledAccessSubscription = async (
  executionContext: ExecutionContext,
  input: ResumeCancelledAccessSubscriptionInputDto
): Promise<
  BusinessResult<
    ResumeCancelledAccessSubscriptionOutputDto,
    ResumeCancelledAccessSubscriptionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to resume the subscription
    const actorCanResumeSubscription =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_BILLING_MANAGE,
        }
      );

    if (!actorCanResumeSubscription.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: resumeCancelledAccessSubscription :: Failed to validate actor access to resume subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to resume subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanResumeSubscription.data) {
      logger.warn(
        `${LOG_PREFIX} :: resumeCancelledAccessSubscription :: Actor does not have access to resume subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to resume subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Resume the subscription
    return await _resumeCancelledAccessSubscription(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: resumeCancelledAccessSubscription :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Creates a payment method management session.
 *
 * @returns The payment method management session.
 */
export const createPaymentMethodManagementSession = async (
  executionContext: ExecutionContext,
  input: CreatePaymentMethodManagementSessionInputDto
): Promise<
  BusinessResult<
    CreatePaymentMethodManagementSessionOutputDto,
    CreatePaymentMethodManagementSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to manage payment methods
    const actorCanManagePaymentMethods =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_BILLING_MANAGE,
        }
      );

    if (!actorCanManagePaymentMethods.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: createPaymentMethodManagementSession :: Failed to validate actor access to manage payment methods`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to manage payment methods',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanManagePaymentMethods.data) {
      logger.warn(
        `${LOG_PREFIX} :: createPaymentMethodManagementSession :: Actor does not have access to manage payment methods`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to manage payment methods',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Create the payment method management session
    return await _createPaymentMethodManagementSession(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createPaymentMethodManagementSession :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Changes the access subscription plan for a workspace.
 *
 * @returns The updated access subscription.
 */
export const changeAccessSubscriptionPlan = async (
  executionContext: ExecutionContext,
  input: ChangeAccessSubscriptionPlanInputDto
): Promise<
  BusinessResult<
    ChangeAccessSubscriptionPlanOutputDto,
    ChangeAccessSubscriptionPlanErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to change the subscription plan
    const actorCanChangeSubscriptionPlan =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_BILLING_MANAGE,
        }
      );

    if (!actorCanChangeSubscriptionPlan.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: changeAccessSubscriptionPlan :: Failed to validate actor access to change subscription plan`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to change subscription plan',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanChangeSubscriptionPlan.data) {
      logger.warn(
        `${LOG_PREFIX} :: changeAccessSubscriptionPlan :: Actor does not have access to change subscription plan`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to change subscription plan',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Change the subscription plan
    return await _changeAccessSubscriptionPlan(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: changeAccessSubscriptionPlan :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Cursor paginates workspace email invites by workspace ID.
 *
 * @returns The paginated workspace email invites.
 */
export const cursorPaginateWorkspaceEmailInvitesByWorkspaceId = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceEmailInvitesByWorkspaceIdInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceEmailInvitesOutputDto,
    CursorPaginateWorkspaceEmailInvitesErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to view email invites
    const actorCanChangeSubscriptionPlan =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_EMAIL_INVITE_VIEW,
        }
      );

    if (!actorCanChangeSubscriptionPlan.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: cursorPaginateWorkspaceEmailInvitesByWorkspaceId :: Failed to validate actor access to view email invites`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to validate actor access to view email invites',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!actorCanChangeSubscriptionPlan.data) {
      logger.warn(
        `${LOG_PREFIX} :: cursorPaginateWorkspaceEmailInvitesByWorkspaceId :: Actor does not have access to view email invites`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have access to view email invites',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Paginate the email invites
    return await _cursorPaginateWorkspaceEmailInvitesByWorkspaceId(
      executionContext,
      input
    );
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: cursorPaginateWorkspaceEmailInvitesByWorkspaceId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Sends multiple workspace email invites.
 *
 * @returns A list of results for sending email invites.
 */
export const sendWorkspaceEmailInvites = async (
  executionContext: ExecutionContext,
  inputs: SendWorkspaceEmailInviteInputDto[]
): Promise<
  BusinessResult<
    SendWorkspaceEmailInviteOutputDto[],
    SendWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to send email invites for the workspaces
    const accessValidationErrors: SendWorkspaceEmailInviteErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        const workspaceId = input.workspaceId;

        const validationResult =
          await authorizationBusinessService.validatorActorAccess(
            executionContext,
            {
              resourceId: workspaceId,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
              permission: PERMISSION.WORKSPACE_EMAIL_INVITE_CREATE,
            }
          );

        if (!validationResult.isSuccess()) {
          logger.error(
            `${LOG_PREFIX} :: sendWorkspaceEmailInvites :: Failed to validate actor access to send email invites`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
            detail: 'Failed to validate actor access to send email invites',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }

        if (!validationResult.data) {
          logger.warn(
            `${LOG_PREFIX} :: sendWorkspaceEmailInvites :: Actor does not have access to send email invites`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
            detail: 'Actor does not have access to send email invites',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }
      })
    );

    // Step 2: If there are access validation errors, return them
    if (accessValidationErrors.length) {
      return BusinessResult.fail(...accessValidationErrors);
    }

    // Step 3: Send the email invites
    return await _sendWorkspaceEmailInvites(executionContext, inputs);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: sendWorkspaceEmailInvites :: An unknown error occurred`,
      injectExceptionDetails(error, {
        inputs: inputs,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * Expires multiple workspace email invites.
 *
 * @returns A list of results for expiring email invites.
 */
export const expireWorkspaceEmailInvites = async (
  executionContext: ExecutionContext,
  inputs: ExpireWorkspaceEmailInviteInputDto[]
): Promise<
  BusinessResult<
    ExpireWorkspaceEmailInviteOutputDto[],
    ExpireWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to expire email invites for the workspaces
    const accessValidationErrors: ExpireWorkspaceEmailInviteErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        const workspaceId = input.workspaceId;

        const validationResult =
          await authorizationBusinessService.validatorActorAccess(
            executionContext,
            {
              resourceId: workspaceId,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
              permission: PERMISSION.WORKSPACE_EMAIL_INVITE_DELETE,
            }
          );

        if (!validationResult.isSuccess()) {
          logger.error(
            `${LOG_PREFIX} :: expireWorkspaceEmailInvites :: Failed to validate actor access to expire email invites`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
            detail: 'Failed to validate actor access to expire email invites',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }

        if (!validationResult.data) {
          logger.warn(
            `${LOG_PREFIX} :: expireWorkspaceEmailInvites :: Actor does not have access to expire email invites`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
            detail: 'Actor does not have access to expire email invites',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }
      })
    );

    // Step 2: If there are access validation errors, return them
    if (accessValidationErrors.length) {
      return BusinessResult.fail(...accessValidationErrors);
    }

    // Step 3: Expire the email invites
    return await _expireWorkspaceEmailInvites(executionContext, inputs);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: expireWorkspaceEmailInvites :: An unknown error occurred`,
      injectExceptionDetails(error, {
        inputs: inputs,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * Accepts a workspace email invite.
 *
 * @returns The accepted workspace invite and the workspace membership if successful.
 */
export const acceptWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: AcceptWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    AcceptWorkspaceEmailInviteOutputDto,
    AcceptWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to access the user
    const validationResult =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.userId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
          permission: PERMISSION.USER_VIEW,
        }
      );

    if (!validationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: acceptWorkspaceEmailInvite :: Failed to validate actor permission to accept the workspace email invite`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to validate actor permission to accept the workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!validationResult.data) {
      logger.warn(
        `${LOG_PREFIX} :: acceptWorkspaceEmailInvite :: Actor does not have permission to accept the workspace email invite`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail:
          'Actor does not have permission to accept the workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Accept the invite
    return _acceptWorkspaceEmailInvite(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: acceptWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Declines a workspace email invite.
 *
 * @returns The declined workspace invite if successful.
 */
export const declineWorkspaceEmailInvite = async (
  executionContext: ExecutionContext,
  input: DeclineWorkspaceEmailInviteInputDto
): Promise<
  BusinessResult<
    DeclineWorkspaceEmailInviteOutputDto,
    DeclineWorkspaceEmailInviteErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to access the user
    const validationResult =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.userId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
          permission: PERMISSION.USER_VIEW,
        }
      );

    if (!validationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: declineWorkspaceEmailInvite :: Failed to validate actor permission to decline the workspace email invite`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to validate actor permission to decline the workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!validationResult.data) {
      logger.warn(
        `${LOG_PREFIX} :: declineWorkspaceEmailInvite :: Actor does not have permission to decline the workspace email invite`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail:
          'Actor does not have permission to decline the workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Decline the invite
    return _declineWorkspaceEmailInvite(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: declineWorkspaceEmailInvite :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Finds an effective workspace email invite and relevant metadata by Code and User ID.
 *
 * @returns The effective workspace invite if found along with relevant metadata on the invitation, or null if not found.
 */
export const findEffectiveWorkspaceEmailInviteByCodeAndUserId = async (
  executionContext: ExecutionContext,
  input: FindEffectiveWorkspaceEmailInviteByCodeAndUserIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindEffectiveWorkspaceEmailInviteByCodeAndUserIdOutputDto>,
    FindEffectiveWorkspaceEmailInviteByCodeAndUserIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to access the user
    const validationResult =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.userId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.USER,
          permission: PERMISSION.USER_VIEW,
        }
      );

    if (!validationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findEffectiveWorkspaceEmailInviteByCodeAndUserId :: Failed to validate actor permission to view the workspace email invite`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to validate actor permission to view the workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!validationResult.data) {
      logger.warn(
        `${LOG_PREFIX} :: findEffectiveWorkspaceEmailInviteByCodeAndUserId :: Actor does not have permission to view the workspace email invite`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail:
          'Actor does not have permission to view the workspace email invite',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Find the effective workspace email invite
    return _findEffectiveWorkspaceEmailInviteByCodeAndUserId(
      executionContext,
      input
    );
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findEffectiveWorkspaceEmailInviteByCodeAndUserId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Cursor paginates workspace memberships by workspace ID.
 *
 * @returns The paginated workspace memberships.
 */
export const cursorPaginateWorkspaceMembershipsByWorkspaceId = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceMembershipsByWorkspaceIdInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceMembershipsOutputDto,
    CursorPaginateWorkspaceMembershipsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to access the workspace
    const validationResult =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_MEMBER_VIEW,
        }
      );

    if (!validationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: cursorPaginateWorkspaceMembershipsByWorkspaceId :: Failed to validate actor permission to view the workspace memberships`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to validate actor permission to view the workspace memberships',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!validationResult.data) {
      logger.warn(
        `${LOG_PREFIX} :: cursorPaginateWorkspaceMembershipsByWorkspaceId :: Actor does not have permission to view the workspace memberships`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail:
          'Actor does not have permission to view the workspace memberships',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Cursor paginate the workspace memberships
    return _cursorPaginateWorkspaceMembershipsByWorkspaceId(
      executionContext,
      input
    );
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: cursorPaginateWorkspaceMembershipsByWorkspaceId :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};

/**
 * Removes multiple workspace memberships.
 *
 * @returns A list of results for removing workspace memberships.
 */
export const removeWorkspaceMemberships = async (
  executionContext: ExecutionContext,
  inputs: RemoveWorkspaceMembershipInputDto[]
): Promise<
  BusinessResult<
    RemoveWorkspaceMembershipOutputDto[],
    RemoveWorkspaceMembershipErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to remove members from the workspace
    const accessValidationErrors: RemoveWorkspaceMembershipErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        const workspaceId = input.workspaceId;

        const validationResult =
          await authorizationBusinessService.validatorActorAccess(
            executionContext,
            {
              resourceId: workspaceId,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
              permission: PERMISSION.WORKSPACE_MEMBER_DELETE,
            }
          );

        if (!validationResult.isSuccess()) {
          logger.error(
            `${LOG_PREFIX} :: removeWorkspaceMemberships :: Failed to validate actor permission to remove workspace memberships`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
            detail:
              'Failed to validate actor permission to remove workspace memberships',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }

        if (!validationResult.data) {
          logger.warn(
            `${LOG_PREFIX} :: removeWorkspaceMemberships :: Actor does not have permission to remove workspace memberships`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
            detail:
              'Actor does not have permission to remove workspace memberships',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }
      })
    );

    // Step 2: If there are access validation errors, return them
    if (accessValidationErrors.length) {
      return BusinessResult.fail(...accessValidationErrors);
    }

    // Step 3: Remove the workspace memberships
    return await _removeWorkspaceMemberships(executionContext, inputs);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: removeWorkspaceMemberships :: An unknown error occurred`,
      injectExceptionDetails(error, {
        inputs: inputs,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * Updates multiple workspace member roles.
 *
 * @returns A list of results for updating workspace member roles.
 */
export const updateWorkspaceMemberRoles = async (
  executionContext: ExecutionContext,
  inputs: UpdateWorkspaceMemberRoleInputDto[]
): Promise<
  BusinessResult<
    UpdateWorkspaceMemberRoleOutputDto[],
    UpdateWorkspaceMemberRoleErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to update member roles
    const accessValidationErrors: UpdateWorkspaceMemberRoleErrorDto[] = [];

    await Promise.all(
      inputs.map(async (input) => {
        const workspaceId = input.workspaceId;

        const validationResult =
          await authorizationBusinessService.validatorActorAccess(
            executionContext,
            {
              resourceId: workspaceId,
              resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
              permission: PERMISSION.WORKSPACE_MEMBER_ROLE_CHANGE,
            }
          );

        if (!validationResult.isSuccess()) {
          logger.error(
            `${LOG_PREFIX} :: updateWorkspaceMemberRoles :: Failed to validate actor permission to update workspace member roles`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
            detail:
              'Failed to validate actor permission to update workspace member roles',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }

        if (!validationResult.data) {
          logger.warn(
            `${LOG_PREFIX} :: updateWorkspaceMemberRoles :: Actor does not have permission to update workspace member roles`,
            {
              input: input,
              context: loggingContext,
            }
          );
          return accessValidationErrors.push({
            code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
            detail:
              'Actor does not have permission to update workspace member roles',
            metadata: {
              input: input,
              context: executionContext,
            },
          });
        }
      })
    );

    // Step 2: If there are access validation errors, return them
    if (accessValidationErrors.length) {
      return BusinessResult.fail(...accessValidationErrors);
    }

    // Step 3: Update the workspace member roles
    return await _updateWorkspaceMemberRoles(executionContext, inputs);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: updateWorkspaceMemberRoles :: An unknown error occurred`,
      injectExceptionDetails(error, {
        inputs: inputs,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
    });
  }
};

/**
 * Cursor paginates workspace invoices.
 *
 * @returns The paginated workspace invoices.
 */
export const cursorPaginateWorkspaceInvoices = async (
  executionContext: ExecutionContext,
  input: CursorPaginateWorkspaceInvoicesInputDto
): Promise<
  BusinessResult<
    CursorPaginateWorkspaceInvoicesOutputDto,
    CursorPaginateWorkspaceInvoicesErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate the actor's ability to access the workspace
    const validationResult =
      await authorizationBusinessService.validatorActorAccess(
        executionContext,
        {
          resourceId: input.workspaceId,
          resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          permission: PERMISSION.WORKSPACE_INVOICE_VIEW,
        }
      );

    if (!validationResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: cursorPaginateWorkspaceInvoices :: Failed to validate actor permission to view the workspace invoices`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to validate actor permission to view the workspace invoices',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (!validationResult.data) {
      logger.warn(
        `${LOG_PREFIX} :: cursorPaginateWorkspaceInvoices :: Actor does not have permission to view the workspace invoices`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor does not have permission to view the workspace invoices',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 2: Cursor paginate the workspace invoices
    return _cursorPaginateWorkspaceInvoices(executionContext, input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: cursorPaginateWorkspaceInvoices :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input: input,
        context: executionContext,
      },
    });
  }
};
