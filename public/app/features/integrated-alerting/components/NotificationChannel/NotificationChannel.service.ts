import { getBackendSrv } from '@grafana/runtime';
import {
  NotificationChannel,
  NotificationChannelListResponse,
  NotificationChannelType,
  NotificationChannelResponse,
  EmailNotificationChannel,
  PagerDutylNotificationChannel,
  SlackNotificationChannel,
} from './NotificationChannel.types';

const BASE_URL = `${window.location.origin}/v1/management/ia/Channels`;
const TO_MODEL = {
  [NotificationChannelType.email]: (channel: NotificationChannelResponse): EmailNotificationChannel => ({
    type: NotificationChannelType.email,
    channelId: channel.channel_id,
    summary: channel.summary,
    disabled: channel.disabled,
    sendResolved: channel.email_config.send_resolved,
    emails: channel.email_config.to,
  }),
  [NotificationChannelType.pagerDuty]: (channel: NotificationChannelResponse): PagerDutylNotificationChannel => ({
    type: NotificationChannelType.pagerDuty,
    channelId: channel.channel_id,
    summary: channel.summary,
    disabled: channel.disabled,
    sendResolved: channel.pagerduty_config.send_resolved,
    routingKey: channel.pagerduty_config.routing_key,
    serviceKey: channel.pagerduty_config.service_key,
  }),
  [NotificationChannelType.slack]: (channel: NotificationChannelResponse): SlackNotificationChannel => ({
    type: NotificationChannelType.slack,
    channelId: channel.channel_id,
    summary: channel.summary,
    disabled: channel.disabled,
    sendResolved: channel.slack_config.send_resolved,
    channel: channel.slack_config.channel,
  }),
};

const getType = (channel: NotificationChannelResponse): NotificationChannelType => {
  if ('pagerduty_config' in channel) {
    return NotificationChannelType.pagerDuty;
  }

  if ('slack_config' in channel) {
    return NotificationChannelType.slack;
  }

  return NotificationChannelType.email;
};

export const NotificationChannelService = {
  async list(): Promise<NotificationChannel[]> {
    return getBackendSrv()
      .post(`${BASE_URL}/List`)
      .then(({ channels }: NotificationChannelListResponse) =>
        channels.map(channel => TO_MODEL[getType(channel)](channel))
      );
  },
};
