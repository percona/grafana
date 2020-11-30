import moment from 'moment/moment';
import {
  AlertRule,
  AlertRuleFilterType,
  AlertRuleSeverity,
  AlertRulesListResponseFilter,
  AlertRulesListResponseRule,
  AlertRulesListResponseParam,
} from '../AlertRules.types';

export const formatFilter = (filter: AlertRulesListResponseFilter): string => {
  const { key, type, value } = filter;

  return `${key}${AlertRuleFilterType[type]}${value}`;
};

export const formatThreshold = (params: AlertRulesListResponseParam[]): string => {
  const thresholdParam = params.find(param => param.name === 'threshold');

  const { value, unit } = thresholdParam;

  return `${value}${unit ? ` ${unit}` : ''}`;
};

export const formatRule = (rule: AlertRulesListResponseRule): AlertRule => {
  const { created_at, disabled, filters, for: duration, params, severity, summary } = rule;

  return {
    createdAt: moment(created_at).format('YYYY-MM-DD HH:mm:ss'),
    disabled,
    duration,
    filters: filters.map(formatFilter),
    severity: AlertRuleSeverity[severity],
    summary,
    threshold: formatThreshold(params),
  };
};

export const formatRules = (rules: AlertRulesListResponseRule[]): AlertRule[] => rules.map(formatRule);
