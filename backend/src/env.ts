import { z } from 'zod';
import path from 'node:path';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(
  config({
    path: path.resolve(process.cwd(), '.env'),
  })
);

// -----------------------------------------------------------------
// Setup
// -----------------------------------------------------------------

const EnvironmentSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(8080),
  SENDGRID_EMAIL_SEND_API_KEY: z.string(),
  APP_BASE_URL: z.string().url().default('http://localhost:5173'),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  SLACK_BOT_TOKEN: z.string(),
  FIREBASE_AUTH_SERVICE_ACCOUNT: z
    .string()
    .transform((value) => JSON.parse(value)),
  PUBSUB_SERVICE_ACCOUNT: z.string().transform((value) => JSON.parse(value)),
  GCS_SERVICE_ACCOUNT: z.string().transform((value) => JSON.parse(value)),
  GOOGLE_VISION_SERVICE_ACCOUNT: z
    .string()
    .transform((value) => JSON.parse(value)),
  GOOGLE_DOCUMENT_AI_SERVICE_ACCOUNT: z
    .string()
    .transform((value) => JSON.parse(value)),
  OPENAI_API_KEY: z.string(),
});

/**
 * Setup the environment variables.
 *
 * @returns The parsed environment variables.
 */
const setupEnvironment = () => {
  // eslint-disable-next-line no-restricted-properties
  const parsedEnvironment = EnvironmentSchema.safeParse(process.env);

  if (parsedEnvironment.error) {
    console.error('Invalid env:');
    console.error(
      JSON.stringify(parsedEnvironment.error.flatten().fieldErrors, null, 2)
    );
    process.exit(1);
  }

  return parsedEnvironment.data;
};

export type env = z.infer<typeof EnvironmentSchema>;
export const env = setupEnvironment();

// -----------------------------------------------------------------
// Utils
// -----------------------------------------------------------------

/**
 * Checks if the current environment is production.
 *
 * @returns True if the environment is production, false otherwise.
 */
export const isProductionEnvironment = () => {
  return env.NODE_ENV === 'production';
};

/**
 * Checks if the current environment is development.
 *
 * @returns True if the environment is development, false otherwise.
 */
export const isDevelopmentEnvironment = () => {
  return env.NODE_ENV === 'development';
};
