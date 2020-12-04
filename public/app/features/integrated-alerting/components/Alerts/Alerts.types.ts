import { AlertRulesListResponseRule, AlertRuleSeverity } from '../AlertRules/AlertRules.types';

export enum AlertStatus {
  STATUS_INVALID = 'Invalid',
  CLEAR = 'Clear',
  PENDING = 'Pending',
  TRIGGERING = 'Firing',
  SILENCED = 'Silenced',
}

export interface AlertsListResponseLabel {
  [K: string]: string;
}

export interface Alert {
  activeSince: string;
  labels: string[];
  lastNotified: string;
  severity: AlertRuleSeverity[keyof AlertRuleSeverity];
  status: AlertStatus[keyof AlertStatus];
  summary: string;
}

export interface AlertsListResponseAlert {
  alert_id: string;
  disabled: boolean;
  labels: AlertsListResponseLabel[];
  last_notified?: string;
  rule: AlertRulesListResponseRule;
  severity: keyof typeof AlertRuleSeverity;
  status: keyof typeof AlertStatus;
  summary: string;
}

export interface AlertsListResponse {
  rules: AlertsListResponseAlert[];
}
