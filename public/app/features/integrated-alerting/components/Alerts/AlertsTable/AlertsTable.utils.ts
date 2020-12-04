import moment from 'moment/moment';
import { Alert, AlertsListResponseLabel, AlertsListResponseAlert, AlertStatus } from '../Alerts.types';
import { AlertRuleSeverity } from '../../AlertRules/AlertRules.types';

export const formatLabel = (label: [string, string]): string => {
  const [key, value] = label;

  return `${key}=${value}`;
};

export const formatLabels = (labels: AlertsListResponseLabel): string[] => {
  return Object.entries(labels).map(formatLabel);
};

export const formatAlert = (rule: AlertsListResponseAlert): Alert => {
  const { active_since, labels, last_notified, severity, status, summary } = rule;

  return {
    activeSince: active_since ? moment(active_since).format('YYYY-MM-DD HH:mm:ss.SSS') : '',
    labels: formatLabels(labels),
    severity: AlertRuleSeverity[severity],
    status: AlertStatus[status],
    summary,
    lastNotified: last_notified ? moment(last_notified).format('YYYY-MM-DD HH:mm:ss.SSS') : '',
  };
};

export const formatAlerts = (rules: AlertsListResponseAlert[]): Alert[] => rules.map(formatAlert);
