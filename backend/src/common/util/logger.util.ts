export type LogMetadata = Record<string, unknown>;

// -----------------------------------------------------------------
// Logger
// -----------------------------------------------------------------

class Logger {
  constructor() {}

  public log(message: string, metadata?: LogMetadata): void {
    console.log(message, ...(metadata ? [metadata] : []));
  }

  public info(message: string, metadata?: LogMetadata): void {
    console.info(message, ...(metadata ? [metadata] : []));
  }

  public warn(message: string, metadata?: LogMetadata): void {
    console.warn(message, ...(metadata ? [metadata] : []));
  }

  public error(message: string, metadata?: LogMetadata): void {
    console.error(message, ...(metadata ? [metadata] : []));
  }

  public debug(message: string, metadata?: LogMetadata): void {
    console.debug(message, ...(metadata ? [metadata] : []));
  }
}

/**
 * Utility for logging messages with various levels of severity.
 * Allows for centralized logging to forward to different logging services or formats.
 */
export const logger = new Logger();

/**
 * Utility function to inject exeption details into log metadata.
 */
export const injectExceptionDetails = (
  error: unknown,
  details?: LogMetadata
): LogMetadata => {
  if (error instanceof Error) {
    return {
      error: {
        stack: error?.stack ?? null,
        message: error?.message ?? null,
      },
      ...details,
    };
  }

  return {
    ...details,
  };
};
