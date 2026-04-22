import { ZodSchema } from 'zod';
import { ChatModel, ChatMessage } from '../../common/openai.type';

// -----------------------------------------------------------------
// Create Completion
// -----------------------------------------------------------------

export type CreateCompletionWithSchemaInputDto = {
  model: ChatModel;
  messages: ChatMessage[];
  schema: ZodSchema;
  schemaName: string;
  maxTokens?: number;
  temperature?: number;
};
