import {
  HTTP_STATUS_CODE,
  ExecutionContext,
  injectExceptionDetails,
  logger,
  createHandler,
  HTTPException,
  InternalServerErrorException,
  transformResultErrorCodeToHTTPStatusCode,
  AUTHENTICATION_SCHEME,
} from '@common';
import { accountBusinessService } from '@service/account';
import { mapAccountResponse } from './helper/account.util';
import { FindCurrentAccountResponse } from './helper/account.dto';
import { Account as AccountResponse } from '@api-contracts/account';
import { authenticationMiddleware } from '@api/middleware/authentication.middleware';
import { AUTHENTICATION_IDENTITY_PROVIDER } from '@service/authentication';

const LOG_PREFIX = 'API :: Account :: AccountHandler';

// -----------------------------------------------------------------
// Find Current Account
// -----------------------------------------------------------------

export const findCurrentAccount = createHandler(
  authenticationMiddleware({
    scheme: AUTHENTICATION_SCHEME.BEARER,
    provider: AUTHENTICATION_IDENTITY_PROVIDER.FIREBASE,
  }),
  async (requestContext): Promise<FindCurrentAccountResponse> => {
    const executionContext =
      ExecutionContext.fromRequestContext(requestContext);
    const loggingContext = executionContext.toLoggingContext();

    try {
      // TODO: Use the account context in the request instead of re-fetching the account.
      const accountResult =
        await accountBusinessService.findActorAccount(executionContext);

      if (!accountResult.isSuccess()) {
        const primaryError = accountResult.firstError;

        throw new HTTPException(
          transformResultErrorCodeToHTTPStatusCode(primaryError.code),
          primaryError.detail
        );
      }

      return requestContext.json(
        {
          account: mapAccountResponse(accountResult.data) as AccountResponse,
        },
        HTTP_STATUS_CODE.OK
      );
    } catch (error: unknown) {
      if (error instanceof HTTPException) {
        throw error;
      }
      logger.error(
        `${LOG_PREFIX} :: findCurrentAccount :: An unknown error occurred`,
        injectExceptionDetails(error, {
          context: loggingContext,
        })
      );
      throw new InternalServerErrorException('An unknown error occurred');
    }
  }
);
