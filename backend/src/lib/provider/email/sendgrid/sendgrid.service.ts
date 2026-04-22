import { env } from '@env';
import { injectExceptionDetails, logger } from '@common';
import { MailService, MailDataRequired } from '@sendgrid/mail';

const LOG_PREFIX = 'Lib :: Provider :: Email :: SendGrid';

// -----------------------------------------------------------------
// Mail Send Client
// -----------------------------------------------------------------

const mailClient = new MailService();
mailClient.setApiKey(env.SENDGRID_EMAIL_SEND_API_KEY);

// -----------------------------------------------------------------
// Email Send Functions
// -----------------------------------------------------------------

export const sendEmail = async (input: MailDataRequired): Promise<void> => {
  try {
    await mailClient.send(input);
  } catch (error: unknown) {
    logger.error(
      `${LOG_PREFIX} :: sendEmail :: An unknown error occurred`,
      injectExceptionDetails(error, {
        input: input,
      })
    );
    throw new Error('Failed to send email');
  }
};
