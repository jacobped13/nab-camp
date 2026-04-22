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
  CreateCustomerConnectionErrorDto,
  CreateCustomerConnectionInputDto,
  CreateCustomerConnectionInputDtoSchema,
  CreateCustomerConnectionOutputDto,
  CreateCustomerErrorDto,
  CreateCustomerInputDto,
  CreateCustomerInputDtoSchema,
  CreateCustomerOutputDto,
  CreateProviderSubscriptionCheckoutSessionErrorDto,
  CreateProviderSubscriptionCheckoutSessionInputDto,
  CreateProviderSubscriptionCheckoutSessionInputDtoSchema,
  CreateProviderSubscriptionCheckoutSessionOutputDto,
  DeleteAllTerminalSubscriptionConnectionsByCustomerIdErrorDto,
  DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDto,
  DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDtoSchema,
  DeleteAllTerminalSubscriptionConnectionsByCustomerIdOutputDto,
  DeletePriceConnectionErrorDto,
  DeletePriceConnectionInputDto,
  DeletePriceConnectionInputDtoSchema,
  DeletePriceConnectionOutputDto,
  DeleteProductConnectionErrorDto,
  DeleteProductConnectionInputDto,
  DeleteProductConnectionInputDtoSchema,
  DeleteProductConnectionOutputDto,
  DeleteProviderEventLogErrorDto,
  DeleteProviderEventLogInputDto,
  DeleteProviderEventLogInputDtoSchema,
  DeleteProviderEventLogOutputDto,
  DeleteSubscriptionItemConnectionsErrorDto,
  DeleteSubscriptionItemConnectionsInputDto,
  DeleteSubscriptionItemConnectionsInputDtoSchema,
  DeleteSubscriptionItemConnectionsOutputDto,
  FindAllCustomerConnectionsByStakeholdersErrorDto,
  FindAllCustomerConnectionsByStakeholdersInputDto,
  FindAllCustomerConnectionsByStakeholdersInputDtoSchema,
  FindAllCustomerConnectionsByStakeholdersOutputDto,
  FindAllSubscriptionConnectionsByCustomerIdsErrorDto,
  FindAllSubscriptionConnectionsByCustomerIdsInputDto,
  FindAllSubscriptionConnectionsByCustomerIdsInputDtoSchema,
  FindAllSubscriptionConnectionsByCustomerIdsOutputDto,
  FindAllSubscriptionItemConnectionsBySubscriptionIdErrorDto,
  FindAllSubscriptionItemConnectionsBySubscriptionIdInputDto,
  FindAllSubscriptionItemConnectionsBySubscriptionIdInputDtoSchema,
  FindAllSubscriptionItemConnectionsBySubscriptionIdOutputDto,
  FindAllSubscriptionItemConnectionsBySubscriptionIdsErrorDto,
  FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDto,
  FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDtoSchema,
  FindAllSubscriptionItemConnectionsBySubscriptionIdsOutputDto,
  FindAllSubscriptionPlanFamilyPathsByFamilyIdErrorDto,
  FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDto,
  FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDtoSchema,
  FindAllSubscriptionPlanFamilyPathsByFamilyIdOutputDto,
  FindAllSubscriptionPlansByFamilyGroupKeyErrorDto,
  FindAllSubscriptionPlansByFamilyGroupKeyInputDto,
  FindAllSubscriptionPlansByFamilyGroupKeyInputDtoSchema,
  FindAllSubscriptionPlansByFamilyGroupKeyOutputDto,
  FindAllSubscriptionPlansByFamilyIdsErrorDto,
  FindAllSubscriptionPlansByFamilyIdsInputDto,
  FindAllSubscriptionPlansByFamilyIdsInputDtoSchema,
  FindAllSubscriptionPlansByFamilyIdsOutputDto,
  FindAllSubscriptionPlansByPriceIdsErrorDto,
  FindAllSubscriptionPlansByPriceIdsInputDto,
  FindAllSubscriptionPlansByPriceIdsInputDtoSchema,
  FindAllSubscriptionPlansByPriceIdsOutputDto,
  FindAllSubscriptionPlansBySubscriptionIdsErrorDto,
  FindAllSubscriptionPlansBySubscriptionIdsInputDto,
  FindAllSubscriptionPlansBySubscriptionIdsInputDtoSchema,
  FindAllSubscriptionPlansBySubscriptionIdsOutputDto,
  FindCustomerByProviderErrorDto,
  FindCustomerByProviderInputDto,
  FindCustomerByProviderInputDtoSchema,
  FindCustomerByProviderOutputDto,
  FindCustomerByStakeholderErrorDto,
  FindCustomerByStakeholderInputDto,
  FindCustomerByStakeholderInputDtoSchema,
  FindCustomerByStakeholderOutputDto,
  FindCustomerConnectionByProviderErrorDto,
  FindCustomerConnectionByProviderInputDto,
  FindCustomerConnectionByProviderInputDtoSchema,
  FindCustomerConnectionByProviderOutputDto,
  FindCustomerConnectionByStakeholderErrorDto,
  FindCustomerConnectionByStakeholderInputDto,
  FindCustomerConnectionByStakeholderInputDtoSchema,
  FindCustomerConnectionByStakeholderOutputDto,
  FindOrCreatePriceConnectionErrorDto,
  FindOrCreatePriceConnectionInputDto,
  FindOrCreatePriceConnectionInputDtoSchema,
  FindOrCreatePriceConnectionOutputDto,
  FindOrCreateProductConnectionErrorDto,
  FindOrCreateProductConnectionInputDto,
  FindOrCreateProductConnectionInputDtoSchema,
  FindOrCreateProductConnectionOutputDto,
  FindOrCreateProviderEventLogErrorDto,
  FindOrCreateProviderEventLogInputDto,
  FindOrCreateProviderEventLogInputDtoSchema,
  FindOrCreateProviderEventLogOutputDto,
  FindOrCreateSubscriptionConnectionErrorDto,
  FindOrCreateSubscriptionConnectionInputDto,
  FindOrCreateSubscriptionConnectionInputDtoSchema,
  FindOrCreateSubscriptionConnectionOutputDto,
  FindOrCreateSubscriptionItemConnectionErrorDto,
  FindOrCreateSubscriptionItemConnectionInputDto,
  FindOrCreateSubscriptionItemConnectionInputDtoSchema,
  FindOrCreateSubscriptionItemConnectionOutputDto,
  FindPriceConnectionByIdErrorDto,
  FindPriceConnectionByIdInputDto,
  FindPriceConnectionByIdInputDtoSchema,
  FindPriceConnectionByIdOutputDto,
  FindPriceConnectionByProviderErrorDto,
  FindPriceConnectionByProviderInputDto,
  FindPriceConnectionByProviderInputDtoSchema,
  FindPriceConnectionByProviderOutputDto,
  FindProductConnectionByProviderErrorDto,
  FindProductConnectionByProviderInputDto,
  FindProductConnectionByProviderInputDtoSchema,
  FindProductConnectionByProviderOutputDto,
  FindProviderCheckoutSessionByIdErrorDto,
  FindProviderCheckoutSessionByIdInputDto,
  FindProviderCheckoutSessionByIdInputDtoSchema,
  FindProviderCheckoutSessionByIdOutputDto,
  FindSubscriptionConnectionByIdErrorDto,
  FindSubscriptionConnectionByIdInputDto,
  FindSubscriptionConnectionByIdInputDtoSchema,
  FindSubscriptionConnectionByIdOutputDto,
  FindSubscriptionConnectionByProviderErrorDto,
  FindSubscriptionConnectionByProviderInputDto,
  FindSubscriptionConnectionByProviderInputDtoSchema,
  FindSubscriptionConnectionByProviderOutputDto,
  FindSubscriptionItemConnectionByProviderErrorDto,
  FindSubscriptionItemConnectionByProviderInputDto,
  FindSubscriptionItemConnectionByProviderInputDtoSchema,
  FindSubscriptionItemConnectionByProviderOutputDto,
  HydrateAllSubscriptionItemConnectionsErrorDto,
  HydrateAllSubscriptionItemConnectionsInputDto,
  HydrateAllSubscriptionItemConnectionsInputDtoSchema,
  HydrateAllSubscriptionItemConnectionsOutputDto,
  HydrateCustomerSubscriptionConnectionErrorDto,
  HydrateCustomerSubscriptionConnectionInputDto,
  HydrateCustomerSubscriptionConnectionInputDtoSchema,
  HydrateCustomerSubscriptionConnectionOutputDto,
  HydratePriceConnectionErrorDto,
  HydratePriceConnectionInputDto,
  HydratePriceConnectionInputDtoSchema,
  HydratePriceConnectionOutputDto,
  HydrateProductConnectionErrorDto,
  HydrateProductConnectionInputDto,
  HydrateProductConnectionInputDtoSchema,
  HydrateProductConnectionOutputDto,
  HydrateSubscriptionConnectionErrorDto,
  HydrateSubscriptionConnectionInputDto,
  HydrateSubscriptionConnectionInputDtoSchema,
  HydrateSubscriptionConnectionOutputDto,
  HydrateSubscriptionItemConnectionErrorDto,
  HydrateSubscriptionItemConnectionInputDto,
  HydrateSubscriptionItemConnectionInputDtoSchema,
  HydrateSubscriptionItemConnectionOutputDto,
  ProcessProviderEventLogErrorDto,
  ProcessProviderEventLogInputDto,
  ProcessProviderEventLogInputDtoSchema,
  ProcessProviderEventLogOutputDto,
  UpdatePriceConnectionByProviderErrorDto,
  UpdatePriceConnectionByProviderInputDto,
  UpdatePriceConnectionByProviderInputDtoSchema,
  UpdatePriceConnectionByProviderOutputDto,
  UpdateProductConnectionByProviderErrorDto,
  UpdateProductConnectionByProviderInputDto,
  UpdateProductConnectionByProviderInputDtoSchema,
  UpdateProductConnectionByProviderOutputDto,
  UpdateSubscriptionConnectionByProviderErrorDto,
  UpdateSubscriptionConnectionByProviderInputDto,
  UpdateSubscriptionConnectionByProviderInputDtoSchema,
  UpdateSubscriptionConnectionByProviderOutputDto,
  UpdateSubscriptionItemConnectionByProviderErrorDto,
  UpdateSubscriptionItemConnectionByProviderInputDto,
  UpdateSubscriptionItemConnectionByProviderInputDtoSchema,
  UpdateSubscriptionItemConnectionByProviderOutputDto,
  CreateSubscriptionPlanCheckoutSessionInputDto,
  CreateSubscriptionPlanCheckoutSessionInputDtoSchema,
  FindSubscriptionPlanByIdInputDto,
  FindSubscriptionPlanByIdOutputDto,
  FindSubscriptionPlanByIdErrorDto,
  FindSubscriptionPlanByIdInputDtoSchema,
  FindCustomerConnectionByIdInputDtoSchema,
  FindCustomerConnectionByIdInputDto,
  FindCustomerConnectionByIdOutputDto,
  FindCustomerConnectionByIdErrorDto,
  CreateSubscriptionPlanCheckoutSessionOutputDto,
  CreateSubscriptionPlanCheckoutSessionErrorDto,
  FindAllSubscriptionPlanFamilyPathsByPlanIdInputDto,
  FindAllSubscriptionPlanFamilyPathsByPlanIdOutputDto,
  FindAllSubscriptionPlanFamilyPathsByPlanIdErrorDto,
  FindAllSubscriptionPlanFamilyPathsByPlanIdInputDtoSchema,
  SubscriptionItemConnectionPlanDto,
  CancelSubscriptionAtPeriodEndOutputDto,
  CancelSubscriptionAtPeriodEndInputDtoSchema,
  CancelSubscriptionAtPeriodEndErrorDto,
  CancelSubscriptionAtPeriodEndInputDto,
  CancelProviderSubscriptionAtPeriodEndInputDtoSchema,
  CancelProviderSubscriptionAtPeriodEndErrorDto,
  CancelProviderSubscriptionAtPeriodEndOutputDto,
  CancelProviderSubscriptionAtPeriodEndInputDto,
  ResumeCancelledProviderSubscriptionInputDto,
  ResumeCancelledProviderSubscriptionOutputDto,
  ResumeCancelledProviderSubscriptionErrorDto,
  ResumeCancelledProviderSubscriptionInputDtoSchema,
  ResumeCancelledSubscriptionInputDto,
  ResumeCancelledSubscriptionOutputDto,
  ResumeCancelledSubscriptionErrorDto,
  ResumeCancelledSubscriptionInputDtoSchema,
  CreateProviderPaymentMethodManagementSessionInputDto,
  CreateProviderPaymentMethodManagementSessionOutputDto,
  CreateProviderPaymentMethodManagementSessionErrorDto,
  CreateProviderPaymentMethodManagementSessionInputDtoSchema,
  CreateCustomerPaymentMethodManagementSessionInputDtoSchema,
  CreateCustomerPaymentMethodManagementSessionErrorDto,
  CreateCustomerPaymentMethodManagementSessionOutputDto,
  CreateCustomerPaymentMethodManagementSessionInputDto,
  UpdateProviderSubscriptionItemPriceInputDtoSchema,
  UpdateProviderSubscriptionItemPriceInputDto,
  UpdateProviderSubscriptionItemPriceOutputDto,
  UpdateProviderSubscriptionItemPriceErrorDto,
  ChangeSubscriptionPlanInputDto,
  ChangeSubscriptionPlanOutputDto,
  ChangeSubscriptionPlanErrorDto,
  UpdateSubscriptionItemPriceInputDto,
  UpdateSubscriptionItemPriceOutputDto,
  UpdateSubscriptionItemPriceErrorDto,
  UpdateSubscriptionItemPriceInputDtoSchema,
  ChangeSubscriptionPlanInputDtoSchema,
  FindSubscriptionItemConnectionByIdInputDtoSchema,
  FindSubscriptionItemConnectionByIdOutputDto,
  FindSubscriptionItemConnectionByIdErrorDto,
  FindSubscriptionItemConnectionByIdInputDto,
  SubscriptionPlanPathDto,
  FindAllAvailableSubscriptionPlansByPlanIdInputDtoSchema,
  FindAllAvailableSubscriptionPlansByPlanIdOutputDto,
  FindAllAvailableSubscriptionPlansByPlanIdInputDto,
  FindAllAvailableSubscriptionPlansByPlanIdErrorDto,
  PreviewProviderSubscriptionItemPriceChangeInputDto,
  PreviewProviderSubscriptionItemPriceChangeOutputDto,
  PreviewProviderSubscriptionItemPriceChangeErrorDto,
  PreviewProviderSubscriptionItemPriceChangeInputDtoSchema,
  CursorPaginateProviderCustomerInvoicesInputDto,
  CursorPaginateProviderCustomerInvoicesOutputDto,
  CursorPaginateProviderCustomerInvoicesErrorDto,
  CursorPaginateProviderCustomerInvoicesInputDtoSchema,
} from './helper/billing.business.dto';
import * as billingDataService from '../data/billing.data.service';
import * as billingProviderService from '../provider/billing.provider.service';
import { validateLatestBillingProviderResourceVersion } from '../common/billing.util';
import {
  SubscriptionConnectionEntity,
  SubscriptionItemConnectionEntity,
  SubscriptionPlanFamilyGroupItemEntity,
} from '../data/helper/billing.data.model';
import { TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUSES } from '../common/billing.constant';
import { SubscriptionPlan } from './helper/billing.business.model';
import {
  calculateSubscriptionPlanFamilyPaths,
  calculateSubscriptionPlanFrequencyPaths,
  calculateSubscriptionPlanPricePaths,
  mapSubscriptionPlan,
} from './helper/billing.business.util';
import { SUBSCRIPTION_PLAN_CHECKOUT_SESSION_SEARCH_PARAM_KEY } from './helper/billing.business.constant';
import { generateBillingProviderResourceVersion } from '../provider/helper/billing.provider.util';

