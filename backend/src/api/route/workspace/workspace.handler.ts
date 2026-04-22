import {
  HTTP_STATUS_CODE,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  createHandler,
  HTTPException,
  InternalServerErrorException,
  transformResultErrorCodeToHTTPStatusCode,
  ACTOR_TYPE,
  getReasonPhrase,
  NotFoundException,
} from '@common';
import { zodValidationMiddleware } from '@api/middleware/zod-validation.middleware';
import { actorMiddleware } from '@api/middleware/actor.middleware';
import {
  mapWorkspaceResponse,
  mapWorkspaceMemberResponse,
  mapWorkspaceAccessSubscriptionResponse,
  transformOrThrowWorkspaceEmailInviteSort,
  mapWorkspaceEmailInviteResponse,
  transformOrThrowWorkspaceMemberSort,
  transformOrThrowWorkspaceMemberRoleToRole,
} from './helper/workspace.util';
import {
  AcceptWorkspaceEmailInviteResponseBody,
  CreateDocumentFileUploadUrlsResponseBody,
  CreateDocumentFileUploadUrlsResponseData,
  CreateDocumentFileUploadUrlsResponseError,
  DeclineWorkspaceEmailInviteResponseBody,
  ExpireWorkspaceEmailInvitesResponseBody,
  ExpireWorkspaceEmailInvitesResponseError,
  FindWorkspaceEmailInviteByCodeResponseBody,
  RemoveWorkspaceMembersResponseBody,
  RemoveWorkspaceMembersResponseError,
  SendBusinessContactResponseBody,
  SendWorkspaceEmailInvitesResponseBody,
  SendWorkspaceEmailInvitesResponseData,
  SendWorkspaceEmailInvitesResponseError,
  UpdateWorkspaceMemberRolesResponseBody,
  UpdateWorkspaceMemberRolesResponseError,
  Workspace,
  WorkspaceAccessSubscription,
  WorkspaceEmailInvite,
  WorkspaceMember,
} from '@api-contracts/workspace';
import { BillingManagementSession, Invoice } from '@api-contracts/billing';
import {
  AcceptWorkspaceEmailInviteRequestParamSchema,
  AcceptWorkspaceEmailInviteResponse,
  AssignDefaultWorkspaceRequestBodySchema,
  AssignDefaultWorkspaceResponse,
  CancelWorkspaceAccessSubscriptionRequestParamSchema,
  CancelWorkspaceAccessSubscriptionResponse,
  ChangeWorkspaceAccessSubscriptionPlanRequestBodySchema,
  ChangeWorkspaceAccessSubscriptionPlanRequestParamSchema,
  ChangeWorkspaceAccessSubscriptionPlanResponse,
  CreateDocumentFileUploadUrlsRequestBodySchema,
  CreateDocumentFileUploadUrlsRequestParamSchema,
  CreateDocumentFileUploadUrlsResponse,
  CreateWorkspacePaymentMethodManagementSessionRequestBodySchema,
  CreateWorkspacePaymentMethodManagementSessionRequestParamSchema,
  CreateWorkspacePaymentMethodManagementSessionResponse,
  CreateWorkspaceRequestBodySchema,
  CreateWorkspaceResponse,
  DeclineWorkspaceEmailInviteRequestParamSchema,
  DeclineWorkspaceEmailInviteResponse,
  ExpireWorkspaceEmailInvitesRequestBodySchema,
  ExpireWorkspaceEmailInvitesRequestParamSchema,
  ExpireWorkspaceEmailInvitesResponse,
  FindWorkspaceEmailInviteByCodeRequestParamSchema,
  FindWorkspaceEmailInviteByCodeResponse,
  FindWorkspaceEmailInvitesRequestParamSchema,
  FindWorkspaceEmailInvitesRequestQuerySchema,
  FindWorkspaceEmailInvitesResponse,
  FindWorkspaceInvoicesRequestParamSchema,
  FindWorkspaceInvoicesRequestQuerySchema,
  FindWorkspaceInvoicesResponse,
  FindWorkspaceMembersRequestParamSchema,
  FindWorkspaceMembersRequestQuerySchema,
  FindWorkspaceMembersResponse,
  ProcessDocumentFileRequestBodySchema,
  ProcessDocumentFileRequestParamSchema,
  ProcessDocumentFileResponse,
  RemoveDefaultWorkspaceResponse,
  RemoveWorkspaceMembersRequestBodySchema,
  RemoveWorkspaceMembersRequestParamSchema,
  RemoveWorkspaceMembersResponse,
  ResumeCancelledWorkspaceAccessSubscriptionRequestParamSchema,
  ResumeCancelledWorkspaceAccessSubscriptionResponse,
  SendBusinessContactRequestBodySchema,
  SendBusinessContactResponse,
  SendWorkspaceEmailInvitesRequestBodySchema,
  SendWorkspaceEmailInvitesRequestParamSchema,
  SendWorkspaceEmailInvitesResponse,
  UpdateWorkspaceMemberRolesRequestBodySchema,
  UpdateWorkspaceMemberRolesRequestParamSchema,
  UpdateWorkspaceMemberRolesResponse,
  UpdateWorkspaceRequestBodySchema,
  UpdateWorkspaceRequestParamSchema,
  UpdateWorkspaceResponse,
} from './helper/workspace.dto';
import { workspaceBusinessService } from '@service/workspace';
import {
  mapBillingManagementSessionResponse,
  mapInvoiceResponse,
} from '../billing/helper/billing.util';
import { APP_PATH } from '@lib/util/url.util';
import { documentBusinessService } from '@service/document';
import {
  DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_LIMIT,
  DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_PAGINATION_DIRECTION,
  DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_SORT_DIRECTION,
  DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_SORT_FIELD,
  DEFAULT_WORKSPACE_INVOICE_FILTER_STATUSES,
  DEFAULT_WORKSPACE_INVOICE_QUERY_LIMIT,
  DEFAULT_WORKSPACE_INVOICE_QUERY_PAGINATION_DIRECTION,
  DEFAULT_WORKSPACE_MEMBER_QUERY_LIMIT,
  DEFAULT_WORKSPACE_MEMBER_QUERY_PAGINATION_DIRECTION,
  DEFAULT_WORKSPACE_MEMBER_QUERY_SORT_DIRECTION,
  DEFAULT_WORKSPACE_MEMBER_QUERY_SORT_FIELD,
} from './helper/workspace.constant';
import { sendBusinessContactToSlack } from '@lib/provider/messaging/slack/slack.service';
import { isDevelopmentEnvironment } from '@env';

