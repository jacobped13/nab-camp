import { env } from '@env';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { CreateCompletionWithSchemaInputDto } from './helper/openai.dto';
import { injectExceptionDetails, logger } from '@common';

const LOG_PREFIX = 'Lib :: Provider :: AI :: OpenAI';

const initializeClient = () => {
  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
  return client;
};

const client = initializeClient();

/**
 * Create a chat completion.
 *
 * @returns The content of the first choice from the chat completion response.
 */
export const createCompletionWithSchema = async <T>(
  input: CreateCompletionWithSchemaInputDto
): Promise<T> => {
  try {
    const { messages, model, maxTokens, temperature, schema, schemaName } =
      input;

    const completion = await client.chat.completions.parse({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      response_format: zodResponseFormat(schema, schemaName),
    });

    const message = completion.choices[0].message;

    // If the model refuses to respond, you will get a refusal message
    if (message.refusal) {
      logger.error(
        `${LOG_PREFIX} :: createCompletionWithSchema :: Model refused to respond`,
        {
          input: input,
          refusal: message.refusal,
        }
      );
      throw new Error('Model refused to respond');
    }

    return JSON.parse(message.content ?? '') as T;
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: createCompletionWithSchema :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to create completion');
  }
};
