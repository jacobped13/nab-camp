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
} from '@common';
import { authenticationBusinessService } from '@service/authentication';
import { actorMiddleware } from '@api/middleware/actor.middleware';
import { zodValidationMiddleware } from '@api/middleware/zod-validation.middleware';
import {
  AcceptEmailAuthenticationCodeRequestBodySchema,
  AcceptEmailAuthenticationCodeResponse,
  SendEmailAuthenticationCodeRequestBodySchema,
  SendEmailAuthenticationCodeResponse,
} from './helper/authentication.dto';
import { isDevelopmentEnvironment } from '@env';

const LOG_PREFIX = 'API :: Authentication :: AuthenticationHandler';

// -----------------------------------------------------------------
// Send Email Authentication Code
// -----------------------------------------------------------------

export const sendEmailAuthenticationCode = createHandler(
  actorMiddleware(ACTOR_TYPE.ANONYMOUS),
  zodValidationMiddleware('json', SendEmailAuthenticationCodeRequestBodySchema),
  async (requestContext): Promise<SendEmailAuthenticationCodeResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');

      const emailAuthenticationCodeResult =
        await authenticationBusinessService._sendEmailAuthenticationCode(
          executionContext,
          {
            email: parsedInput.email,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a code to be sent.
      if (!emailAuthenticationCodeResult.isSuccess()) {
        const primaryError = emailAuthenticationCodeResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      const code = isDevelopmentEnvironment()
        ? emailAuthenticationCodeResult.data?.code
        : '';

      return requestContext.json(
        {
          email: parsedInput.email,
          code,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: sendEmailAuthenticationCode :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);

// -----------------------------------------------------------------
// Accept Email Authentication Code
// -----------------------------------------------------------------

export const acceptEmailAuthenticationCode = createHandler(
  actorMiddleware(ACTOR_TYPE.ANONYMOUS),
  zodValidationMiddleware(
    'json',
    AcceptEmailAuthenticationCodeRequestBodySchema
  ),
  async (requestContext): Promise<AcceptEmailAuthenticationCodeResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      const parsedInput = requestContext.req.valid('json');

      const emailAuthenticationCodeResult =
        await authenticationBusinessService._acceptEmailAuthenticationCode(
          executionContext,
          {
            email: parsedInput.email,
            code: parsedInput.code,
          }
        );

      // Check if the result is successful without ANY errors.
      // We required a FULL success for a code to be accepted.
      if (!emailAuthenticationCodeResult.isSuccess()) {
        const primaryError = emailAuthenticationCodeResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      return requestContext.json(
        {
          token: emailAuthenticationCodeResult.data,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: acceptEmailAuthenticationCode :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);
