import { PrioritizedLabels, Severity, AlertRulesListResponseRule } from 'app/percona/shared/core';
import { AlertmanagerAlert, AlertState } from 'app/plugins/datasource/alertmanager/types';

export enum AlertStatus {
  STATUS_INVALID = 'Invalid',
  CLEAR = 'Clear',
  PENDING = 'Pending',
  TRIGGERING = 'Firing',
  SILENCED = 'Silenced',
}

export interface Alert {
  alertId: string;
  activeSince: string;
  labels: PrioritizedLabels;
  lastNotified: string;
  severity?: string;
  state: AlertState;
  summary?: string;
  ruleUid: string;
  ruleName: string;
  originalData: AlertmanagerAlert;
}

interface AlertsTotals {
  total_items: number;
  total_pages: number;
}

export interface AlertsListResponseAlert {
  created_at?: string;
  alert_id: string;
  labels: { [K: string]: string };
  updated_at?: string;
  rule?: AlertRulesListResponseRule;
  severity: keyof typeof Severity;
  status: keyof typeof AlertStatus;
  summary: string;
}

export interface AlertsListResponse {
  totals: AlertsTotals;
  alerts: AlertsListResponseAlert[];
}
