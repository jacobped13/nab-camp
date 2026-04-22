import {
  ACTOR_TYPE,
  BusinessResult,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  Nullable,
  RESULT_ERROR_CODE,
} from '@common';
import { FindAccountByActorErrorDto } from './helper/account.business.dto';
import {
  Account,
  AccountWorkspaceDetails,
} from './helper/account.business.model';
import { userBusinessService } from '@service/user';
import { workspaceBusinessService } from '@service/workspace';
import { AccountDataFactory } from './helper/account.business.util';
import {
  AUTHORIZATION_RESOURCE_TYPE,
  authorizationBusinessService,
  DEFAULT_WORKSPACE_PERMISSIONS,
  toWorkspacePermissionDto,
  WorkspacePermissionDto,
} from '@service/authorization';

const LOG_PREFIX = 'Service :: Account :: AccountBusinessService';

/**
 * Finds an account by the actor.
 *
 * @returns The details of the account associated with the actor.
 */
export const findActorAccount = async (
  executionContext: ExecutionContext
): Promise<BusinessResult<Account, FindAccountByActorErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    switch (executionContext.actor.type) {
      case ACTOR_TYPE.USER: {
        return await findUserActorAccount(executionContext);
      }
      // If the actor is not supported, return default account data.
      default: {
        return BusinessResult.ok(AccountDataFactory.withDefault());
      }
    }
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findActorAccount :: An unknown error occurred`,
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
 * Finds an account by a user actor.
 *
 * @returns The details of the account associated with the user actor.
 */
export const findUserActorAccount = async (
  executionContext: ExecutionContext
): Promise<BusinessResult<Account, FindAccountByActorErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Ensure the actor is a user
    if (!executionContext.isUserActor()) {
      logger.warn(
        `${LOG_PREFIX} :: findUserActorAccount :: Actor is not a user`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.PERMISSION_DENIED_ERROR,
        detail: 'Actor is not a user',
        metadata: {
          context: executionContext,
        },
      });
    }

    const userId = executionContext.actor.id;

    // Step 2: Retrieve the account details by the user actor ID
    const userResult = await userBusinessService._findUserById(
      executionContext,
      {
        id: userId,
      }
    );

    if (!userResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findUserActorAccount :: Failed to find user by ID`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find user by ID',
        metadata: {
          context: executionContext,
        },
      });
    }

    const userEntity = userResult.data;

    // If a user does not exist, exit early with default account data
    if (!userEntity) {
      return BusinessResult.ok(AccountDataFactory.withDefault());
    }

    // Step 3: Find the workspace and workspace membership for the user
    const workspacesResult =
      await workspaceBusinessService._findAllWorkspacesAndMembershipsByUserId(
        executionContext,
        {
          userId: userId,
        }
      );

    if (!workspacesResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findUserActorAccount :: Failed to find workspaces and memberships by user`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspaces and memberships by user',
        metadata: {
          context: executionContext,
        },
      });
    }

    const workspacesData = workspacesResult.data;
    const workspaceGroups = workspacesData.workspaces;
    const workspaceIds = workspaceGroups.map(
      (workspaceGroup) => workspaceGroup.workspace.id
    );

    // Step 4: Find the access subscriptions for the workspaces
    const accessSubscriptionsResult =
      await workspaceBusinessService._findAllAccessSubscriptionsByWorkspaceIds(
        executionContext,
        {
          workspaceIds: workspaceIds,
        }
      );

    if (!accessSubscriptionsResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findUserActorAccount :: Failed to find access subscriptions for workspaces`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find access subscriptions for workspaces',
        metadata: {
          context: executionContext,
        },
      });
    }

    const accessSubscriptionResultData = accessSubscriptionsResult.data;
    const accessSubscriptionMap = accessSubscriptionResultData.subscriptionMap;

    // Step 5: Find the owners for each workspace
    const ownersResult =
      await workspaceBusinessService._findAllWorkspaceOwnersByWorkspaceIds(
        executionContext,
        {
          workspaceIds: workspaceIds,
        }
      );

    if (!ownersResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: findUserActorAccount :: Failed to find workspace owners by workspace IDs`,
        {
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find workspace owners by workspace IDs',
        metadata: {
          context: executionContext,
        },
      });
    }

    const ownersData = ownersResult.data;
    const ownerMap = ownersData.ownerMap;

    // Step 6: Find the default workspace and available workspaces
    let defaultWorkspace: Nullable<AccountWorkspaceDetails> = null;
    const availableWorkspaces: AccountWorkspaceDetails[] = [];

    for (const workspaceGroup of workspaceGroups) {
      const workspace = workspaceGroup.workspace;
      const membership = workspaceGroup.workspaceMembership;
      const subscription = accessSubscriptionMap.get(workspace.id) ?? null;
      const owner = ownerMap.get(workspace.id) ?? null;

      const workspaceDetails: AccountWorkspaceDetails = {
        workspace: workspace,
        membership: membership,
        subscription: subscription,
        owner: owner,
      };

      if (workspaceGroup.isDefault) {
        defaultWorkspace = workspaceDetails;
      } else {
        availableWorkspaces.push(workspaceDetails);
      }
    }

    // Step 7: Find the permissions for the default workspace
    let defaultWorkspacePermissions: WorkspacePermissionDto =
      DEFAULT_WORKSPACE_PERMISSIONS;

    if (defaultWorkspace) {
      const defaultWorkspaceId = defaultWorkspace.workspace.id;

      const workspacePermissionResult =
        await authorizationBusinessService.findActorResourcePermissions(
          executionContext,
          {
            resourceId: defaultWorkspaceId,
            resourceType: AUTHORIZATION_RESOURCE_TYPE.WORKSPACE,
          }
        );

      if (!workspacePermissionResult.isSuccess()) {
        logger.error(
          `${LOG_PREFIX} :: findUserActorAccount :: Failed to find default workspace permissions`,
          {
            context: loggingContext,
          }
        );
        return BusinessResult.fail({
          code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
          detail: 'Failed to find default workspace permissions',
          metadata: {
            context: executionContext,
          },
        });
      }

      const workspacePermissionResultData = workspacePermissionResult.data;
      const permissions = toWorkspacePermissionDto(
        workspacePermissionResultData.permissions
      );

      defaultWorkspacePermissions = permissions;
    }

    return BusinessResult.ok(
      AccountDataFactory.with({
        user: userEntity,
        defaultWorkspace: defaultWorkspace,
        availableWorkspaces: availableWorkspaces,
        permissions: defaultWorkspacePermissions,
      })
    );
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: findUserActorAccount :: An unknown error occurred`,
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