const LOG_PREFIX = 'Service :: Billing :: BillingBusinessService';

/**
 * @package
 *
 * Finds a customer connection by ID.
 *
 * @returns The customer connection, or null if not found.
 */
export const _findCustomerConnectionById = async (
  executionContext: ExecutionContext,
  input: FindCustomerConnectionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindCustomerConnectionByIdOutputDto>,
    FindCustomerConnectionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindCustomerConnectionByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const customerId = parsedInputData.customerId;

    // Step 2: Find customer connection by ID
    const customerEntity =
      await billingDataService.findCustomerConnectionById(customerId);

    if (!customerEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: customerEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findCustomerConnectionById :: An unknown error occurred`,
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
 * Finds a customer connection by provider.
 *
 * @returns The customer connection, or null if not found.
 */
export const _findCustomerConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: FindCustomerConnectionByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindCustomerConnectionByProviderOutputDto>,
    FindCustomerConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindCustomerConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find customer connection by provider
    const customerEntity =
      await billingDataService.findCustomerConnectionByProvider(
        provider,
        providerId
      );

    if (!customerEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: customerEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findCustomerConnectionByProvider :: An unknown error occurred`,
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
 * Finds a customer connection by stakeholder.
 *
 * @returns The customer connection, or null if not found.
 */
export const _findCustomerConnectionByStakeholder = async (
  executionContext: ExecutionContext,
  input: FindCustomerConnectionByStakeholderInputDto
): Promise<
  BusinessResult<
    Nullable<FindCustomerConnectionByStakeholderOutputDto>,
    FindCustomerConnectionByStakeholderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindCustomerConnectionByStakeholderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const stakeholderType = parsedInputData.stakeholderType;
    const stakeholderId = parsedInputData.stakeholderId;

    // Step 2: Find customer connection by stakeholder
    const customerEntity =
      await billingDataService.findCustomerConnectionByStakeholder(
        stakeholderType,
        stakeholderId
      );

    if (!customerEntity) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: customerEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findCustomerConnectionByStakeholder :: An unknown error occurred`,
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
 * Finds all customer connections by stakeholders.
 *
 * @returns A list of customer connections associated with the provided stakeholders.
 */
export const _findAllCustomerConnectionsByStakeholders = async (
  executionContext: ExecutionContext,
  input: FindAllCustomerConnectionsByStakeholdersInputDto
): Promise<
  BusinessResult<
    FindAllCustomerConnectionsByStakeholdersOutputDto,
    FindAllCustomerConnectionsByStakeholdersErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllCustomerConnectionsByStakeholdersInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const stakeholders = parsedInputData.stakeholders;

    // Step 2: Find all customer connections by stakeholders
    const customerEntities =
      await billingDataService.findAllCustomerConnectionsByStakeholders(
        stakeholders
      );

    return BusinessResult.ok({
      connections: customerEntities,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllCustomerConnectionsByStakeholders :: An unknown error occurred`,
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
 * Creates a new customer connection.
 *
 * @returns The customer connection if successful.
 */
export const _createCustomerConnection = async (
  executionContext: ExecutionContext,
  input: CreateCustomerConnectionInputDto
): Promise<
  BusinessResult<
    CreateCustomerConnectionOutputDto,
    CreateCustomerConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = CreateCustomerConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const stakeholderType = parsedInputData.stakeholderType;
    const stakeholderId = parsedInputData.stakeholderId;

    // Step 2: Ensure that the provider is not assigned to an existing customer connection
    const existingProviderConnection = await _findCustomerConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
      }
    );

    if (!existingProviderConnection.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing customer connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (existingProviderConnection.data) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Customer connection already exists for the given provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Ensure that the stakeholder is not assigned to an existing customer connection
    const existingStakeholderConnection =
      await _findCustomerConnectionByStakeholder(executionContext, {
        stakeholderType: stakeholderType,
        stakeholderId: stakeholderId,
      });

    if (!existingStakeholderConnection.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing customer connection by stakeholder',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (existingStakeholderConnection.data) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Customer connection already exists for the given stakeholder',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Create the customer connection
    const customerEntity = await billingDataService.createCustomerConnection(
      provider,
      providerId,
      stakeholderType,
      stakeholderId
    );

    return BusinessResult.ok({
      connection: customerEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createCustomerConnection :: An unknown error occurred`,
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
 * Finds a customer by provider.
 *
 * @returns The customer connection and provider information, or null if not found.
 */
export const _findCustomerByProvider = async (
  executionContext: ExecutionContext,
  input: FindCustomerByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindCustomerByProviderOutputDto>,
    FindCustomerByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindCustomerByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find customer connection by provider
    const customerConnectionResult = await _findCustomerConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
      }
    );

    if (!customerConnectionResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find customer connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerConnectionData = customerConnectionResult.data;

    if (!customerConnectionData) {
      return BusinessResult.ok(null);
    }

    const customerConnection = customerConnectionData.connection;

    // Step 3: Find the customer from the provider
    const providerCustomer =
      await billingProviderService.findProviderCustomerById(
        provider,
        providerId
      );

    if (!providerCustomer) {
      logger.error(
        `${LOG_PREFIX} :: _findCustomerByProvider :: Provider customer not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Provider customer not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: customerConnection,
      provider: providerCustomer,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findCustomerByProvider :: An unknown error occurred`,
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
 * Finds a customer by stakeholder.
 *
 * @returns The customer connection and provider information, or null if not found.
 */
export const _findCustomerByStakeholder = async (
  executionContext: ExecutionContext,
  input: FindCustomerByStakeholderInputDto
): Promise<
  BusinessResult<
    Nullable<FindCustomerByStakeholderOutputDto>,
    FindCustomerByStakeholderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindCustomerByStakeholderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const stakeholderType = parsedInputData.stakeholderType;
    const stakeholderId = parsedInputData.stakeholderId;

    // Step 2: Find customer connection by stakeholder
    const customerConnectionResult = await _findCustomerConnectionByStakeholder(
      executionContext,
      {
        stakeholderType: stakeholderType,
        stakeholderId: stakeholderId,
      }
    );

    if (!customerConnectionResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find customer connection by stakeholder',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerConnectionData = customerConnectionResult.data;

    if (!customerConnectionData) {
      return BusinessResult.ok(null);
    }

    const customerConnection = customerConnectionData.connection;
    const provider = customerConnection.provider;
    const providerId = customerConnection.providerId;

    // Step 3: Find the customer from the provider
    const providerCustomer =
      await billingProviderService.findProviderCustomerById(
        provider,
        providerId
      );

    if (!providerCustomer) {
      logger.error(
        `${LOG_PREFIX} :: _findCustomerByStakeholder :: Provider customer not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Provider customer not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: customerConnection,
      provider: providerCustomer,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findCustomerByStakeholder :: An unknown error occurred`,
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
 * Creates a new provider customer and connects the customer to the input stakeholder.
 *
 * @returns The customer connection and provider information if successful,
 */
export const _createCustomer = async (
  executionContext: ExecutionContext,
  input: CreateCustomerInputDto
): Promise<BusinessResult<CreateCustomerOutputDto, CreateCustomerErrorDto>> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = CreateCustomerInputDtoSchema.safeParse(input);

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
    const provider = parsedInputData.provider;
    const stakeholderType = parsedInputData.stakeholderType;
    const stakeholderId = parsedInputData.stakeholderId;

    // Step 2: Check if existing customer connection exists for the given stakeholder
    const existingCustomerConnectionResult =
      await _findCustomerConnectionByStakeholder(executionContext, {
        stakeholderType: stakeholderType,
        stakeholderId: stakeholderId,
      });

    if (!existingCustomerConnectionResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing customer by stakeholder',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    if (existingCustomerConnectionResult.data) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Customer already exists for the given stakeholder',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 4: Create the customer provider
    const providerCustomer =
      await billingProviderService.createProviderCustomer(provider, email);

    // Step 5: Create the customer connection
    const customerConnectionResult = await _createCustomerConnection(
      executionContext,
      {
        provider: provider,
        providerId: providerCustomer.id,
        stakeholderType: stakeholderType,
        stakeholderId: stakeholderId,
      }
    );

    if (!customerConnectionResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create customer connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerConnectionData = customerConnectionResult.data;
    const customerConnection = customerConnectionData.connection;

    return BusinessResult.ok({
      connection: customerConnection,
      provider: providerCustomer,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createCustomer :: An unknown error occurred`,
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
 * Creates a checkout session for a given provider to purchase a subscription.
 *
 * @returns The checkout session information if successful.
 */
export const _createProviderSubscriptionCheckoutSession = async (
  executionContext: ExecutionContext,
  input: CreateProviderSubscriptionCheckoutSessionInputDto
): Promise<
  BusinessResult<
    CreateProviderSubscriptionCheckoutSessionOutputDto,
    CreateProviderSubscriptionCheckoutSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateProviderSubscriptionCheckoutSessionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerCustomerId = parsedInputData.providerCustomerId;
    const providerPriceId = parsedInputData.providerPriceId;
    const quantity = parsedInputData.quantity;
    const redirectUrl = parsedInputData.redirectUrl;

    // Step 2: Create the checkout session
    const checkoutSession =
      await billingProviderService.createProviderSubscriptionCheckoutSession(
        provider,
        providerCustomerId,
        providerPriceId,
        quantity,
        redirectUrl
      );

    return BusinessResult.ok({
      session: checkoutSession,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createProviderSubscriptionCheckoutSession :: An unknown error occurred`,
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
 * Finds a provider checkout session by its ID.
 *
 * @returns The checkout session information, or null if not found.
 */
export const _findProviderCheckoutSessionById = async (
  executionContext: ExecutionContext,
  input: FindProviderCheckoutSessionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindProviderCheckoutSessionByIdOutputDto>,
    FindProviderCheckoutSessionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindProviderCheckoutSessionByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const sessionId = parsedInputData.sessionId;

    // Step 2: Find the checkout session by ID
    const checkoutSession =
      await billingProviderService.findProviderCheckoutSessionById(
        provider,
        sessionId
      );

    if (!checkoutSession) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      session: checkoutSession,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findProviderCheckoutSessionById :: An unknown error occurred`,
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
 * Finds or creates a billing provider event log.
 *
 * @returns The provider event log if found or created successfully.
 */
export const _findOrCreateProviderEventLog = async (
  executionContext: ExecutionContext,
  input: FindOrCreateProviderEventLogInputDto
): Promise<
  BusinessResult<
    FindOrCreateProviderEventLogOutputDto,
    FindOrCreateProviderEventLogErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindOrCreateProviderEventLogInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const publishedAt = parsedInputData.publishedAt;

    // Step 2: Find or create the billing provider event log
    const operationResult =
      await billingDataService.findOrCreateBillingProviderEventLog(
        provider,
        providerId,
        publishedAt
      );

    const created = operationResult.created;
    const eventLogEntity = operationResult.billingProviderEventLog;

    return BusinessResult.ok({
      event: eventLogEntity,
      created: created,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findOrCreateProviderEventLog :: An unknown error occurred`,
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
 * Finds an existing provider event log that has not been processed yet,
 * and flags the event as processed.
 *
 * @returns The provider event log if found and processed successfully.
 */
export const _processProviderEventLog = async (
  executionContext: ExecutionContext,
  input: ProcessProviderEventLogInputDto
): Promise<
  BusinessResult<
    ProcessProviderEventLogOutputDto,
    ProcessProviderEventLogErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = ProcessProviderEventLogInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find the existing provider event log that has not been processed yet
    const existingEventEntity =
      await billingDataService.findBillingProviderEventLogByProvider(
        provider,
        providerId
      );

    // Check if the event log has already been processed
    if (existingEventEntity?.isProcessed()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Provider event log has already been processed',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Process the event log by updating its processedAt timestamp
    const processedEventEntity =
      await billingDataService.processBillingProviderEventLog(
        provider,
        providerId,
        new Date() // Set processedAt to current date
      );

    return BusinessResult.ok({
      event: processedEventEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _processProviderEventLog :: An unknown error occurred`,
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
 * Deletes a provider event log.
 *
 * @returns The deleted provider event log.
 */
export const _deleteProviderEventLog = async (
  executionContext: ExecutionContext,
  input: DeleteProviderEventLogInputDto
): Promise<
  BusinessResult<
    DeleteProviderEventLogOutputDto,
    DeleteProviderEventLogErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = DeleteProviderEventLogInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Delete the provider event log
    const eventLogEntity =
      await billingDataService.deleteBillingProviderEventLog(
        provider,
        providerId
      );

    return BusinessResult.ok({
      event: eventLogEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _deleteProviderEventLog :: An unknown error occurred`,
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
 * Finds a product connection by provider.
 *
 * @returns The product connection, or null if not found.
 */
export const _findProductConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: FindProductConnectionByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindProductConnectionByProviderOutputDto>,
    FindProductConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindProductConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find the product connection
    const productConnection =
      await billingDataService.findProductConnectionByProvider(
        provider,
        providerId
      );

    if (!productConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: productConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findProductConnectionByProvider :: An unknown error occurred`,
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
 * Finds or creates a product connection.
 *
 * @returns The product connection if found or created successfully.
 */
export const _findOrCreateProductConnection = async (
  executionContext: ExecutionContext,
  input: FindOrCreateProductConnectionInputDto
): Promise<
  BusinessResult<
    FindOrCreateProductConnectionOutputDto,
    FindOrCreateProductConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindOrCreateProductConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const status = parsedInputData.status;

    // Step 2: Find or create the product connection
    const productConnection =
      await billingDataService.findOrCreateProductConnection(
        provider,
        providerId,
        providerVersion ?? null,
        status
      );

    return BusinessResult.ok({
      created: productConnection.created,
      connection: productConnection.productConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findOrCreateProductConnection :: An unknown error occurred`,
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
 * Updates a product connection by provider.
 *
 * @returns The product connection if updated successfully.
 */
export const _updateProductConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: UpdateProductConnectionByProviderInputDto
): Promise<
  BusinessResult<
    UpdateProductConnectionByProviderOutputDto,
    UpdateProductConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdateProductConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const status = parsedInputData.status;

    // Step 2: Ensure that the product connection exists
    const existingConnection = await _findProductConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
      }
    );

    if (!existingConnection.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing product connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingConnectionData = existingConnection.data;

    if (!existingConnectionData) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Product connection not found for the given provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Update the product connection
    const productConnectionEntity =
      await billingDataService.updateLatestProductConnection(
        existingConnectionData.connection.id,
        providerVersion,
        status
      );

    // If the update was not successful, then the current record is out of date
    if (!productConnectionEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Product connection is out of date',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: productConnectionEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateProductConnectionByProvider :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Failed due to an unknown error',
      metadata: {
        input,
        context: executionContext,
      },
    });
  }
};

/**
 * @package
 *
 * Hydrates a product connection.
 * Finds or creates a product connection. If the record is out of date, updates the connection with the latest version data.
 *
 * @returns The product connection if hydrated successfully.
 */
export const _hydrateProductConnection = async (
  executionContext: ExecutionContext,
  input: HydrateProductConnectionInputDto
): Promise<
  BusinessResult<
    HydrateProductConnectionOutputDto,
    HydrateProductConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = HydrateProductConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const status = parsedInputData.status;

    // Step 2: Find or create the product connection
    const productResult = await _findOrCreateProductConnection(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        status: status,
      }
    );

    if (!productResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateProductConnection :: Failed to find or create product connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find or create product connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const productResultData = productResult.data;
    const productConnection = productResultData.connection;
    const productVersion = productConnection.providerVersion;
    const productCreated = productResultData.created;

    // Step 3: If the product was created, we can return early
    if (productCreated) {
      return BusinessResult.ok({
        connection: productConnection,
        created: true,
        hydrated: true,
      });
    }

    // Step 4: Check if the existing product connection has an older version than the current event
    const isInputLatestVersion = validateLatestBillingProviderResourceVersion(
      provider,
      providerVersion,
      productVersion || ''
    );

    // If the product connection is not older, we can exit early
    if (!isInputLatestVersion) {
      return BusinessResult.ok({
        connection: productConnection,
        created: false,
        hydrated: false,
      });
    }

    // Step 5: Update the product connection with the new version data
    const updateResult = await _updateProductConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        status: status,
      }
    );

    if (!updateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateProductConnection :: Failed to update product connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to update product connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updateResultData = updateResult.data;
    const updatedConnection = updateResultData.connection;

    return BusinessResult.ok({
      connection: updatedConnection,
      created: false,
      hydrated: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _hydrateProductConnection :: An unknown error occurred`,
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
 * Deletes a product connection.
 *
 * @returns The deleted product connection if successful.
 */
export const _deleteProductConnection = async (
  executionContext: ExecutionContext,
  input: DeleteProductConnectionInputDto
): Promise<
  BusinessResult<
    DeleteProductConnectionOutputDto,
    DeleteProductConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = DeleteProductConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const productId = parsedInputData.productId;

    // Step 2: Delete product connection
    const productConnectionEntity =
      await billingDataService.deleteProductConnection(productId);

    return BusinessResult.ok({
      connection: productConnectionEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _deleteProductConnection :: An unknown error occurred`,
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
 * Finds a price connection by provider.
 *
 * @returns The price connection, or null if not found.
 */
export const _findPriceConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: FindPriceConnectionByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindPriceConnectionByProviderOutputDto>,
    FindPriceConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindPriceConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find the price connection
    const priceConnection =
      await billingDataService.findPriceConnectionByProvider(
        provider,
        providerId
      );

    if (!priceConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: priceConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findPriceConnectionByProvider :: An unknown error occurred`,
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
 * Finds a price connection by ID.
 *
 * @returns The price connection, or null if not found.
 */
export const _findPriceConnectionById = async (
  executionContext: ExecutionContext,
  input: FindPriceConnectionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindPriceConnectionByIdOutputDto>,
    FindPriceConnectionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindPriceConnectionByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const priceId = parsedInputData.priceId;

    // Step 2: Find the price connection
    const priceConnection =
      await billingDataService.findPriceConnectionById(priceId);

    if (!priceConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: priceConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findPriceConnectionById :: An unknown error occurred`,
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
 * Finds or creates a price connection.
 *
 * @returns The price connection if found or created successfully.
 */
export const _findOrCreatePriceConnection = async (
  executionContext: ExecutionContext,
  input: FindOrCreatePriceConnectionInputDto
): Promise<
  BusinessResult<
    FindOrCreatePriceConnectionOutputDto,
    FindOrCreatePriceConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindOrCreatePriceConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const productId = parsedInputData.productId;
    const status = parsedInputData.status;
    const unitAmount = parsedInputData.unitAmount;

    // Step 2: Find or create the price connection
    const priceConnection =
      await billingDataService.findOrCreatePriceConnection(
        provider,
        providerId,
        providerVersion ?? null,
        productId,
        unitAmount ?? null,
        status
      );

    return BusinessResult.ok({
      created: priceConnection.created,
      connection: priceConnection.priceConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findOrCreatePriceConnection :: An unknown error occurred`,
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
 * Updates a price connection by provider.
 *
 * @returns The price connection if updated successfully.
 */
export const _updatePriceConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: UpdatePriceConnectionByProviderInputDto
): Promise<
  BusinessResult<
    UpdatePriceConnectionByProviderOutputDto,
    UpdatePriceConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdatePriceConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const providerUnitAmount = parsedInputData.providerUnitAmount;
    const status = parsedInputData.status;

    // Step 2: Ensure that the price connection exists
    const existingConnection = await _findPriceConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
      }
    );

    if (!existingConnection.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing price connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingConnectionData = existingConnection.data;

    if (!existingConnectionData) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Price connection not found for the given provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Update the price connection
    const priceConnectionEntity =
      await billingDataService.updateLatestPriceConnection(
        existingConnectionData.connection.id,
        providerVersion,
        status,
        providerUnitAmount
      );

    if (!priceConnectionEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Price connection is out of date',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: priceConnectionEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updatePriceConnectionByProvider :: An unknown error occurred`,
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
 * Hydrates a price connection.
 * Finds or creates a price connection. If the record is out of date, updates the connection with the latest version data.
 *
 * @returns The price connection if hydrated successfully.
 */
export const _hydratePriceConnection = async (
  executionContext: ExecutionContext,
  input: HydratePriceConnectionInputDto
): Promise<
  BusinessResult<
    Nullable<HydratePriceConnectionOutputDto>,
    HydratePriceConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = HydratePriceConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const providerProductId = parsedInputData.providerProductId;
    const providerUnitAmount = parsedInputData.providerUnitAmount;
    const status = parsedInputData.status;

    // Step 2: Find the existing product connection
    const productConnectionResult = await _findProductConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerProductId,
      }
    );

    if (!productConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydratePriceConnection :: Failed to find product connection by provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find product connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const productConnectionData = productConnectionResult.data;

    // If the product connection does not exist, we cannot proceed with the price connection
    if (!productConnectionData) {
      return BusinessResult.ok(null);
    }

    const productConnection = productConnectionData.connection;
    const productId = productConnection.id;

    // Step 2: Find or create the price connection
    // Note: providerPriceId is used as providerId for price connections
    const priceResult = await _findOrCreatePriceConnection(executionContext, {
      provider: provider,
      providerId: providerId,
      providerVersion: providerVersion,
      productId: productId,
      unitAmount: providerUnitAmount,
      status: status,
    });

    if (!priceResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydratePriceConnection :: Failed to find or create price connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find or create price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceResultData = priceResult.data;
    const priceConnection = priceResultData.connection;
    const priceVersion = priceConnection.providerVersion;
    const priceCreated = priceResultData.created;

    // Step 3: If the price was created, we can return early
    if (priceCreated) {
      return BusinessResult.ok({
        connection: priceConnection,
        created: true,
        hydrated: true,
      });
    }

    // Step 4: Check if the existing price connection has an older version than the current event
    const isInputLatestVersion = validateLatestBillingProviderResourceVersion(
      provider,
      providerVersion,
      priceVersion || ''
    );

    if (!isInputLatestVersion) {
      return BusinessResult.ok({
        connection: priceConnection,
        created: false,
        hydrated: false,
      });
    }

    // Step 5: Update the price connection with the new version data
    const updateResult = await _updatePriceConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        providerUnitAmount: providerUnitAmount,
        status: status,
      }
    );

    if (!updateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydratePriceConnection :: Failed to update price connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to update price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updateResultData = updateResult.data;
    const updatedConnection = updateResultData.connection;

    return BusinessResult.ok({
      connection: updatedConnection,
      created: false,
      hydrated: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _hydratePriceConnection :: An unknown error occurred`,
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
 * Deletes a price connection.
 *
 * @returns The deleted price connection if successful.
 */
export const _deletePriceConnection = async (
  executionContext: ExecutionContext,
  input: DeletePriceConnectionInputDto
): Promise<
  BusinessResult<DeletePriceConnectionOutputDto, DeletePriceConnectionErrorDto>
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = DeletePriceConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const priceId = parsedInputData.priceId;

    // Step 2: Delete the price connection
    const deleteResult =
      await billingDataService.deletePriceConnection(priceId);

    return BusinessResult.ok({
      connection: deleteResult,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _deletePriceConnection :: An unknown error occurred`,
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
 * Finds a subscription connection by ID.
 *
 * @returns The subscription connection, or null if not found.
 */
export const _findSubscriptionConnectionById = async (
  executionContext: ExecutionContext,
  input: FindSubscriptionConnectionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindSubscriptionConnectionByIdOutputDto>,
    FindSubscriptionConnectionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindSubscriptionConnectionByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionId = parsedInputData.subscriptionId;

    // Step 2: Find the subscription connection
    const subscriptionConnection =
      await billingDataService.findSubscriptionConnectionById(subscriptionId);

    if (!subscriptionConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: subscriptionConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findSubscriptionConnectionById :: An unknown error occurred`,
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
 * Finds a subscription connection by provider.
 *
 * @returns The subscription connection, or null if not found.
 */
export const _findSubscriptionConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: FindSubscriptionConnectionByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindSubscriptionConnectionByProviderOutputDto>,
    FindSubscriptionConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindSubscriptionConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find the subscription connection
    const subscriptionConnection =
      await billingDataService.findSubscriptionConnectionByProvider(
        provider,
        providerId
      );

    if (!subscriptionConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: subscriptionConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findSubscriptionConnectionByProvider :: An unknown error occurred`,
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
 * Finds all subscription connections by customer IDs.
 *
 * @returns The subscription connection groups containing the customer ID and connections.
 */
export const _findAllSubscriptionConnectionsByCustomerIds = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionConnectionsByCustomerIdsInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionConnectionsByCustomerIdsOutputDto,
    FindAllSubscriptionConnectionsByCustomerIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionConnectionsByCustomerIdsInputDtoSchema.safeParse(
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
    const customerIds = parsedInputData.customerIds;
    const statuses = parsedInputData.filter?.statuses;

    // Step 2: Find all subscription connections
    const connections =
      await billingDataService.findAllSubscriptionConnectionsByCustomerIds(
        customerIds,
        statuses
      );

    const connectionMap = new Map<string, SubscriptionConnectionEntity[]>();

    for (const connection of connections) {
      const customerId = connection.customerId;

      if (!connectionMap.has(customerId)) {
        connectionMap.set(customerId, []);
      }

      connectionMap.get(customerId)?.push(connection);
    }

    return BusinessResult.ok({
      connections: connections,
      connectionMap: connectionMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionConnectionsByCustomerIds :: An unknown error occurred`,
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
 * Finds or creates a subscription connection.
 *
 * @returns The subscription connection if found or created successfully.
 */
export const _findOrCreateSubscriptionConnection = async (
  executionContext: ExecutionContext,
  input: FindOrCreateSubscriptionConnectionInputDto
): Promise<
  BusinessResult<
    FindOrCreateSubscriptionConnectionOutputDto,
    FindOrCreateSubscriptionConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindOrCreateSubscriptionConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const customerId = parsedInputData.customerId;
    const status = parsedInputData.status;
    const cancelAt = parsedInputData.cancelAt;

    // Step 2: Find or create the subscription connection
    const subscriptionConnection =
      await billingDataService.findOrCreateSubscriptionConnection(
        provider,
        providerId,
        providerVersion ?? null,
        customerId,
        status,
        cancelAt
      );

    return BusinessResult.ok({
      created: subscriptionConnection.created,
      connection: subscriptionConnection.subscriptionConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findOrCreateSubscriptionConnection :: An unknown error occurred`,
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
 * Updates a subscription connection by provider.
 *
 * @returns The subscription connection if updated successfully.
 */
export const _updateSubscriptionConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: UpdateSubscriptionConnectionByProviderInputDto
): Promise<
  BusinessResult<
    UpdateSubscriptionConnectionByProviderOutputDto,
    UpdateSubscriptionConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdateSubscriptionConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const status = parsedInputData.status;
    const cancelAt = parsedInputData.cancelAt;

    // Step 2: Ensure that the subscription connection exists
    const existingConnection = await _findSubscriptionConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
      }
    );

    if (!existingConnection.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing subscription connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingConnectionData = existingConnection.data;

    if (!existingConnectionData) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription connection not found for the given provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Update the subscription connection
    const subscriptionConnectionEntity =
      await billingDataService.updateLatestSubscriptionConnection(
        existingConnectionData.connection.id,
        providerVersion,
        status,
        cancelAt
      );

    // If the update was not successful, then the current record is out of date
    if (!subscriptionConnectionEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Subscription connection is out of date',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: subscriptionConnectionEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateSubscriptionConnectionByProvider :: An unknown error occurred`,
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
 * Hydrates a subscription connection.
 * The function finds or creates a subscription connection for a customer.
 * If the record is out of date, it updates the connection with the latest version data.
 *
 * @returns The subscription connection if hydrated successfully.
 */
export const _hydrateSubscriptionConnection = async (
  executionContext: ExecutionContext,
  input: HydrateSubscriptionConnectionInputDto
): Promise<
  BusinessResult<
    HydrateSubscriptionConnectionOutputDto,
    HydrateSubscriptionConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      HydrateSubscriptionConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const customerId = parsedInputData.customerId;
    const status = parsedInputData.status;
    const cancelAt = parsedInputData.cancelAt;

    // Step 2: Find or create the subscription connection for the customer
    const subscriptionResult = await _findOrCreateSubscriptionConnection(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        customerId: customerId,
        status: status,
        cancelAt: cancelAt,
      }
    );

    if (!subscriptionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateSubscriptionConnection :: Failed to find or create subscription connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find or create subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionResultData = subscriptionResult.data;
    const subscriptionConnection = subscriptionResultData.connection;
    const subscriptionVersion = subscriptionConnection.providerVersion;
    const subscriptionCreated = subscriptionResultData.created;

    // Step 3: If the subscription was created, we can return early
    if (subscriptionCreated) {
      return BusinessResult.ok({
        connection: subscriptionConnection,
        created: true,
        hydrated: true,
      });
    }

    // Step 4: Check if the existing subscription connection has an older version that the current event
    const isInputLatestVersion = validateLatestBillingProviderResourceVersion(
      provider,
      providerVersion,
      subscriptionVersion || ''
    );

    // If the subscription connection is not older, we can exit early
    if (!isInputLatestVersion) {
      return BusinessResult.ok({
        connection: subscriptionConnection,
        created: false,
        hydrated: false,
      });
    }

    // Step 5: Update the subscription connection with the new version data
    const updateResult = await _updateSubscriptionConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        status: status,
        cancelAt: cancelAt,
      }
    );

    if (!updateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateSubscriptionConnection :: Failed to update subscription connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to update subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updateResultData = updateResult.data;
    const updatedConnection = updateResultData.connection;

    return BusinessResult.ok({
      connection: updatedConnection,
      created: false,
      hydrated: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _hydrateSubscriptionConnection :: An unknown error occurred`,
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
 * Hydrates a customer's subscription connection.
 * If the customer connection does not exist, it returns a success result with null.
 * The function finds or creates a subscription connection for a customer.
 * If the record is out of date, it updates the connection with the latest version data.
 *
 * @returns The subscription connection if the customer connection exists and the subscription is hydrated successfully,
 * otherwise null.
 */
export const _hydrateCustomerSubscriptionConnection = async (
  executionContext: ExecutionContext,
  input: HydrateCustomerSubscriptionConnectionInputDto
): Promise<
  BusinessResult<
    Nullable<HydrateCustomerSubscriptionConnectionOutputDto>,
    HydrateCustomerSubscriptionConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      HydrateCustomerSubscriptionConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const customerProviderId = parsedInputData.customerProviderId;
    const subscriptionProviderId = parsedInputData.subscriptionProviderId;
    const subscriptionProviderVersion =
      parsedInputData.subscriptionProviderVersion;
    const subscriptionStatus = parsedInputData.subscriptionStatus;
    const cancelAt = parsedInputData.cancelAt;

    // Step 2: Find the customer connection by the provider
    const customerResult = await _findCustomerConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: customerProviderId,
      }
    );

    if (!customerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateCustomerSubscriptionConnection :: Failed to find customer connection by provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find customer connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerResultData = customerResult.data;
    const customerConnection = customerResultData?.connection;

    // If a customer connection does not exist, return success result with null
    if (!customerConnection) {
      return BusinessResult.ok(null);
    }

    // Step 3: Find or create the subscription connection for the customer
    const hydrateResult = await _hydrateSubscriptionConnection(
      executionContext,
      {
        provider: provider,
        providerId: subscriptionProviderId,
        providerVersion: subscriptionProviderVersion,
        customerId: customerConnection.id,
        status: subscriptionStatus,
        cancelAt: cancelAt,
      }
    );

    if (!hydrateResult.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: hydrateResult.data.connection,
      created: hydrateResult.data.created,
      hydrated: hydrateResult.data.hydrated,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _hydrateCustomerSubscriptionConnection :: An unknown error occurred`,
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
 * Deletes all terminal subscription connections by customer ID.
 *
 * @returns The deleted terminal subscription connections if successful.
 */
export const _deleteAllTerminalSubscriptionConnectionsByCustomerId = async (
  executionContext: ExecutionContext,
  input: DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDto
): Promise<
  BusinessResult<
    DeleteAllTerminalSubscriptionConnectionsByCustomerIdOutputDto,
    DeleteAllTerminalSubscriptionConnectionsByCustomerIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDtoSchema.safeParse(
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
    const customerId = parsedInputData.customerId;

    // Step 2: Delete all terminal subscription connections by customer ID
    const connections =
      await billingDataService.deleteAllSubscriptionConnectionsByCustomerIdAndStatuses(
        customerId,
        [...TERMINAL_BILLING_PROVIDER_SUBSCRIPTION_STATUSES]
      );

    return BusinessResult.ok({
      connections: connections,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _deleteAllTerminalSubscriptionConnectionsByCustomerId :: An unknown error occurred`,
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
 * Finds a subscription item connection by ID.
 *
 * @returns The subscription item connection, or null if not found.
 */
export const _findSubscriptionItemConnectionById = async (
  executionContext: ExecutionContext,
  input: FindSubscriptionItemConnectionByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindSubscriptionItemConnectionByIdOutputDto>,
    FindSubscriptionItemConnectionByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindSubscriptionItemConnectionByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionItemId = parsedInputData.subscriptionItemId;

    // Step 2: Find the subscription item connection
    const subscriptionItemConnection =
      await billingDataService.findSubscriptionItemConnectionById(
        subscriptionItemId
      );

    if (!subscriptionItemConnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: subscriptionItemConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findSubscriptionItemConnectionById :: An unknown error occurred`,
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
 * Finds a subscription item connection by provider.
 *
 * @returns The subscription connection, or null if not found.
 */
export const _findSubscriptionItemConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: FindSubscriptionItemConnectionByProviderInputDto
): Promise<
  BusinessResult<
    Nullable<FindSubscriptionItemConnectionByProviderOutputDto>,
    FindSubscriptionItemConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindSubscriptionItemConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;

    // Step 2: Find the subscription item connection
    const subscriptionItemonnection =
      await billingDataService.findSubscriptionItemConnectionByProvider(
        provider,
        providerId
      );

    if (!subscriptionItemonnection) {
      return BusinessResult.ok(null);
    }

    return BusinessResult.ok({
      connection: subscriptionItemonnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findSubscriptionItemConnectionByProvider :: An unknown error occurred`,
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
 * Finds all subscription item connections by subscription ID.
 *
 * @returns A list of subscription item connections associated with the given subscription ID.
 */
export const _findAllSubscriptionItemConnectionsBySubscriptionId = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionItemConnectionsBySubscriptionIdInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionItemConnectionsBySubscriptionIdOutputDto,
    FindAllSubscriptionItemConnectionsBySubscriptionIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionItemConnectionsBySubscriptionIdInputDtoSchema.safeParse(
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
    const subscriptionId = parsedInputData.subscriptionId;

    // Step 2: Find all subscription item connections by subscription ID
    const subscriptionItemConnections =
      await billingDataService.findAllSubscriptionItemConnectionsBySubscriptionId(
        subscriptionId
      );

    return BusinessResult.ok({
      connections: subscriptionItemConnections,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionItemConnectionsBySubscriptionId :: An unknown error occurred`,
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
 * Finds all subscription item connections by subscription ID.
 *
 * @returns A list of subscription item connections associated with the given subscription ID.
 */
export const _findAllSubscriptionItemConnectionsBySubscriptionIds = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionItemConnectionsBySubscriptionIdsOutputDto,
    FindAllSubscriptionItemConnectionsBySubscriptionIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDtoSchema.safeParse(
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
    const subscriptionIds = parsedInputData.subscriptionIds;

    // Step 2: Find all subscription item connections by subscription ID
    const subscriptionItemConnections =
      await billingDataService.findAllSubscriptionItemConnectionsBySubscriptionIds(
        subscriptionIds
      );

    const connectionMap = new Map<string, SubscriptionItemConnectionEntity[]>();

    for (const connection of subscriptionItemConnections) {
      const subscriptionId = connection.subscriptionId;

      if (!connectionMap.has(subscriptionId)) {
        connectionMap.set(subscriptionId, []);
      }

      connectionMap.get(subscriptionId)?.push(connection);
    }

    return BusinessResult.ok({
      connections: subscriptionItemConnections,
      connectionMap: connectionMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionItemConnectionsBySubscriptionIds :: An unknown error occurred`,
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
 * Finds or creates a subscription item connection.
 *
 * @returns The subscription item connection if found or created successfully.
 */
export const _findOrCreateSubscriptionItemConnection = async (
  executionContext: ExecutionContext,
  input: FindOrCreateSubscriptionItemConnectionInputDto
): Promise<
  BusinessResult<
    FindOrCreateSubscriptionItemConnectionOutputDto,
    FindOrCreateSubscriptionItemConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindOrCreateSubscriptionItemConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const subscriptionId = parsedInputData.subscriptionId;
    const priceId = parsedInputData.priceId;
    const quantity = parsedInputData.quantity;
    const currentPeriodStartAt = parsedInputData.currentPeriodStartAt;
    const currentPeriodEndAt = parsedInputData.currentPeriodEndAt;

    // Step 2: Find or create the subscription item connection
    const subscriptionItemConnection =
      await billingDataService.findOrCreateSubscriptionItemConnection(
        provider,
        providerId,
        providerVersion ?? null,
        subscriptionId,
        priceId,
        quantity,
        currentPeriodStartAt,
        currentPeriodEndAt
      );

    return BusinessResult.ok({
      created: subscriptionItemConnection.created,
      connection: subscriptionItemConnection.subscriptionItemConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findOrCreateSubscriptionItemConnection :: An unknown error occurred`,
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
 * Updates a subscription item connection by provider.
 *
 * @returns The subscription item connection if updated successfully.
 */
export const _updateSubscriptionItemConnectionByProvider = async (
  executionContext: ExecutionContext,
  input: UpdateSubscriptionItemConnectionByProviderInputDto
): Promise<
  BusinessResult<
    UpdateSubscriptionItemConnectionByProviderOutputDto,
    UpdateSubscriptionItemConnectionByProviderErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdateSubscriptionItemConnectionByProviderInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const priceId = parsedInputData.priceId;
    const quantity = parsedInputData.quantity;
    const currentPeriodStartAt = parsedInputData.currentPeriodStartAt;
    const currentPeriodEndAt = parsedInputData.currentPeriodEndAt;

    // Step 2: Ensure that the subscription item connection exists
    const existingConnection = await _findSubscriptionItemConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
      }
    );

    if (!existingConnection.isSuccess()) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to find existing subscription item connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingConnectionData = existingConnection.data;

    if (!existingConnectionData) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription item connection not found for the given provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Update the subscription item connection
    const subscriptionItemConnectionEntity =
      await billingDataService.updateLatestSubscriptionItemConnection(
        existingConnectionData.connection.id,
        providerVersion,
        priceId,
        quantity,
        currentPeriodStartAt,
        currentPeriodEndAt
      );

    // If the update was not successful, then the current record is out of date
    if (!subscriptionItemConnectionEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.CONFLICT_ERROR,
        detail: 'Subscription item connection is out of date',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      connection: subscriptionItemConnectionEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateSubscriptionItemConnectionByProvider :: An unknown error occurred`,
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
 * Deletes subscription item connections.
 *
 * @returns The deleted subscription item connections.
 */
export const _deleteSubscriptionItemConnections = async (
  executionContext: ExecutionContext,
  input: DeleteSubscriptionItemConnectionsInputDto
): Promise<
  BusinessResult<
    DeleteSubscriptionItemConnectionsOutputDto,
    DeleteSubscriptionItemConnectionsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      DeleteSubscriptionItemConnectionsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionItemIds = parsedInputData.subscriptionItemIds;

    // Step 2: Delete the subscription item connections
    const connectionEntities =
      await billingDataService.deleteSubscriptionItemConnections(
        subscriptionItemIds
      );

    return BusinessResult.ok({
      connections: connectionEntities,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _deleteSubscriptionItemConnections :: An unknown error occurred`,
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
 * Hydrates a subscription item connection.
 * The function finds or creates a subscription item connection for a customer.
 * If the record is out of date, it updates the connection with the latest version data.
 *
 * @returns The subscription item connection if hydrated successfully.
 */
export const _hydrateSubscriptionItemConnection = async (
  executionContext: ExecutionContext,
  input: HydrateSubscriptionItemConnectionInputDto
): Promise<
  BusinessResult<
    Nullable<HydrateSubscriptionItemConnectionOutputDto>,
    HydrateSubscriptionItemConnectionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      HydrateSubscriptionItemConnectionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerId = parsedInputData.providerId;
    const providerVersion = parsedInputData.providerVersion;
    const subscriptionId = parsedInputData.subscriptionId;
    const providerPriceId = parsedInputData.providerPriceId;
    const quantity = parsedInputData.quantity;
    const currentPeriodStartAt = parsedInputData.currentPeriodStartAt;
    const currentPeriodEndAt = parsedInputData.currentPeriodEndAt;

    // Step 2: Find the price by provider
    const priceResult = await _findPriceConnectionByProvider(executionContext, {
      provider: provider,
      providerId: providerPriceId,
    });

    if (!priceResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateSubscriptionItemConnection :: Failed to find price connection by provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find price connection by provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceResultData = priceResult.data;

    // If a price connection does not exist, return success result with null
    // This is a price that we don't manage, so we can skip it
    if (!priceResultData) {
      return BusinessResult.ok(null);
    }

    const priceConnection = priceResultData.connection;
    const priceId = priceConnection.id;

    // Step 3: Find or create the subscription item connection for the customer
    const subscriptionItemResult =
      await _findOrCreateSubscriptionItemConnection(executionContext, {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        subscriptionId: subscriptionId,
        priceId: priceId,
        quantity: quantity,
        currentPeriodStartAt: currentPeriodStartAt,
        currentPeriodEndAt: currentPeriodEndAt,
      });

    if (!subscriptionItemResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateSubscriptionItemConnection :: Failed to find or create subscription item connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find or create subscription item connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionItemResultData = subscriptionItemResult.data;
    const subscriptionItemConnection = subscriptionItemResultData.connection;
    const subscriptionItemVersion = subscriptionItemConnection.providerVersion;
    const subscriptionItemCreated = subscriptionItemResultData.created;

    // Step 4: If the subscription item was created, we can return early
    if (subscriptionItemCreated) {
      return BusinessResult.ok({
        connection: subscriptionItemConnection,
        created: true,
        hydrated: true,
      });
    }

    // Step 5: Check if the existing subscription item connection has an older version that the current event
    const isInputLatestVersion = validateLatestBillingProviderResourceVersion(
      provider,
      providerVersion,
      subscriptionItemVersion || ''
    );

    // If the subscription item connection is not older, we can exit early
    if (!isInputLatestVersion) {
      return BusinessResult.ok({
        connection: subscriptionItemConnection,
        created: false,
        hydrated: false,
      });
    }

    // Step 6: Update the subscription item connection with the new version data
    const updateResult = await _updateSubscriptionItemConnectionByProvider(
      executionContext,
      {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        priceId: priceId,
        quantity: quantity,
        currentPeriodStartAt: currentPeriodStartAt,
        currentPeriodEndAt: currentPeriodEndAt,
      }
    );

    if (!updateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateSubscriptionItemConnection :: Failed to update subscription item connection`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to update subscription item connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updateResultData = updateResult.data;
    const updatedConnection = updateResultData.connection;

    return BusinessResult.ok({
      connection: updatedConnection,
      created: false,
      hydrated: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _hydrateSubscriptionItemConnection :: An unknown error occurred`,
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
 * Hydrates all subscription item connections for a subscription.
 * The function finds or creates subscription item connections for a subscription.
 * If the record is out of date, it updates the connection with the latest version data.
 * It also deletes subscription item connections that are not present in the input.
 *
 * @returns The hydrated subscription item connections.
 */
export const _hydrateAllSubscriptionItemConnections = async (
  executionContext: ExecutionContext,
  input: HydrateAllSubscriptionItemConnectionsInputDto
): Promise<
  BusinessResult<
    HydrateAllSubscriptionItemConnectionsOutputDto,
    HydrateAllSubscriptionItemConnectionsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      HydrateAllSubscriptionItemConnectionsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionId = parsedInputData.subscriptionId;
    const providerSubscriptionItems = parsedInputData.providerSubscriptionItems;
    const providerSubscriptionItemSet = new Set(
      providerSubscriptionItems.map((item) => item.providerId)
    );

    // Step 2: Find the subscription connection by ID to extract the provider
    const subscriptionConnectionResult = await _findSubscriptionConnectionById(
      executionContext,
      {
        subscriptionId: subscriptionId,
      }
    );

    if (!subscriptionConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateAllSubscriptionItemConnections :: Failed to find subscription connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription connection by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionData = subscriptionConnectionResult.data;

    if (!subscriptionConnectionData) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateAllSubscriptionItemConnections :: Subscription connection data is missing`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Failed to find subscription connection by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionEntity = subscriptionConnectionData.connection;
    const provider = subscriptionConnectionEntity.provider;

    // Step 3: Find all existing subscription items for the subscription
    const existingSubscriptionItemConnectionResult =
      await _findAllSubscriptionItemConnectionsBySubscriptionId(
        executionContext,
        {
          subscriptionId: subscriptionId,
        }
      );

    if (!existingSubscriptionItemConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateAllSubscriptionItemConnections :: Failed to find existing subscription item connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find existing subscription item connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const existingSubscriptionItemConnectionData =
      existingSubscriptionItemConnectionResult.data;
    const existingSubscriptionItemConnectionEntities =
      existingSubscriptionItemConnectionData.connections;

    // Step 4: Hydrate each subscription item connection
    const hydrationResults = await Promise.all(
      providerSubscriptionItems.map(async (existingConnection) => {
        return await _hydrateSubscriptionItemConnection(executionContext, {
          provider: provider,
          providerId: existingConnection.providerId,
          providerPriceId: existingConnection.providerPriceId,
          providerVersion: existingConnection.providerVersion,
          subscriptionId: subscriptionId,
          quantity: existingConnection.quantity,
          currentPeriodStartAt: existingConnection.currentPeriodStartAt,
          currentPeriodEndAt: existingConnection.currentPeriodEndAt,
        });
      })
    );

    // Map the hydration results to the output DTO
    const hydrationSuccessResults: HydrateSubscriptionItemConnectionOutputDto[] =
      [];
    const hydrationFailureResults: HydrateSubscriptionItemConnectionErrorDto[] =
      [];

    for (const result of hydrationResults) {
      if (!result.isSuccess()) {
        hydrationFailureResults.push(...result.errors);
      }

      if (result.data) {
        hydrationSuccessResults.push(result.data);
      }
    }

    // If ANY errors occur during hydration, return a failure result
    if (hydrationFailureResults.length) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateAllSubscriptionItemConnections :: Failed to hydrate all subscription item connections`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate all subscription item connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Delete the subscription item connections that are not in the input
    const deletionCandidates =
      existingSubscriptionItemConnectionEntities.filter(
        (connection) => !providerSubscriptionItemSet.has(connection.providerId)
      );

    const deletionResults = await _deleteSubscriptionItemConnections(
      executionContext,
      {
        subscriptionItemIds: deletionCandidates.map(
          (connection) => connection.id
        ),
      }
    );

    if (!deletionResults.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _hydrateAllSubscriptionItemConnections :: Failed to delete subscription item connections`,
        {
          input: input,
          context: executionContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to delete subscription item connections',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const deletionResultsData = deletionResults.data;
    const deletedConnections = deletionResultsData.connections;

    // Step 6: Prepare the output DTO
    const results: HydrateAllSubscriptionItemConnectionsOutputDto['results'] = [
      ...hydrationSuccessResults.map((hydratedResult) => ({
        connection: hydratedResult.connection,
        created: hydratedResult.created,
        hydrated: hydratedResult.hydrated,
        deleted: false,
      })),
      ...deletedConnections.map((deletedConnection) => ({
        connection: deletedConnection,
        created: false,
        hydrated: false,
        deleted: true,
      })),
    ];

    return BusinessResult.ok({
      results: results,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _hydrateAllSubscriptionItemConnections :: An unknown error occurred`,
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
 * Finds a subscription plan by ID.
 *
 * @returns The subscription plan, or null if not found.
 */
export const _findSubscriptionPlanById = async (
  executionContext: ExecutionContext,
  input: FindSubscriptionPlanByIdInputDto
): Promise<
  BusinessResult<
    Nullable<FindSubscriptionPlanByIdOutputDto>,
    FindSubscriptionPlanByIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = FindSubscriptionPlanByIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const planId = parsedInputData.planId;

    // Step 2: Find the subscription plan aggregate by plan ID
    const planAggregate =
      await billingDataService.findSubscriptionPlanAggregateById(planId);

    if (!planAggregate) {
      return BusinessResult.ok(null);
    }

    const subscriptionPlan = mapSubscriptionPlan({
      plan: planAggregate.plan,
      price: planAggregate.price,
      family: planAggregate.family,
      familyFeatures: planAggregate.familyFeatures,
    }) as SubscriptionPlan;

    return BusinessResult.ok({
      plan: subscriptionPlan,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findSubscriptionPlanById :: An unknown error occurred`,
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
 * Finds all subscription plans by family IDs.
 *
 * @returns The subscription plans for the input family IDs.
 */
export const _findAllSubscriptionPlansByFamilyIds = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionPlansByFamilyIdsInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionPlansByFamilyIdsOutputDto,
    FindAllSubscriptionPlansByFamilyIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionPlansByFamilyIdsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const familyIds = parsedInputData.familyIds;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Retrieve the plan aggregates by family IDs
    const planAggregates =
      await billingDataService.findAllSubscriptionPlanAggregatesByFamilyIds(
        familyIds,
        familyTypes,
        familySetupTypes
      );

    const plans: SubscriptionPlan[] = [];
    const planMap: Map<string, SubscriptionPlan[]> = new Map();

    for (const aggregate of planAggregates) {
      const plan = mapSubscriptionPlan({
        plan: aggregate.plan,
        price: aggregate.price,
        family: aggregate.family,
        familyFeatures: aggregate.familyFeatures,
      }) as SubscriptionPlan;

      plans.push(plan);

      if (!planMap.has(aggregate.family.id)) {
        planMap.set(aggregate.family.id, []);
      }
      planMap.get(aggregate.family.id)?.push(plan);
    }

    return BusinessResult.ok({
      plans: plans,
      planMap: planMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionPlansByFamilyIds :: An unknown error occurred`,
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
 * Finds all subscription plans by price IDs.
 *
 * @returns The subscription plans for the input price IDs.
 */
export const _findAllSubscriptionPlansByPriceIds = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionPlansByPriceIdsInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionPlansByPriceIdsOutputDto,
    FindAllSubscriptionPlansByPriceIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionPlansByPriceIdsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const priceIds = parsedInputData.priceIds;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Find all the subscription plan aggregates by price IDs
    const planAggregates =
      await billingDataService.findAllSubscriptionPlanAggregatesByPriceIds(
        priceIds,
        familyTypes,
        familySetupTypes
      );

    const plans: SubscriptionPlan[] = [];
    const planMap: Map<string, SubscriptionPlan> = new Map();

    for (const aggregate of planAggregates) {
      const plan = mapSubscriptionPlan({
        plan: aggregate.plan,
        price: aggregate.price,
        family: aggregate.family,
        familyFeatures: aggregate.familyFeatures,
      }) as SubscriptionPlan;

      plans.push(plan);
      planMap.set(aggregate.price.id, plan);
    }

    return BusinessResult.ok({
      plans: plans,
      planMap: planMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionPlansByPriceIds :: An unknown error occurred`,
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
 * Finds all subscription plans by subscription IDs.
 * This function will retrieve all the subscription item connections for the given subscription IDs,
 * then find all the subscription plans associated with those connections.
 *
 * @returns The subscription plans for the input subscription IDs.
 */
export const _findAllSubscriptionPlansBySubscriptionIds = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionPlansBySubscriptionIdsInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionPlansBySubscriptionIdsOutputDto,
    FindAllSubscriptionPlansBySubscriptionIdsErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionPlansBySubscriptionIdsInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionIds = parsedInputData.subscriptionIds;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Find all the subscription item connections by subscription IDs
    const subscriptionItemConnectionsResult =
      await _findAllSubscriptionItemConnectionsBySubscriptionIds(
        executionContext,
        {
          subscriptionIds: subscriptionIds,
        }
      );

    if (!subscriptionItemConnectionsResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllSubscriptionPlansBySubscriptionIds :: Failed to find subscription item connections by subscription ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail:
          'Failed to find subscription item connections by subscription IDs',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const itemConnectionData = subscriptionItemConnectionsResult.data;
    const itemConnections = itemConnectionData.connections;
    const priceIds = itemConnections.map((connection) => connection.priceId);

    // Step 3: Find all the subscription plan frequencies by subscription item prices
    const planResult = await _findAllSubscriptionPlansByPriceIds(
      executionContext,
      {
        priceIds: priceIds,
        filter: {
          family: {
            types: familyTypes,
            setupTypes: familySetupTypes,
          },
        },
      }
    );

    if (!planResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllSubscriptionPlansBySubscriptionIds :: Failed to find subscription plans by price IDs`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plans by price IDs',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const planData = planResult.data;
    const plans = planData.plans;
    const pricePlanMap = planData.planMap;

    // Step 4: Map the subscription plans to the output DTO
    // For a given subscription key, get all subscription plan data
    const planMap = new Map<string, SubscriptionItemConnectionPlanDto[]>();

    for (const itemConnection of itemConnections) {
      const priceId = itemConnection.priceId;
      const subscriptionId = itemConnection.subscriptionId;

      const plan = pricePlanMap.get(priceId);

      if (!plan) {
        continue;
      }

      if (!planMap.has(subscriptionId)) {
        planMap.set(subscriptionId, []);
      }

      planMap.get(subscriptionId)?.push({
        connection: itemConnection,
        plan: plan,
      });
    }

    return BusinessResult.ok({
      plans: plans,
      planMap: planMap,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionPlansBySubscriptionIds :: An unknown error occurred`,
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
 * Find all subscription plans by family group key.
 *
 * @returns The subscription plans for the input family group key.
 */
export const _findAllSubscriptionPlansByFamilyGroupKey = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionPlansByFamilyGroupKeyInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionPlansByFamilyGroupKeyOutputDto,
    FindAllSubscriptionPlansByFamilyGroupKeyErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionPlansByFamilyGroupKeyInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const groupKey = parsedInputData.groupKey;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Find all subscription plans by family group key
    const groupEntity =
      await billingDataService.findSubscriptionPlanFamilyGroupByKey(groupKey);

    if (!groupEntity) {
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription family group not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find all the subscription plan group items by group ID
    const groupItemEntities =
      await billingDataService.findAllSubscriptionPlanFamilyGroupItemsByGroupId(
        groupEntity.id
      );

    const familyGroupItemMap = new Map<
      string,
      SubscriptionPlanFamilyGroupItemEntity
    >(groupItemEntities.map((item) => [item.familyId, item]));

    // Step 4: Find all subscription plans by family IDs
    const planResult = await _findAllSubscriptionPlansByFamilyIds(
      executionContext,
      {
        familyIds: Array.from(familyGroupItemMap.keys()),
        filter: {
          family: {
            types: familyTypes,
            setupTypes: familySetupTypes,
          },
        },
      }
    );

    if (!planResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllSubscriptionPlansByFamilyGroupKey :: Failed to find subscription plans`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plans',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const planResultData = planResult.data;
    const plans = planResultData.plans;

    // Step 5: Sort the plans by the group item order
    const sortedPlans = plans.sort((a, b) => {
      const aFamilyGroupItem = familyGroupItemMap.get(a.id);
      const bFamilyGroupItem = familyGroupItemMap.get(b.id);

      if (aFamilyGroupItem && bFamilyGroupItem) {
        return aFamilyGroupItem.order - bFamilyGroupItem.order;
      }

      return 0;
    });

    return BusinessResult.ok({
      plans: sortedPlans,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionPlansByFamilyGroupKey :: An unknown error occurred`,
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
 * Find all subscription plans that are available for upgrade or downgrade on a specific family.
 *
 * @returns A map of paths to the available subscription plans.
 */
export const _findAllSubscriptionPlanFamilyPathsByFamilyId = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionPlanFamilyPathsByFamilyIdOutputDto,
    FindAllSubscriptionPlanFamilyPathsByFamilyIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDtoSchema.safeParse(
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
    const familyId = parsedInputData.familyId;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Find the group item by family ID
    const groupItemEntity =
      await billingDataService.findSubscriptionPlanFamilyGroupItemByFamilyId(
        familyId
      );

    // If the family doesn't belong to a group, return an empty map
    if (!groupItemEntity) {
      return BusinessResult.ok({
        plans: [],
        paths: SubscriptionPlanPathDto.withEmptyPaths(),
      });
    }

    const groupItemId = groupItemEntity.id;

    // Step 3: Find the group paths the from item ID
    const availableGroupPathEntities =
      await billingDataService.findAllSubscriptionPlanFamilyGroupPathsByFromItemId(
        groupItemId
      );

    const availableGroupItemIds = availableGroupPathEntities.map(
      (path) => path.toItemId
    );

    // Step 4: Find all the available group items by their IDs
    const availableGroupItemEntities =
      await billingDataService.findAllSubscriptionPlanFamilyGroupItemsByIds(
        availableGroupItemIds
      );

    const familyIds = availableGroupItemEntities.map((item) => item.familyId);

    // Step 5: Find all of the plans by the families
    const planResult = await _findAllSubscriptionPlansByFamilyIds(
      executionContext,
      {
        familyIds: familyIds,
        filter: {
          family: {
            types: familyTypes,
            setupTypes: familySetupTypes,
          },
        },
      }
    );

    if (!planResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllSubscriptionPlanFamilyPathsByFamilyId :: Failed to find subscription plans by IDs`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plans by IDs',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const planResultData = planResult.data;
    const plans = planResultData.plans;

    const paths = calculateSubscriptionPlanFamilyPaths(
      groupItemId,
      availableGroupItemEntities,
      availableGroupPathEntities,
      plans
    );

    return BusinessResult.ok({
      plans: plans,
      paths: paths,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionPlanFamilyPathsByFamilyId :: An unknown error occurred`,
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
 * Find all subscription plans that are available for upgrade or downgrade on a specific plan.
 *
 * @returns A map of paths to the available subscription plans.
 */
export const _findAllSubscriptionPlanFamilyPathsByPlanId = async (
  executionContext: ExecutionContext,
  input: FindAllSubscriptionPlanFamilyPathsByPlanIdInputDto
): Promise<
  BusinessResult<
    FindAllSubscriptionPlanFamilyPathsByPlanIdOutputDto,
    FindAllSubscriptionPlanFamilyPathsByPlanIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllSubscriptionPlanFamilyPathsByPlanIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const planId = parsedInputData.planId;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Find the subscription plan by ID
    const planResult = await _findSubscriptionPlanById(executionContext, {
      planId: planId,
    });

    if (!planResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllSubscriptionPlanFamilyPathsByPlanId :: Failed to find subscription plan by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plan by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const planData = planResult.data;

    if (!planData) {
      return BusinessResult.ok({
        paths: SubscriptionPlanPathDto.withEmptyPaths(),
      });
    }

    const plan = planData.plan;

    // Step 3: Find all the paths for the plans family
    const pathResult = await _findAllSubscriptionPlanFamilyPathsByFamilyId(
      executionContext,
      {
        familyId: plan.familyId,
        filter: {
          family: {
            types: familyTypes,
            setupTypes: familySetupTypes,
          },
        },
      }
    );

    if (!pathResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllSubscriptionPlanFamilyPathsByPlanId :: Failed to find subscription plan paths by family ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plan paths by family ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const pathData = pathResult.data;
    const paths = pathData.paths;

    return BusinessResult.ok({
      paths: paths,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllSubscriptionPlanFamilyPathsByPlanId :: An unknown error occurred`,
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
 * Find all available subscription plans by plan ID.
 *
 * @returns The available subscription plans for the input plan ID.
 */
export const _findAllAvailableSubscriptionPlansByPlanId = async (
  executionContext: ExecutionContext,
  input: FindAllAvailableSubscriptionPlansByPlanIdInputDto
): Promise<
  BusinessResult<
    FindAllAvailableSubscriptionPlansByPlanIdOutputDto,
    FindAllAvailableSubscriptionPlansByPlanIdErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      FindAllAvailableSubscriptionPlansByPlanIdInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const planId = parsedInputData.planId;
    const quantity = parsedInputData.quantity;
    const familyTypes = parsedInputData.filter?.family?.types;
    const familySetupTypes = parsedInputData.filter?.family?.setupTypes;

    // Step 2: Find the subscription plan by ID
    const planResult = await _findSubscriptionPlanById(executionContext, {
      planId: planId,
    });

    if (!planResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllAvailableSubscriptionPlansByPlanId :: Failed to find subscription plan`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plan',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const planData = planResult.data;

    if (!planData) {
      logger.warn(
        `${LOG_PREFIX} :: _findAllAvailableSubscriptionPlansByPlanId :: Subscription plan not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription plan not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const currentPlan = planData.plan;
    const currentPlanFamilyId = currentPlan.familyId;

    // Step 3: Find all plans in the same family
    const familyPlanResult = await _findAllSubscriptionPlansByFamilyIds(
      executionContext,
      {
        familyIds: [currentPlanFamilyId],
        filter: {
          family: {
            types: familyTypes,
            setupTypes: familySetupTypes,
          },
        },
      }
    );

    if (!familyPlanResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllAvailableSubscriptionPlansByPlanId :: Failed to find subscription plans by family IDs`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plans by family IDs',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const familyPlanData = familyPlanResult.data;
    const familyPlans = familyPlanData.plans;
    const availableFamilyPlans = familyPlans.filter(
      (targetPlan) => targetPlan.id !== currentPlan.id
    );

    // Step 4: Find all the plans that are in different families that can be purchased together
    const familyGroupPathResult =
      await _findAllSubscriptionPlanFamilyPathsByFamilyId(executionContext, {
        familyId: currentPlanFamilyId,
      });

    if (!familyGroupPathResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _findAllAvailableSubscriptionPlansByPlanId :: Failed to find subscription plan paths by family ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plan paths by family ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const familyGroupPathData = familyGroupPathResult.data;
    const familyGroupPlans = familyGroupPathData.plans;
    const familyPaths = familyGroupPathData.paths;

    const availablePlans: SubscriptionPlan[] = [
      ...availableFamilyPlans,
      ...familyGroupPlans,
    ];

    // Step 5: Calculate the plan price paths
    const pricePaths = calculateSubscriptionPlanPricePaths(
      quantity,
      currentPlan,
      availablePlans
    );

    // Step 6: Calculate the plan frequency paths
    const frequencyPaths = calculateSubscriptionPlanFrequencyPaths(
      currentPlan,
      availablePlans
    );

    return BusinessResult.ok({
      plan: currentPlan,
      availablePlans: availablePlans,
      familyPaths: familyPaths,
      pricePaths: pricePaths,
      frequencyPaths: frequencyPaths,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _findAllAvailableSubscriptionPlansByPlanId :: An unknown error occurred`,
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
 * Creates a checkout session for a provided subscription plan.
 *
 * @returns The result of the checkout session creation.
 */
export const _createSubscriptionPlanCheckoutSession = async (
  executionContext: ExecutionContext,
  input: CreateSubscriptionPlanCheckoutSessionInputDto
): Promise<
  BusinessResult<
    CreateSubscriptionPlanCheckoutSessionOutputDto,
    CreateSubscriptionPlanCheckoutSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateSubscriptionPlanCheckoutSessionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const customerId = parsedInputData.customerId;
    const planId = parsedInputData.planId;
    const quantity = parsedInputData.quantity;
    const redirectUrl = parsedInputData.redirectUrl;

    // Step 2: Find the subscription plan by ID
    const planResult = await _findSubscriptionPlanById(executionContext, {
      planId: planId,
    });

    if (!planResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Failed to find subscription plan by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find subscription plan by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const planData = planResult.data;

    if (!planData) {
      logger.warn(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Subscription plan not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription plan not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const plan = planData.plan;

    // Step 3: Find the customer by ID
    const customerResult = await _findCustomerConnectionById(executionContext, {
      customerId: customerId,
    });

    if (!customerResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Failed to find customer connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find customer connection by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerData = customerResult.data;

    if (!customerData) {
      logger.warn(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Customer connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Customer connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerConnection = customerData.connection;
    const provider = customerConnection.provider;
    const providerCustomerId = customerConnection.providerId;

    // Step 4: Ensure that the plan provider and the customer provider match
    if (plan.provider !== customerConnection.provider) {
      logger.warn(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Plan provider does not match customer provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Plan provider does not match customer provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Find the provider price connection by price ID
    const priceConnectionResult = await _findPriceConnectionById(
      executionContext,
      {
        priceId: plan.priceId,
      }
    );

    if (!priceConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Failed to find price connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find price connection by ID',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceData = priceConnectionResult.data;

    if (!priceData) {
      logger.warn(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Price connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Price connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceConnection = priceData.connection;
    const providerPriceId = priceConnection.providerId;

    // Step 6: Attach the plan to the redirect URL
    const hydratedRedirectUrl = new URL(redirectUrl);
    hydratedRedirectUrl.searchParams.set(
      SUBSCRIPTION_PLAN_CHECKOUT_SESSION_SEARCH_PARAM_KEY,
      plan.id
    );

    // Step 7: Create the checkout session
    const sessionResult = await _createProviderSubscriptionCheckoutSession(
      executionContext,
      {
        providerCustomerId: providerCustomerId,
        providerPriceId: providerPriceId,
        provider: provider,
        quantity: quantity,
        redirectUrl: hydratedRedirectUrl.toString(),
      }
    );

    if (!sessionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: Failed to create provider subscription checkout session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create provider subscription checkout session',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const sessionData = sessionResult.data;
    const session = sessionData.session;

    return BusinessResult.ok({
      session: session,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createSubscriptionPlanCheckoutSession :: An unknown error occurred`,
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
 * Cancels a provider subscription at the end of the current billing period.
 *
 * @returns The provider subscription.
 */
export const _cancelProviderSubscriptionAtPeriodEnd = async (
  executionContext: ExecutionContext,
  input: CancelProviderSubscriptionAtPeriodEndInputDto
): Promise<
  BusinessResult<
    CancelProviderSubscriptionAtPeriodEndOutputDto,
    CancelProviderSubscriptionAtPeriodEndErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CancelProviderSubscriptionAtPeriodEndInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const providerId = parsedInputData.providerId;
    const provider = parsedInputData.provider;

    // Step 2: Cancel the subscription on the provider
    const providerSubscription =
      await billingProviderService.cancelProviderSubscriptionAtPeriodEnd(
        provider,
        providerId
      );

    return BusinessResult.ok({
      provider: providerSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cancelProviderSubscriptionAtPeriodEnd :: An unknown error occurred`,
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
 * Cancels a subscription at the end of the current billing period.
 *
 * @returns The subscription connection and provider subscription.
 */
export const _cancelSubscriptionAtPeriodEnd = async (
  executionContext: ExecutionContext,
  input: CancelSubscriptionAtPeriodEndInputDto
): Promise<
  BusinessResult<
    CancelSubscriptionAtPeriodEndOutputDto,
    CancelSubscriptionAtPeriodEndErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CancelSubscriptionAtPeriodEndInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionId = parsedInputData.subscriptionId;

    // Step 2: Find the subscription connection by ID
    const subscriptionConnectionResult = await _findSubscriptionConnectionById(
      executionContext,
      {
        subscriptionId: subscriptionId,
      }
    );

    if (!subscriptionConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelSubscriptionAtPeriodEnd :: Failed to find subscription connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionData = subscriptionConnectionResult.data;

    if (!subscriptionConnectionData) {
      logger.warn(
        `${LOG_PREFIX} :: _cancelSubscriptionAtPeriodEnd :: Subscription connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }
    const subscriptionConnection = subscriptionConnectionData.connection;

    // Step 3: Ensure the subscription is cancellable
    if (!subscriptionConnection.isCancellable()) {
      logger.warn(
        `${LOG_PREFIX} :: _cancelSubscriptionAtPeriodEnd :: Subscription is not cancellable`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Subscription is not cancellable',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Store the date the action occurs BEFORE we cancel the subscription
    const actionDate = new Date();

    // Step 4: Cancel the subscription on the provider
    const cancelResult = await _cancelProviderSubscriptionAtPeriodEnd(
      executionContext,
      {
        providerId: subscriptionConnection.providerId,
        provider: subscriptionConnection.provider,
      }
    );

    if (!cancelResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelSubscriptionAtPeriodEnd :: Failed to cancel provider subscription at period end`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to cancel provider subscription at period end',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const cancelData = cancelResult.data;
    const providerSubscription = cancelData.provider;
    const providerVersion = generateBillingProviderResourceVersion(
      cancelData.provider.provider,
      actionDate
    );

    // Step 5: Hydrate the subscription connection to reflect the cancellation
    const updatedSubscriptionConnection = await _hydrateSubscriptionConnection(
      executionContext,
      {
        provider: providerSubscription.provider,
        providerId: providerSubscription.id,
        providerVersion: providerVersion,
        customerId: subscriptionConnection.customerId,
        status: providerSubscription.status,
        cancelAt: providerSubscription.cancelAt,
      }
    );

    if (!updatedSubscriptionConnection.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _cancelSubscriptionAtPeriodEnd :: Failed to hydrate subscription connection after cancellation`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription connection after cancellation',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updatedSubscriptionConnectionData =
      updatedSubscriptionConnection.data;
    const updatedSubscriptionConnectionEntity =
      updatedSubscriptionConnectionData.connection;

    return BusinessResult.ok({
      connection: updatedSubscriptionConnectionEntity,
      provider: providerSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cancelSubscriptionAtPeriodEnd :: An unknown error occurred`,
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
 * Resumes billing on a provider subscription set to cancel at period end.
 *
 * @returns The provider subscription.
 */
export const _resumeCancelledProviderSubscription = async (
  executionContext: ExecutionContext,
  input: ResumeCancelledProviderSubscriptionInputDto
): Promise<
  BusinessResult<
    ResumeCancelledProviderSubscriptionOutputDto,
    ResumeCancelledProviderSubscriptionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      ResumeCancelledProviderSubscriptionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const providerId = parsedInputData.providerId;
    const provider = parsedInputData.provider;

    // Step 2: Resume the subscription on the provider
    const providerSubscription =
      await billingProviderService.resumeCancelledProviderSubscription(
        provider,
        providerId
      );

    return BusinessResult.ok({
      provider: providerSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _resumeCancelledProviderSubscription :: An unknown error occurred`,
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
 * Resumes billing on a subscription set to cancel at period end.
 *
 * @return The subscription connection and provider subscription.
 */
export const _resumeCancelledSubscription = async (
  executionContext: ExecutionContext,
  input: ResumeCancelledSubscriptionInputDto
): Promise<
  BusinessResult<
    ResumeCancelledSubscriptionOutputDto,
    ResumeCancelledSubscriptionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      ResumeCancelledSubscriptionInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionId = parsedInputData.subscriptionId;

    // Step 2: Find the subscription connection by ID
    const subscriptionConnectionResult = await _findSubscriptionConnectionById(
      executionContext,
      {
        subscriptionId: subscriptionId,
      }
    );

    if (!subscriptionConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledSubscription :: Failed to find subscription connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionData = subscriptionConnectionResult.data;

    if (!subscriptionConnectionData) {
      logger.warn(
        `${LOG_PREFIX} :: _resumeCancelledSubscription :: Subscription connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }
    const subscriptionConnection = subscriptionConnectionData.connection;

    // Step 3: Ensure the subscription is resumable
    if (!subscriptionConnection.isResumable()) {
      logger.warn(
        `${LOG_PREFIX} :: _resumeCancelledSubscription :: Subscription is not resumable`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Subscription is not resumable',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Store the date the action occurs BEFORE we resume the subscription
    const actionDate = new Date();

    // Step 4: Resume the subscription
    const resumeResult = await _resumeCancelledProviderSubscription(
      executionContext,
      {
        providerId: subscriptionConnection.providerId,
        provider: subscriptionConnection.provider,
      }
    );

    if (!resumeResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledSubscription :: Failed to resume provider subscription`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to resume provider subscription',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const resumeData = resumeResult.data;
    const providerSubscription = resumeData.provider;
    const providerVersion = generateBillingProviderResourceVersion(
      resumeData.provider.provider,
      actionDate
    );

    // Step 5: Hydrate the subscription connection to reflect the resumption
    const updatedSubscriptionConnection = await _hydrateSubscriptionConnection(
      executionContext,
      {
        provider: providerSubscription.provider,
        providerId: providerSubscription.id,
        providerVersion: providerVersion,
        customerId: subscriptionConnection.customerId,
        status: providerSubscription.status,
        cancelAt: providerSubscription.cancelAt,
      }
    );

    if (!updatedSubscriptionConnection.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _resumeCancelledSubscription :: Failed to hydrate subscription connection after resumption`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription connection after resumption',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updatedSubscriptionConnectionData =
      updatedSubscriptionConnection.data;
    const updatedSubscriptionConnectionEntity =
      updatedSubscriptionConnectionData.connection;

    return BusinessResult.ok({
      provider: providerSubscription,
      connection: updatedSubscriptionConnectionEntity,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _resumeCancelledSubscription :: Unexpected error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Unexpected error occurred',
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
 * Creates a payment method management session for a provider.
 *
 * @returns The payment method management session.
 */
export const _createProviderPaymentMethodManagementSession = async (
  executionContext: ExecutionContext,
  input: CreateProviderPaymentMethodManagementSessionInputDto
): Promise<
  BusinessResult<
    CreateProviderPaymentMethodManagementSessionOutputDto,
    CreateProviderPaymentMethodManagementSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateProviderPaymentMethodManagementSessionInputDtoSchema.safeParse(
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
    const provider = parsedInputData.provider;
    const providerCustomerId = parsedInputData.providerCustomerId;
    const returnUrl = parsedInputData.returnUrl;

    // Step 2: Create the payment method management session on the provider
    const session =
      await billingProviderService.createProviderPaymentMethodManagementSession(
        provider,
        providerCustomerId,
        returnUrl
      );

    return BusinessResult.ok({
      session: session,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _createProviderPaymentMethodManagementSession :: Unexpected error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Unexpected error occurred',
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
 * Creates a customer payment method management session.
 *
 * @returns The payment method management session.
 */
export const _createCustomerPaymentMethodManagementSession = async (
  executionContext: ExecutionContext,
  input: CreateCustomerPaymentMethodManagementSessionInputDto
): Promise<
  BusinessResult<
    CreateCustomerPaymentMethodManagementSessionOutputDto,
    CreateCustomerPaymentMethodManagementSessionErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CreateCustomerPaymentMethodManagementSessionInputDtoSchema.safeParse(
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
    const customerId = parsedInputData.customerId;
    const returnUrl = parsedInputData.returnUrl;

    // Step 2: Find the customer connection by ID
    const customerConnectionResult = await _findCustomerConnectionById(
      executionContext,
      {
        customerId: customerId,
      }
    );

    if (!customerConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createCustomerPaymentMethodManagementSession :: Failed to find customer connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find customer connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerConnectionResultData = customerConnectionResult.data;

    if (!customerConnectionResultData) {
      logger.error(
        `${LOG_PREFIX} :: _createCustomerPaymentMethodManagementSession :: Customer connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Customer connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const customerConnection = customerConnectionResultData.connection;

    // Step 3: Create the payment method management session on the provider
    const sessionResult = await _createProviderPaymentMethodManagementSession(
      executionContext,
      {
        provider: customerConnection.provider,
        providerCustomerId: customerConnection.providerId,
        returnUrl: returnUrl,
      }
    );

    if (!sessionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _createCustomerPaymentMethodManagementSession :: Failed to create provider payment method management session`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to create provider payment method management session',
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
      `${LOG_PREFIX} :: _createCustomerPaymentMethodManagementSession :: Unexpected error occurred`,
      injectExceptionDetails(error, {
        input: input,
        context: loggingContext,
      })
    );
    return BusinessResult.fail({
      code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
      detail: 'Unexpected error occurred',
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
 * Updates a subscription item's price for a provider subscription.
 *
 * @returns The updated provider subscription item.
 */
export const _updateProviderSubscriptionItemPrice = async (
  executionContext: ExecutionContext,
  input: UpdateProviderSubscriptionItemPriceInputDto
): Promise<
  BusinessResult<
    UpdateProviderSubscriptionItemPriceOutputDto,
    UpdateProviderSubscriptionItemPriceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdateProviderSubscriptionItemPriceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerSubscriptionId = parsedInputData.providerSubscriptionId;
    const providerSubscriptionItemId =
      parsedInputData.providerSubscriptionItemId;
    const providerPriceId = parsedInputData.providerPriceId;
    const quantity = parsedInputData.quantity;
    const prorate = parsedInputData.prorate;
    const chargeImmediately = parsedInputData.chargeImmediately;
    const resetBillingCycle = parsedInputData.resetBillingCycle;

    // Step 2: Update the subscription item price on the provider
    const providerSubscription =
      await billingProviderService.updateProviderSubscriptionItemPrice(
        provider,
        providerSubscriptionId,
        providerSubscriptionItemId,
        providerPriceId,
        quantity,
        prorate,
        chargeImmediately,
        resetBillingCycle
      );

    return BusinessResult.ok({
      provider: providerSubscription,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateProviderSubscriptionItemPrice :: An unknown error occurred`,
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
 * Updates a subscription item's price for a subscription.
 *
 * @returns the updated provider subscription item and the updated subscription item connection.
 */
export const _updateSubscriptionItemPrice = async (
  executionContext: ExecutionContext,
  input: UpdateSubscriptionItemPriceInputDto
): Promise<
  BusinessResult<
    UpdateSubscriptionItemPriceOutputDto,
    UpdateSubscriptionItemPriceErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      UpdateSubscriptionItemPriceInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionItemId = parsedInputData.subscriptionItemId;
    const priceId = parsedInputData.priceId;
    const quantity = parsedInputData.quantity;
    const prorate = parsedInputData.prorate;
    const chargeImmediately = parsedInputData.chargeImmediately;
    const resetBillingCycle = parsedInputData.resetBillingCycle;

    // Step 2: Find the subscription item connection by ID
    const subscriptionItemConnectionResult =
      await _findSubscriptionItemConnectionById(executionContext, {
        subscriptionItemId: subscriptionItemId,
      });

    if (!subscriptionItemConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Failed to find subscription item connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find subscription item connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionItemConnectionData =
      subscriptionItemConnectionResult.data;

    if (!subscriptionItemConnectionData) {
      logger.warn(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Subscription item connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription item connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionItemConnection =
      subscriptionItemConnectionData.connection;
    const subscriptionItemProvider = subscriptionItemConnection.provider;
    const providerSubscriptionItemId = subscriptionItemConnection.providerId;
    const subscriptionId = subscriptionItemConnection.subscriptionId;

    // Step 3: Find the price connection by ID
    const priceConnectionResult = await _findPriceConnectionById(
      executionContext,
      {
        priceId: priceId,
      }
    );

    if (!priceConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Failed to find price connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find price connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceConnectionData = priceConnectionResult.data;

    if (!priceConnectionData) {
      logger.warn(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Price connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Price connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const priceConnection = priceConnectionData.connection;
    const priceProvider = priceConnection.provider;
    const providerPriceId = priceConnection.providerId;

    // Step 4: Ensure that the subscription item provider matches the price provider
    if (subscriptionItemProvider !== priceProvider) {
      logger.warn(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Subscription item provider does not match price provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Subscription item provider does not match price provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Find the subscription connection by ID
    const subscriptionConnectionResult = await _findSubscriptionConnectionById(
      executionContext,
      {
        subscriptionId: subscriptionItemConnection.subscriptionId,
      }
    );

    if (!subscriptionConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Failed to find subscription connection by ID`,
        {
          input: input,
          context: executionContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find subscription connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnectionData = subscriptionConnectionResult.data;

    if (!subscriptionConnectionData) {
      logger.warn(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Subscription connection not found`,
        {
          input: input,
          context: executionContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionConnection = subscriptionConnectionData.connection;
    const providerSubscriptionId = subscriptionConnection.providerId;

    // Store the date the action occurs BEFORE we update the subscription item price
    const actionDate = new Date();

    // Step 6: Update the subscription item price
    const updateResult = await _updateProviderSubscriptionItemPrice(
      executionContext,
      {
        provider: subscriptionItemProvider,
        providerPriceId: providerPriceId,
        providerSubscriptionId: providerSubscriptionId,
        providerSubscriptionItemId: providerSubscriptionItemId,
        quantity: quantity,
        prorate: prorate,
        chargeImmediately: chargeImmediately,
        resetBillingCycle: resetBillingCycle,
      }
    );

    if (!updateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Failed to update provider subscription item price`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to update provider subscription item price',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updateData = updateResult.data;
    const updatedProviderSubscriptionItem = updateData.provider;

    // Step 7: Hydrate the subscription item connection to reflect the updated price
    const hydratedSubscriptionItemConnectionResult =
      await _hydrateSubscriptionItemConnection(executionContext, {
        provider: subscriptionItemProvider,
        providerId: providerSubscriptionItemId,
        providerPriceId: providerPriceId,
        providerVersion: generateBillingProviderResourceVersion(
          subscriptionItemProvider,
          actionDate
        ),
        subscriptionId: subscriptionId,
        quantity: quantity,
        currentPeriodStartAt:
          updatedProviderSubscriptionItem.currentPeriodStartAt,
        currentPeriodEndAt: updatedProviderSubscriptionItem.currentPeriodEndAt,
      });

    if (!hydratedSubscriptionItemConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: Failed to hydrate subscription item connection after update`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to hydrate subscription item connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const hydratedSubscriptionItemConnectionData =
      hydratedSubscriptionItemConnectionResult.data;
    const hydratedSubscriptionItemConnection =
      hydratedSubscriptionItemConnectionData!.connection;

    return BusinessResult.ok({
      connection: hydratedSubscriptionItemConnection,
      provider: updatedProviderSubscriptionItem,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _updateSubscriptionItemPrice :: An unknown error occurred`,
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
 * Previews a subscription item price change.
 *
 * @returns The provider invoice for the previewed price change.
 */
export const _previewProviderSubscriptionItemPriceChange = async (
  executionContext: ExecutionContext,
  input: PreviewProviderSubscriptionItemPriceChangeInputDto
): Promise<
  BusinessResult<
    PreviewProviderSubscriptionItemPriceChangeOutputDto,
    PreviewProviderSubscriptionItemPriceChangeErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      PreviewProviderSubscriptionItemPriceChangeInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerSubscriptionId = parsedInputData.providerSubscriptionId;
    const providerSubscriptionItemId =
      parsedInputData.providerSubscriptionItemId;
    const providerPriceId = parsedInputData.providerPriceId;
    const quantity = parsedInputData.quantity;
    const prorate = parsedInputData.prorate;
    const chargeImmediately = parsedInputData.chargeImmediately;
    const resetBillingCycle = parsedInputData.resetBillingCycle;

    // Step 2: Preview the subscription item price change on the provider
    const providerInvoice =
      await billingProviderService.previewProviderSubscriptionItemPriceChange(
        provider,
        providerSubscriptionId,
        providerSubscriptionItemId,
        providerPriceId,
        quantity,
        prorate,
        chargeImmediately,
        resetBillingCycle
      );

    return BusinessResult.ok({
      provider: providerInvoice,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _previewProviderSubscriptionItemPriceChange :: An unknown error occurred`,
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
 * Cursor paginates provider customer invoices.
 *
 * @returns The paginated provider customer invoices.
 */
export const _cursorPaginateProviderCustomerInvoices = async (
  executionContext: ExecutionContext,
  input: CursorPaginateProviderCustomerInvoicesInputDto
): Promise<
  BusinessResult<
    CursorPaginateProviderCustomerInvoicesOutputDto,
    CursorPaginateProviderCustomerInvoicesErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput =
      CursorPaginateProviderCustomerInvoicesInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const provider = parsedInputData.provider;
    const providerCustomerId = parsedInputData.providerCustomerId;
    const pagination = parsedInputData.pagination;

    // Step 2: Paginate the invoices on the provider
    const result =
      await billingProviderService.cursorPaginateProviderCustomerInvoices(
        provider,
        providerCustomerId,
        pagination
      );

    return BusinessResult.ok({
      nodes: result.nodes,
      totalCount: result.totalCount,
      startCursor: result.startCursor,
      endCursor: result.endCursor,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _cursorPaginateProviderCustomerInvoices :: An unknown error occurred`,
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
 * Changes the subscription plan for a subscription item.
 *
 * @returns The updated subscription item connection and the new subscription plan.
 */
export const _changeSubscriptionPlan = async (
  executionContext: ExecutionContext,
  input: ChangeSubscriptionPlanInputDto
): Promise<
  BusinessResult<
    ChangeSubscriptionPlanOutputDto,
    ChangeSubscriptionPlanErrorDto
  >
> => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    // Step 1: Validate input
    const parsedInput = ChangeSubscriptionPlanInputDtoSchema.safeParse(input);

    if (!parsedInput.success) {
      return BusinessResult.fail(
        ...BusinessErrorResult.fromZodError(parsedInput.error, {
          input: input,
          context: executionContext,
        })
      );
    }

    const parsedInputData = parsedInput.data;
    const subscriptionItemId = parsedInputData.subscriptionItemId;
    const fromPlanId = parsedInputData.fromPlanId;
    const toPlanId = parsedInputData.toPlanId;
    const quantity = parsedInputData.quantity;

    // Step 2: Find all the available plans for the input plan ID
    const availablePlanResult =
      await _findAllAvailableSubscriptionPlansByPlanId(executionContext, {
        planId: fromPlanId,
        quantity: quantity,
      });

    if (!availablePlanResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Failed to find available subscription plans`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find available subscription plans',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const availablePlansData = availablePlanResult.data;
    const fromPlan = availablePlansData.plan;
    const fromPlanPriceId = fromPlan.priceId;
    const availablePlans = availablePlansData.availablePlans;
    const pricePaths = availablePlansData.pricePaths;

    // Step 3: Validate that the target plan exists in the available plans
    const targetPlan = availablePlans.find((plan) => plan.id === toPlanId);

    if (!targetPlan) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Plan is not available for change`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Plan is not available for change',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const targetPlanPriceId = targetPlan.priceId;

    // Step 4: Ensure the target plan is self service
    if (!targetPlan.isSelfService()) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Target plan is not self service`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Target plan is not self service',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 5: Ensure the current plan is self service
    if (!fromPlan.isSelfService()) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Current plan is not self service`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'Current plan is not self service',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 6: Find the subscription item connection by ID
    const subscriptionItemConnectionResult =
      await _findSubscriptionItemConnectionById(executionContext, {
        subscriptionItemId: subscriptionItemId,
      });

    if (!subscriptionItemConnectionResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Failed to find subscription item connection by ID`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Failed to find subscription item connection',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionItemConnectionData =
      subscriptionItemConnectionResult.data;

    if (!subscriptionItemConnectionData) {
      logger.warn(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Subscription item connection not found`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.NOT_FOUND_ERROR,
        detail: 'Subscription item connection not found',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const subscriptionItemConnection =
      subscriptionItemConnectionData.connection;

    // Step 7: Ensure the subscription item connection's current price matches the price from the source plan
    const subscriptionItemPriceId = subscriptionItemConnection.priceId;

    if (subscriptionItemPriceId !== fromPlanPriceId) {
      logger.warn(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Subscription item connection's current price does not match source plan price`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail:
          "Subscription item connection's current price does not match source plan price",
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 8: Calculate the proration behavior for the plan change
    // Change are only prorated if the price being upgraded
    // This ensures that we do NOT credit customers for pricing downgrades
    const prorate = pricePaths.isUpgrade(toPlanId);

    // Step 9: Update the subscription item price to the target plan's price
    const updateResult = await _updateSubscriptionItemPrice(executionContext, {
      subscriptionItemId: subscriptionItemId,
      priceId: targetPlanPriceId,
      quantity: quantity,
      prorate: prorate,
      chargeImmediately: true,
      resetBillingCycle: false,
    });

    if (!updateResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: _changeSubscriptionPlan :: Failed to update subscription item price`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to update subscription item price',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const updateData = updateResult.data;
    const updatedSubscriptionItemConnection = updateData.connection;

    return BusinessResult.ok({
      plan: targetPlan,
      subscriptionItemConnection: updatedSubscriptionItemConnection,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: _changeSubscriptionPlan :: An unknown error occurred`,
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
