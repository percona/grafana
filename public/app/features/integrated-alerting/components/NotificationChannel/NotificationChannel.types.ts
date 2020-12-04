export interface NotificationChannelContext {
  getNotificationChannels: () => void;
}

export enum NotificationChannelType {
  email = 'email',
  pagerDuty = 'pagerDuty',
  slack = 'slack',
}

export interface NotificationChannel {
  type: NotificationChannelType;
  channelId: string;
  summary: string;
  disabled: boolean;
}

export interface EmailNotificationChannel extends NotificationChannel {
  sendResolved: boolean;
  emails: string[];
}

export interface PagerDutylNotificationChannel extends NotificationChannel {
  sendResolved: boolean;
  routingKey: string;
  serviceKey: string;
}

export interface SlackNotificationChannel extends NotificationChannel {
  sendResolved: boolean;
  channel: string;
}

export interface NotificationChannelListResponse {
  channels: NotificationChannelResponse[];
}

export interface NotificationChannelResponse {
  channel_id: string;
  disabled: boolean;
  summary: string;
  email_config?: EmailNotificationChannelResponse;
  pagerduty_config?: PagerDutyNotificationChannelResponse;
  slack_config?: SlackNotificationChannelResponse;
}

export interface EmailNotificationChannelResponse {
  send_resolved: boolean;
  to: string[];
}

export interface PagerDutyNotificationChannelResponse {
  send_resolved: boolean;
  routing_key: string;
  service_key: string;
}

export interface SlackNotificationChannelResponse {
  send_resolved: boolean;
  channel: string;
}
