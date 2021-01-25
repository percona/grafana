import { NotificationChannelRenderProps } from '../../NotificationChannel.types';

export interface PagerDutyFieldsProps {
  values: NotificationChannelRenderProps;
  mutators: Record<string, (...args: any[]) => any>;
}
