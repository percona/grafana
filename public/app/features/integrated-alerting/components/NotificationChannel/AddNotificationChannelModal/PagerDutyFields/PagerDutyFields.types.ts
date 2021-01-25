import { NotificationChannelRenderProps, MutatorKeys } from '../../NotificationChannel.types';

export interface PagerDutyFieldsProps {
  values: NotificationChannelRenderProps;
  mutators: Record<MutatorKeys, (...args: any[]) => any>;
}
