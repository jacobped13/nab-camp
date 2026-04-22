import {
  BusinessResult,
  injectExceptionDetails,
  logger,
  RESULT_ERROR_CODE,
} from '@common';
import {
  BillingProviderEvent,
  BillingProviderEventProcessor,
} from './helper/billing-provider-event.processor.dto';
import * as billingBusinessService from '../business/billing.business.service';
import * as stripeEventProcessor from './stripe-event.processor';
import { BILLING_PROVIDER } from '../common/billing.constant';

const LOG_PREFIX = 'Billing :: Processor :: BillingProviderEventProcessor';

/**
 * Process events for all supported billing providers.
 * This function guarantees that events are processed only once
 * and will exit early if the event has already been processed.
 *
 * @returns The result of the event processing.
 */
export const processEvent: BillingProviderEventProcessor<
  BillingProviderEvent
> = async (executionContext, input) => {
  const loggingContext = executionContext.toLoggingContext();

  try {
    const provider = input.provider;
    const providerId = input.providerId;
    const publishedAt = input.publishedAt;

    // Step 1: Find the Processor for the billing provider
    let processor:
      | BillingProviderEventProcessor<BillingProviderEvent>
      | undefined;

    switch (input.provider) {
      case BILLING_PROVIDER.STRIPE:
        processor = stripeEventProcessor.processEvent;
        break;
    }

    // Step 2: Check if a processor exists for the provider
    if (!processor) {
      logger.warn(
        `${LOG_PREFIX} :: processEvent :: No processor found for provider`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNPROCESSABLE_ENTITY_ERROR,
        detail: 'No processor found for the billing provider',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 3: Find or create the provider event
    const providerEventResult =
      await billingBusinessService._findOrCreateProviderEventLog(
        executionContext,
        {
          provider: provider,
          providerId: providerId,
          publishedAt: publishedAt,
        }
      );

    if (!providerEventResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processEvent :: Failed to find or create provider event log`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to find or create provider event log',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    const eventLogData = providerEventResult.data;
    const eventLogCreated = eventLogData.created;
    const eventLogEntity = eventLogData.event;

    // Step 4: Check if the event has already been processed
    if (eventLogEntity.isProcessed()) {
      logger.info(`${LOG_PREFIX} :: processEvent :: Event already processed`, {
        input: input,
        context: loggingContext,
      });
      return BusinessResult.ok({
        processed: false,
      });
    }

    // Step 5: Check if the event is being processed
    // If the event was created in this transaction, it means this instance is the first to process it
    if (!eventLogCreated) {
      logger.info(
        `${LOG_PREFIX} :: processEvent :: Event is already being processed`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.ok({
        processed: false,
      });
    }

    // Step 6: Process the event using the provider processor
    const processorResult = await processor(executionContext, input);

    // If the event fails to process, drop the event log and return an error
    if (!processorResult.isSuccess()) {
      logger.error(`${LOG_PREFIX} :: processEvent :: Failed to process event`, {
        input: input,
        context: loggingContext,
      });

      // Attempt to delete the event log after processing failure to allow for reprocessing
      // Ideally, all of this would be handled in a single transaction,
      // but transactions are a nightmare to manage with in-between business logic
      try {
        await billingBusinessService._deleteProviderEventLog(executionContext, {
          provider: provider,
          providerId: providerId,
        });
      } catch (error: unknown) {
        logger.error(
          `${LOG_PREFIX} :: processEvent :: Failed to delete event log after processing failure`,
          injectExceptionDetails(error, {
            input: input,
            context: loggingContext,
          })
        );
      }

      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to process event',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    // Step 7: Mark the event as processed
    const processedResult =
      await billingBusinessService._processProviderEventLog(executionContext, {
        provider: provider,
        providerId: providerId,
      });

    if (!processedResult.isSuccess()) {
      logger.error(
        `${LOG_PREFIX} :: processEvent :: Failed to mark event as processed`,
        {
          input: input,
          context: loggingContext,
        }
      );
      return BusinessResult.fail({
        code: RESULT_ERROR_CODE.UNKNOWN_ERROR,
        detail: 'Failed to mark event as processed',
        metadata: {
          input: input,
          context: executionContext,
        },
      });
    }

    return BusinessResult.ok({
      processed: true,
    });
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: processEvent :: An unknown error occurred`,
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