const LOG_PREFIX = 'API :: Workspace :: WorkspaceHandler';

// -----------------------------------------------------------------
// Create Workspace
// -----------------------------------------------------------------

export const createWorkspace = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('json', CreateWorkspaceRequestBodySchema),
  async (requestContext): Promise<CreateWorkspaceResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');
      const workspaceName = parsedInput.name;
      const workspaceUrl = parsedInput.url ?? undefined;

      const userId = executionContext.actor.id;
      const billingEmail = executionContext.account?.user?.email ?? '';

      const workspaceResult =
        await workspaceBusinessService.createWorkspaceAndMember(
          executionContext,
          {
            billingEmail: billingEmail,
            userId: userId,
            workspaceName: workspaceName,
            workspaceUrl: workspaceUrl,
            assignDefaultWorkspace: true,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace to be created.
      if (!workspaceResult.isSuccess()) {
        const primaryError = workspaceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceResponse = mapWorkspaceResponse(
        workspaceResult.data.workspace
      ) as Workspace;

      const workspaceMemberResponse = mapWorkspaceMemberResponse(
        workspaceResult.data.workspaceMembership
      ) as WorkspaceMember;

      return requestContext.json(
        {
          workspace: workspaceResponse,
          workspaceMember: workspaceMemberResponse,
        },
        HTTP_STATUS_CODE.CREATED
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: createWorkspace :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Assign Default Workspace
// -----------------------------------------------------------------

export const assignDefaultWorkspace = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('json', AssignDefaultWorkspaceRequestBodySchema),
  async (requestContext): Promise<AssignDefaultWorkspaceResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');

      const workspaceResult =
        await workspaceBusinessService.assignDefaultWorkspace(
          executionContext,
          {
            userId: executionContext.actor.id,
            workspaceId: parsedInput.workspaceId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace to be created.
      if (!workspaceResult.isSuccess()) {
        const primaryError = workspaceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceResponse = mapWorkspaceResponse(
        workspaceResult.data.workspace
      ) as Workspace;

      return requestContext.json(
        {
          workspace: workspaceResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: assignDefaultWorkspace :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Remove Default Workspace
// -----------------------------------------------------------------

export const removeDefaultWorkspace = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  async (requestContext): Promise<RemoveDefaultWorkspaceResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const workspaceResult =
        await workspaceBusinessService.removeDefaultWorkspace(
          executionContext,
          {
            userId: executionContext.actor.id,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace to be removed.
      if (!workspaceResult.isSuccess()) {
        const primaryError = workspaceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceResponse = mapWorkspaceResponse(
        workspaceResult.data.workspace
      ) as Workspace;

      return requestContext.json(
        {
          workspace: workspaceResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: removeDefaultWorkspace :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Update Workspace
// -----------------------------------------------------------------

export const updateWorkspace = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', UpdateWorkspaceRequestParamSchema),
  zodValidationMiddleware('json', UpdateWorkspaceRequestBodySchema),
  async (requestContext): Promise<UpdateWorkspaceResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const workspaceResult =
        await workspaceBusinessService.updateWorkspaceDetails(
          executionContext,
          {
            workspaceId: parsedParams.id,
            workspaceName: parsedInput.name,
            workspaceUrl: parsedInput.url,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace to be edited.
      if (!workspaceResult.isSuccess()) {
        const primaryError = workspaceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceResponse = mapWorkspaceResponse(
        workspaceResult.data
      ) as Workspace;

      return requestContext.json(
        {
          workspace: workspaceResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: updateWorkspace :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Cancel Workspace Access Subscription
// -----------------------------------------------------------------

export const cancelWorkspaceAccessSubscription = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    CancelWorkspaceAccessSubscriptionRequestParamSchema
  ),
  async (
    requestContext
  ): Promise<CancelWorkspaceAccessSubscriptionResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const workspaceId = parsedParams.id;

      const workspaceResult =
        await workspaceBusinessService.cancelAccessSubscriptionAtPeriodEnd(
          executionContext,
          {
            workspaceId: workspaceId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace to be edited.
      if (!workspaceResult.isSuccess()) {
        const primaryError = workspaceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const subscriptionResponse = mapWorkspaceAccessSubscriptionResponse(
        workspaceResult.data.subscription
      ) as WorkspaceAccessSubscription;

      return requestContext.json(
        {
          subscription: subscriptionResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: cancelWorkspaceAccessSubscription :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Resume Cancelled Workspace Access Subscription
// -----------------------------------------------------------------

export const resumeCancelledWorkspaceAccessSubscription = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    ResumeCancelledWorkspaceAccessSubscriptionRequestParamSchema
  ),
  async (
    requestContext
  ): Promise<ResumeCancelledWorkspaceAccessSubscriptionResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const workspaceId = parsedParams.id;

      const workspaceResult =
        await workspaceBusinessService.resumeCancelledAccessSubscription(
          executionContext,
          {
            workspaceId: workspaceId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace to be edited.
      if (!workspaceResult.isSuccess()) {
        const primaryError = workspaceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const subscriptionResponse = mapWorkspaceAccessSubscriptionResponse(
        workspaceResult.data.subscription
      ) as WorkspaceAccessSubscription;

      return requestContext.json(
        {
          subscription: subscriptionResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: resumeCancelledWorkspaceAccessSubscription :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Create Workspace Payment Method Management Session
// -----------------------------------------------------------------

export const createWorkspacePaymentMethodManagementSession = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    CreateWorkspacePaymentMethodManagementSessionRequestParamSchema
  ),
  zodValidationMiddleware(
    'json',
    CreateWorkspacePaymentMethodManagementSessionRequestBodySchema
  ),
  async (
    requestContext
  ): Promise<CreateWorkspacePaymentMethodManagementSessionResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const parsedInput = requestContext.req.valid('json');

      const workspaceId = parsedParams.id;
      const returnPath = parsedInput.returnPath;

      const sessionResult =
        await workspaceBusinessService.createPaymentMethodManagementSession(
          executionContext,
          {
            workspaceId: workspaceId,
            returnPath: returnPath as APP_PATH,
          }
        );

      // Check if the result is successful without ANY errors.
      if (!sessionResult.isSuccess()) {
        const primaryError = sessionResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const sessionResponse = mapBillingManagementSessionResponse(
        sessionResult.data.session
      ) as BillingManagementSession;

      return requestContext.json(
        {
          session: sessionResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: createWorkspacePaymentMethodManagementSession :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Change Workspace Access Subscription Plan
// -----------------------------------------------------------------

export const changeWorkspaceAccessSubscriptionPlan = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    ChangeWorkspaceAccessSubscriptionPlanRequestParamSchema
  ),
  zodValidationMiddleware(
    'json',
    ChangeWorkspaceAccessSubscriptionPlanRequestBodySchema
  ),
  async (
    requestContext
  ): Promise<ChangeWorkspaceAccessSubscriptionPlanResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const planId = parsedInput.planId;

      const subscriptionResult =
        await workspaceBusinessService.changeAccessSubscriptionPlan(
          executionContext,
          {
            workspaceId: workspaceId,
            planId: planId,
          }
        );

      // Check if the result is successful without ANY errors.
      if (!subscriptionResult.isSuccess()) {
        const primaryError = subscriptionResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const subscriptionResponse = mapWorkspaceAccessSubscriptionResponse(
        subscriptionResult.data.subscription
      ) as WorkspaceAccessSubscription;

      return requestContext.json(
        {
          subscription: subscriptionResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: changeWorkspaceAccessSubscriptionPlan :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find Workspace Invoices
// -----------------------------------------------------------------

export const findWorkspaceInvoices = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', FindWorkspaceInvoicesRequestParamSchema),
  zodValidationMiddleware('query', FindWorkspaceInvoicesRequestQuerySchema),
  async (requestContext): Promise<FindWorkspaceInvoicesResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('query');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const limit = parsedQuery.limit ?? DEFAULT_WORKSPACE_INVOICE_QUERY_LIMIT;
      const direction =
        parsedQuery.direction ??
        DEFAULT_WORKSPACE_INVOICE_QUERY_PAGINATION_DIRECTION;
      const cursor = parsedQuery.cursor ?? undefined;

      const workspaceInvoiceResult =
        await workspaceBusinessService.cursorPaginateWorkspaceInvoices(
          executionContext,
          {
            workspaceId: workspaceId,
            pagination: {
              limit: limit,
              direction: direction,
              cursor: cursor,
            },
            filter: {
              status: DEFAULT_WORKSPACE_INVOICE_FILTER_STATUSES,
            },
          }
        );

      // Check if the result is successful without ANY errors.
      if (!workspaceInvoiceResult.isSuccess()) {
        const primaryError = workspaceInvoiceResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceInvoiceResultData = workspaceInvoiceResult.data;

      const invoices = mapInvoiceResponse(
        workspaceInvoiceResultData.nodes
      ) as Invoice[];

      return requestContext.json(
        {
          nodes: invoices,
          hasPreviousPage: workspaceInvoiceResultData.hasPreviousPage,
          hasNextPage: workspaceInvoiceResultData.hasNextPage,
          totalCount: workspaceInvoiceResultData.totalCount,
          startCursor: workspaceInvoiceResultData.startCursor,
          endCursor: workspaceInvoiceResultData.endCursor,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findWorkspaceInvoices :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Create Document File Upload URLs
// -----------------------------------------------------------------

export const createDocumentFileUploadUrls = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    CreateDocumentFileUploadUrlsRequestParamSchema
  ),
  zodValidationMiddleware(
    'json',
    CreateDocumentFileUploadUrlsRequestBodySchema
  ),
  async (requestContext): Promise<CreateDocumentFileUploadUrlsResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const parsedInput = requestContext.req.valid('json');

      const workspaceId = parsedParams.id;
      const files = parsedInput.files;

      const uploadUrlsResult =
        await documentBusinessService.createDocumentFileUploadUrls(
          executionContext,
          files.map((file) => ({
            workspaceId: workspaceId,
            requestId: file.requestId,
            fileMimeType: file.mimeType,
          }))
        );

      const successResults: CreateDocumentFileUploadUrlsResponseData[] = [];
      const errorResults: CreateDocumentFileUploadUrlsResponseError[] = [];

      if (uploadUrlsResult.isSuccess()) {
        uploadUrlsResult.data.forEach((result) => {
          successResults.push({
            fileId: result.fileId,
            fileExtension: result.fileExtension,
            requestId: result.requestId!,
            uploadUrl: result.uploadUrl,
          });
        });
      }

      if (uploadUrlsResult.hasErrors()) {
        uploadUrlsResult.errors.forEach((error) => {
          const status =
            transformResultErrorCodeToHTTPStatusCode(error.code) ??
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
          const title = getReasonPhrase(status);

          errorResults.push({
            title: title,
            status: status,
            detail: error.detail,
            metadata: {
              requestId: error.metadata?.input?.requestId,
            },
          });
        });
      }

      const responseBody: CreateDocumentFileUploadUrlsResponseBody = {
        data: successResults,
        errors: errorResults,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: createDocumentFileUploadUrls :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Process Document File
// -----------------------------------------------------------------

export const processDocumentFile = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', ProcessDocumentFileRequestParamSchema),
  zodValidationMiddleware('json', ProcessDocumentFileRequestBodySchema),
  async (requestContext): Promise<ProcessDocumentFileResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');
      const parsedInput = requestContext.req.valid('json');

      const workspaceId = parsedParams.id;
      const fileId = parsedInput.fileId;
      const fileExtension = parsedInput.fileExtension;

      await documentBusinessService._processDocumentFile(executionContext, {
        workspaceId: workspaceId,
        fileId: fileId,
        fileExtension: fileExtension,
      });

      return requestContext.json({ success: true }, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: processDocumentFile :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find Workspace Email Invites
// -----------------------------------------------------------------

export const findWorkspaceEmailInvites = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', FindWorkspaceEmailInvitesRequestParamSchema),
  zodValidationMiddleware('query', FindWorkspaceEmailInvitesRequestQuerySchema),
  async (requestContext): Promise<FindWorkspaceEmailInvitesResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('query');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const limit =
        parsedQuery.limit ?? DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_LIMIT;
      const direction =
        parsedQuery.direction ??
        DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_PAGINATION_DIRECTION;
      const cursor = parsedQuery.cursor ?? undefined;
      const sortField =
        parsedQuery.sortField ??
        DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_SORT_FIELD;
      const sortDirection =
        parsedQuery.sortDirection ??
        DEFAULT_WORKSPACE_EMAIL_INVITE_QUERY_SORT_DIRECTION;

      const sort = transformOrThrowWorkspaceEmailInviteSort(
        sortDirection,
        sortField
      );

      const workspaceInviteResult =
        await workspaceBusinessService.cursorPaginateWorkspaceEmailInvitesByWorkspaceId(
          executionContext,
          {
            workspaceId: workspaceId,
            pagination: {
              limit: limit,
              direction: direction,
              cursor: cursor,
            },
            sort: [sort],
            filter: {
              expired: false, // Only fetch non-expired invites
              declined: false, // Only fetch non-declined invites
              accepted: false, // Only fetch non-accepted invites
            },
          }
        );

      // Check if the result is successful without ANY errors.
      if (!workspaceInviteResult.isSuccess()) {
        const primaryError = workspaceInviteResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceInviteResultData = workspaceInviteResult.data;

      const workspaceEmailInvites = mapWorkspaceEmailInviteResponse(
        workspaceInviteResultData.nodes
      ) as WorkspaceEmailInvite[];

      return requestContext.json(
        {
          nodes: workspaceEmailInvites,
          hasPreviousPage: workspaceInviteResultData.hasPreviousPage,
          hasNextPage: workspaceInviteResultData.hasNextPage,
          totalCount: workspaceInviteResultData.totalCount,
          startCursor: workspaceInviteResultData.startCursor,
          endCursor: workspaceInviteResultData.endCursor,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findWorkspaceEmailInvites :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Send Workspace Email Invites
// -----------------------------------------------------------------

export const sendWorkspaceEmailInvites = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', SendWorkspaceEmailInvitesRequestParamSchema),
  zodValidationMiddleware('json', SendWorkspaceEmailInvitesRequestBodySchema),
  async (requestContext): Promise<SendWorkspaceEmailInvitesResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const emails = parsedQuery.emails;

      const workspaceInviteResult =
        await workspaceBusinessService.sendWorkspaceEmailInvites(
          executionContext,
          emails.map((email) => ({
            email: email,
            workspaceId: workspaceId,
          }))
        );

      const successResults: SendWorkspaceEmailInvitesResponseData[] = [];
      const errorResults: SendWorkspaceEmailInvitesResponseError[] = [];

      if (workspaceInviteResult.isSuccess()) {
        workspaceInviteResult.data.forEach((result) => {
          const workspaceInviteResponse = mapWorkspaceEmailInviteResponse(
            result.invite
          ) as WorkspaceEmailInvite;
          if (isDevelopmentEnvironment()) {
            successResults.push({
              invite: workspaceInviteResponse,
              code: result.code,
            });
          } else {
            successResults.push({
              invite: workspaceInviteResponse,
            });
          }
        });
      }

      if (workspaceInviteResult.hasErrors()) {
        workspaceInviteResult.errors.forEach((error) => {
          const status =
            transformResultErrorCodeToHTTPStatusCode(error.code) ??
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
          const title = getReasonPhrase(status);

          errorResults.push({
            title: title,
            status: status,
            detail: error.detail,
            metadata: {
              email: error.metadata?.input?.email,
            },
          });
        });
      }

      const responseBody: SendWorkspaceEmailInvitesResponseBody = {
        data: successResults,
        errors: errorResults,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: sendWorkspaceEmailInvites :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Expire Workspace Email Invites
// -----------------------------------------------------------------

export const expireWorkspaceEmailInvites = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    ExpireWorkspaceEmailInvitesRequestParamSchema
  ),
  zodValidationMiddleware('json', ExpireWorkspaceEmailInvitesRequestBodySchema),
  async (requestContext): Promise<ExpireWorkspaceEmailInvitesResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const inviteIds = parsedQuery.inviteIds;

      const workspaceInviteResult =
        await workspaceBusinessService.expireWorkspaceEmailInvites(
          executionContext,
          inviteIds.map((inviteId) => ({
            inviteId: inviteId,
            workspaceId: workspaceId,
          }))
        );

      const successResults: WorkspaceEmailInvite[] = [];
      const errorResults: ExpireWorkspaceEmailInvitesResponseError[] = [];

      if (workspaceInviteResult.isSuccess()) {
        workspaceInviteResult.data.forEach((result) => {
          const workspaceInviteResponse = mapWorkspaceEmailInviteResponse(
            result.invite
          ) as WorkspaceEmailInvite;
          successResults.push(workspaceInviteResponse);
        });
      }

      if (workspaceInviteResult.hasErrors()) {
        workspaceInviteResult.errors.forEach((error) => {
          const status =
            transformResultErrorCodeToHTTPStatusCode(error.code) ??
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
          const title = getReasonPhrase(status);

          errorResults.push({
            title: title,
            status: status,
            detail: error.detail,
            metadata: {
              inviteId: error.metadata?.input?.inviteId,
            },
          });
        });
      }

      const responseBody: ExpireWorkspaceEmailInvitesResponseBody = {
        data: successResults,
        errors: errorResults,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: expireWorkspaceEmailInvites :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Accept Workspace Email Invite
// -----------------------------------------------------------------

export const acceptWorkspaceEmailInvite = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    AcceptWorkspaceEmailInviteRequestParamSchema
  ),
  async (requestContext): Promise<AcceptWorkspaceEmailInviteResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');

      const inviteId = parsedParams.id;
      const userId = executionContext.actor.id;

      const workspaceInviteResult =
        await workspaceBusinessService.acceptWorkspaceEmailInvite(
          executionContext,
          {
            inviteId: inviteId,
            userId: userId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace invite to be accepted.
      if (!workspaceInviteResult.isSuccess()) {
        const primaryError = workspaceInviteResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceEmailInviteResultData = workspaceInviteResult.data;
      const workspaceEmailInviteEntity = workspaceEmailInviteResultData.invite;

      const workspaceEmailInviteResponse = mapWorkspaceEmailInviteResponse(
        workspaceEmailInviteEntity
      ) as WorkspaceEmailInvite;

      const responseBody: AcceptWorkspaceEmailInviteResponseBody = {
        invite: workspaceEmailInviteResponse,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: acceptWorkspaceEmailInvite :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Decline Workspace Email Invite
// -----------------------------------------------------------------

export const declineWorkspaceEmailInvite = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    DeclineWorkspaceEmailInviteRequestParamSchema
  ),
  async (requestContext): Promise<DeclineWorkspaceEmailInviteResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');

      const inviteId = parsedParams.id;
      const userId = executionContext.actor.id;

      const workspaceInviteResult =
        await workspaceBusinessService.declineWorkspaceEmailInvite(
          executionContext,
          {
            inviteId: inviteId,
            userId: userId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace invite to be declined.
      if (!workspaceInviteResult.isSuccess()) {
        const primaryError = workspaceInviteResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceEmailInviteResultData = workspaceInviteResult.data;
      const workspaceEmailInviteEntity = workspaceEmailInviteResultData.invite;

      const workspaceEmailInviteResponse = mapWorkspaceEmailInviteResponse(
        workspaceEmailInviteEntity
      ) as WorkspaceEmailInvite;

      const responseBody: DeclineWorkspaceEmailInviteResponseBody = {
        invite: workspaceEmailInviteResponse,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: declineWorkspaceEmailInvite :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find Workspace Email Invite by Code
// -----------------------------------------------------------------

export const findWorkspaceEmailInviteByCode = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    FindWorkspaceEmailInviteByCodeRequestParamSchema
  ),
  async (requestContext): Promise<FindWorkspaceEmailInviteByCodeResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedParams = requestContext.req.valid('param');

      const inviteCode = parsedParams.code;
      const userId = executionContext.actor.id;

      const workspaceInviteResult =
        await workspaceBusinessService.findEffectiveWorkspaceEmailInviteByCodeAndUserId(
          executionContext,
          {
            code: inviteCode,
            userId: userId,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a workspace invite to be viewed.
      if (!workspaceInviteResult.isSuccess()) {
        const primaryError = workspaceInviteResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceEmailInviteResultData = workspaceInviteResult.data;

      if (!workspaceEmailInviteResultData) {
        throw new NotFoundException('Workspace email invite not found');
      }

      const workspaceEmailInviteEntity = workspaceEmailInviteResultData.invite;
      const workspaceEntity = workspaceEmailInviteResultData.workspace;

      const workspaceEmailInviteResponse = mapWorkspaceEmailInviteResponse(
        workspaceEmailInviteEntity
      ) as WorkspaceEmailInvite;

      const responseBody: FindWorkspaceEmailInviteByCodeResponseBody = {
        invite: workspaceEmailInviteResponse,
        metadata: {
          workspaceName: workspaceEntity.name,
        },
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findWorkspaceEmailInviteByCode :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Send Business Contact
// -----------------------------------------------------------------

export const sendBusinessContact = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('json', SendBusinessContactRequestBodySchema),
  async (requestContext): Promise<SendBusinessContactResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');

      await sendBusinessContactToSlack({
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
        email: parsedInput.email,
        companyName: parsedInput.companyName,
        companySize: parsedInput.companySize,
      });

      logger.info(
        `${LOG_PREFIX} :: sendBusinessContact :: Business contact sent to Slack successfully`,
        {
          context: loggingContext,
          payload: parsedInput,
          userId: executionContext.actor.id,
          userEmail: executionContext.account?.user?.email,
        }
      );

      const responseBody: SendBusinessContactResponseBody = {
        success: true,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: sendBusinessContact :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Find Workspace Members
// -----------------------------------------------------------------

export const findWorkspaceMembers = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', FindWorkspaceMembersRequestParamSchema),
  zodValidationMiddleware('query', FindWorkspaceMembersRequestQuerySchema),
  async (requestContext): Promise<FindWorkspaceMembersResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('query');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const limit = parsedQuery.limit ?? DEFAULT_WORKSPACE_MEMBER_QUERY_LIMIT;
      const direction =
        parsedQuery.direction ??
        DEFAULT_WORKSPACE_MEMBER_QUERY_PAGINATION_DIRECTION;
      const cursor = parsedQuery.cursor ?? undefined;
      const sortField =
        parsedQuery.sortField ?? DEFAULT_WORKSPACE_MEMBER_QUERY_SORT_FIELD;
      const sortDirection =
        parsedQuery.sortDirection ??
        DEFAULT_WORKSPACE_MEMBER_QUERY_SORT_DIRECTION;

      const sort = transformOrThrowWorkspaceMemberSort(
        sortDirection,
        sortField
      );

      const workspaceMemberResult =
        await workspaceBusinessService.cursorPaginateWorkspaceMembershipsByWorkspaceId(
          executionContext,
          {
            workspaceId: workspaceId,
            pagination: {
              limit: limit,
              direction: direction,
              cursor: cursor,
            },
            sort: [sort],
          }
        );

      // Check if the result is successful without ANY errors.
      if (!workspaceMemberResult.isSuccess()) {
        const primaryError = workspaceMemberResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const workspaceMemberResultData = workspaceMemberResult.data;

      const workspaceMembers = mapWorkspaceMemberResponse(
        workspaceMemberResultData.nodes
      ) as WorkspaceMember[];

      return requestContext.json(
        {
          nodes: workspaceMembers,
          hasPreviousPage: workspaceMemberResultData.hasPreviousPage,
          hasNextPage: workspaceMemberResultData.hasNextPage,
          totalCount: workspaceMemberResultData.totalCount,
          startCursor: workspaceMemberResultData.startCursor,
          endCursor: workspaceMemberResultData.endCursor,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findWorkspaceMembers :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Remove Workspace Members
// -----------------------------------------------------------------

export const removeWorkspaceMembers = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware('param', RemoveWorkspaceMembersRequestParamSchema),
  zodValidationMiddleware('json', RemoveWorkspaceMembersRequestBodySchema),
  async (requestContext): Promise<RemoveWorkspaceMembersResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const memberIds = parsedQuery.memberIds;

      const workspaceMemberResult =
        await workspaceBusinessService.removeWorkspaceMemberships(
          executionContext,
          memberIds.map((memberId) => ({
            workspaceMemberId: memberId,
            workspaceId: workspaceId,
          }))
        );

      const successResults: WorkspaceMember[] = [];
      const errorResults: RemoveWorkspaceMembersResponseError[] = [];

      if (workspaceMemberResult.isSuccess()) {
        workspaceMemberResult.data.forEach((result) => {
          const workspaceMemberResponse = mapWorkspaceMemberResponse(
            result.workspaceMembership
          ) as WorkspaceMember;
          successResults.push(workspaceMemberResponse);
        });
      }

      if (workspaceMemberResult.hasErrors()) {
        workspaceMemberResult.errors.forEach((error) => {
          const status =
            transformResultErrorCodeToHTTPStatusCode(error.code) ??
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
          const title = getReasonPhrase(status);

          errorResults.push({
            title: title,
            status: status,
            detail: error.detail,
            metadata: {
              memberId: error.metadata?.input?.workspaceMemberId,
            },
          });
        });
      }

      const responseBody: RemoveWorkspaceMembersResponseBody = {
        data: successResults,
        errors: errorResults,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: removeWorkspaceMembers :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Update Workspace Member Roles
// -----------------------------------------------------------------

export const updateWorkspaceMemberRoles = createHandler(
  actorMiddleware(ACTOR_TYPE.USER),
  zodValidationMiddleware(
    'param',
    UpdateWorkspaceMemberRolesRequestParamSchema
  ),
  zodValidationMiddleware('json', UpdateWorkspaceMemberRolesRequestBodySchema),
  async (requestContext): Promise<UpdateWorkspaceMemberRolesResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedQuery = requestContext.req.valid('json');
      const parsedParams = requestContext.req.valid('param');

      const workspaceId = parsedParams.id;
      const inputs = parsedQuery.members;

      const workspaceMemberResult =
        await workspaceBusinessService.updateWorkspaceMemberRoles(
          executionContext,
          inputs.map((input) => ({
            workspaceId: workspaceId,
            workspaceMemberId: input.id,
            role: transformOrThrowWorkspaceMemberRoleToRole(input.role),
          }))
        );

      const successResults: WorkspaceMember[] = [];
      const errorResults: UpdateWorkspaceMemberRolesResponseError[] = [];

      if (workspaceMemberResult.isSuccess()) {
        workspaceMemberResult.data.forEach((result) => {
          const workspaceMemberResponse = mapWorkspaceMemberResponse(
            result.workspaceMembership
          ) as WorkspaceMember;
          successResults.push(workspaceMemberResponse);
        });
      }

      if (workspaceMemberResult.hasErrors()) {
        workspaceMemberResult.errors.forEach((error) => {
          const status =
            transformResultErrorCodeToHTTPStatusCode(error.code) ??
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
          const title = getReasonPhrase(status);

          errorResults.push({
            title: title,
            status: status,
            detail: error.detail,
            metadata: {
              memberId: error.metadata?.input?.workspaceMemberId,
            },
          });
        });
      }

      const responseBody: UpdateWorkspaceMemberRolesResponseBody = {
        data: successResults,
        errors: errorResults,
      };

      return requestContext.json(responseBody, HTTP_STATUS_CODE.OK);
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: updateWorkspaceMemberRoles :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);
