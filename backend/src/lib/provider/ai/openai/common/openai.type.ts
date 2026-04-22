import { OpenAI } from 'openai';

// -----------------------------------------------------------------
// Provider Types
// -----------------------------------------------------------------

export type ChatModel = OpenAI.ChatModel;

export type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
