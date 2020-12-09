export interface AddAlertRuleModalProps {
  isVisible: boolean;
  setVisible: (value: boolean) => void;
}

export enum NotificationChannel {
  email = 'email',
  pagerDuty = 'Pager Duty',
  slack = 'Slack',
}
