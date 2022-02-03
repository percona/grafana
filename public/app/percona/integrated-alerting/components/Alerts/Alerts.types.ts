import { AlertRulesListResponseRule, AlertRuleSeverity, AlertRule } from '../AlertRules/AlertRules.types';

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

export interface AlertLabels {
  primary: string[];
  secondary: string[];
}

export interface Alert {
  alertId: string;
  activeSince: string;
  labels: AlertLabels;
  lastNotified: string;
  severity: AlertRuleSeverity;
  status: AlertStatus[keyof AlertStatus];
  summary: string;
  rule?: AlertRule;
}

interface AlertsTotals {
  total_items: number;
  total_pages: number;
}

export interface AlertsListResponseAlert {
  created_at?: string;
  alert_id: string;
  labels: AlertsListResponseLabel;
  updated_at?: string;
  rule?: AlertRulesListResponseRule;
  severity: keyof typeof AlertRuleSeverity;
  status: keyof typeof AlertStatus;
  summary: string;
}

export interface AlertsListResponse {
  totals: AlertsTotals;
  alerts: AlertsListResponseAlert[];
}

export interface AlertTogglePayload {
  alert_ids: string[];
  silenced: 'DO_NOT_CHANGE' | 'TRUE' | 'FALSE';
}
