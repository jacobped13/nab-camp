import { env } from '@env';
import { SendBusinessContactRequestBody } from '@api-contracts/workspace';
import { WebClient, Block, KnownBlock } from '@slack/web-api';

const SLACK_CHANNELS = {
  BUSINESS_CONTACT_FORM: 'C099W5F1YDQ',
};

class SlackService {
  private client: WebClient;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async sendMessage(
    channel: string,
    text: string,
    blocks?: (Block | KnownBlock)[]
  ): Promise<void> {
    try {
      await this.client.chat.postMessage({
        channel,
        text,
        blocks,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

const slackService = new SlackService(env.SLACK_BOT_TOKEN!);

/**
 * Send a business contact notification to Slack.
 *
 * @param payload - The business contact data
 */
export const sendBusinessContactToSlack = async (
  payload: SendBusinessContactRequestBody
): Promise<void> => {
  const slackMessage = {
    text: 'New Business Contact Inquiry',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'New Business Contact Inquiry',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*\n${payload.firstName} ${payload.lastName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${payload.email}`,
          },
          {
            type: 'mrkdwn',
            text: `*Company:*\n${payload.companyName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Company Size:*\n${payload.companySize}`,
          },
        ],
      },
    ],
  };

  await slackService.sendMessage(
    SLACK_CHANNELS.BUSINESS_CONTACT_FORM,
    slackMessage.text,
    slackMessage.blocks
  );
};
