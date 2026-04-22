import {
  sendgridEmailService,
  EMAIL_SENDER,
  EMAIL_TEMPLATE,
} from '@lib/provider/email/sendgrid';
import { generateAuthenticationCodeURL } from './helper/email.provider.util';

export const sendLoginVerificationEmail = async (
  email: string,
  code: string
): Promise<void> => {
  await sendgridEmailService.sendEmail({
    from: EMAIL_SENDER.SUPPORT.address,
    to: {
      email: email,
    },
    templateId: EMAIL_TEMPLATE.VERIFY_LOGIN_CODE,
    personalizations: [
      {
        to: email,
        dynamicTemplateData: {
          custom_email_code: code,
          custom_auth_url: generateAuthenticationCodeURL(code, email),
          custom_support_email: EMAIL_SENDER.SUPPORT.address,
          custom_organization: EMAIL_SENDER.SUPPORT.name,
        },
      },
    ],
  });
};
