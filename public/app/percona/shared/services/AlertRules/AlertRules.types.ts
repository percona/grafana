import {
  TemplateAnnotation,
  TemplateParam,
} from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';

import { Severity } from '../../core';

export enum AlertRuleParamType {
  BOOL = 'bool',
  FLOAT = 'float',
  STRING = 'string',
}

export enum AlertRuleFilterType {
  EQUAL = '=',
  REGEX = '=~',
}

export type AlertRulesParsedParam = TemplateParam & { value: string | boolean | number };

export interface AlertRulesListResponseRule {
  channels: AlertRulesListResponseChannel[];
  created_at: string;
  disabled: boolean;
  filters: AlertRulesListPayloadFilter[];
  default_for: string;
  for: string; // duration, e.g.: '999s'
  last_notified?: string;
  params_values?: AlertRulesListResponseParam[];
  params_definitions: TemplateParam[];
  severity: keyof typeof Severity;
  default_severity: keyof typeof Severity;
  name: string;
  expr: string;
  expr_template: string;
  rule_id: string;
  annotations?: TemplateAnnotation;
  template_name: string;
  summary: string;
  custom_labels?: { [K: string]: string };
}

export interface AlertRule {
  ruleId: string;
  createdAt: string;
  disabled: boolean;
  duration: string;
  filters: string[];
  lastNotified: string;
  severity: Severity[keyof Severity];
  name: string;
  rawValues: AlertRulesListResponseRule;
  params: AlertRulesParsedParam[];
  expr: string;
}

export interface AlertRulesListResponseChannel {
  channel_id: string;
  summary: string;
}

export interface AlertRulesListPayloadFilter {
  key: string;
  type: keyof typeof AlertRuleFilterType;
  value: string;
}

export interface AlertRulesListResponseParam {
  name: string;
  type: keyof typeof AlertRuleParamType;
  [AlertRuleParamType.BOOL]?: boolean;
  [AlertRuleParamType.FLOAT]?: number;
  [AlertRuleParamType.STRING]?: string;
}

export interface AlertRuleCreatePayload {
  channel_ids: string[];
  custom_labels?: { [K: string]: string };
  disabled: boolean;
  filters: AlertRulesListPayloadFilter[];
  for: string;
  params?: AlertRulesListResponseParam[];
  severity: keyof typeof Severity;
  name: string;
  template_name: string;
}
