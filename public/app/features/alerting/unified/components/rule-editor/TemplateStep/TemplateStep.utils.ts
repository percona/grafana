import { SelectableValue } from '@grafana/data';
import {
  Template,
  TemplateParam,
} from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';
import {
  AlertRule,
  AlertRuleCreatePayload,
  AlertRuleFilterType,
  AlertRuleParamType,
  AlertRulesListPayloadFilter,
  AlertRulesListResponseChannel,
  AlertRuleUpdatePayload,
} from 'app/percona/integrated-alerting/components/AlertRules/AlertRules.types';
import { Severity } from 'app/percona/shared/core';

import { RuleFormValues } from '../../../types/rule-form';

import { AddAlertRuleFormValues, FiltersForm } from './TemplateStep.types';

export const formatChannelsOptions = (channels: string[]): Array<SelectableValue<string>> =>
  channels
    ? channels.map((channel) => ({
        value: channel,
        label: channel,
      }))
    : [];

export const formatTemplateOptions = (templates: Template[]): Array<SelectableValue<Template>> =>
  templates
    ? templates.map((template) => ({
        value: template,
        label: template.summary,
      }))
    : [];

export const formatFilters = (filters: FiltersForm[]): AlertRulesListPayloadFilter[] =>
  // We have always problems reading keys, as they come out as string
  // @ts-ignore
  filters.map(({ key, operators, value }) => {
    const indexOfValue = Object.values(AlertRuleFilterType).indexOf(operators);
    const type = Object.keys(AlertRuleFilterType)[indexOfValue];
    return { key, type, value };
  });

export const formatCreateAPIPayload = (data: RuleFormValues): AlertRuleCreatePayload => {
  const { duration, filters, name, notificationChannels, severity, template } = data;

  const payload: AlertRuleCreatePayload = {
    custom_labels: {},
    disabled: false,
    channel_ids: notificationChannels ? notificationChannels.map((channel) => channel || '') : [],
    filters: filters ? formatFilters(filters) : [],
    for: `${duration}s`,
    severity: severity!,
    template_name: template?.name!,
    name,
    params: [],
  };

  template?.params?.forEach((param) => {
    if (data.hasOwnProperty(param.name)) {
      const { name, type } = param;
      // @ts-ignore
      const value = data[param.name];
      payload.params?.push({
        name,
        type,
        [type.toLowerCase()]: value,
      });
    }
  });

  return payload;
};

export const formatUpdateAPIPayload = (
  ruleId: string,
  data: AddAlertRuleFormValues,
  params: TemplateParam[] = []
): AlertRuleUpdatePayload => {
  const payload = formatCreateAPIPayload(data, params);

  return {
    ...payload,
    rule_id: ruleId,
  };
};

export const formatEditFilters = (filters: AlertRulesListPayloadFilter[] | undefined | null): FiltersForm[] | [] => {
  return filters
    ? filters.map((filterData) => {
        const { key, type, value } = filterData;
        return {
          label: key,
          value: value,
          operators: {
            label: `${AlertRuleFilterType[type]} (${type})`,
            value: AlertRuleFilterType[type],
          },
        };
      })
    : [];
};

export const formatEditTemplate = (templateName: string, templateSummary: string): SelectableValue<string> => ({
  value: templateName,
  label: templateSummary,
});

export const formatEditSeverity = (severity: keyof typeof Severity): SelectableValue<keyof typeof Severity> => ({
  value: severity,
  label: Severity[severity],
});

export const formatEditNotificationChannel = (channel: AlertRulesListResponseChannel) => ({
  value: channel.channel_id,
  label: channel.summary,
});

export const formatEditNotificationChannels = (
  channels: AlertRulesListResponseChannel[]
): Array<SelectableValue<string>> => (channels ? channels.map(formatEditNotificationChannel) : []);

export const getInitialValues = (alertRule?: AlertRule | null): AddAlertRuleFormValues | undefined => {
  if (!alertRule) {
    return undefined;
  }

  const {
    channels,
    disabled,
    filters,
    for: duration,
    severity,
    name,
    params_values,
    template_name,
    summary,
  } = alertRule.rawValues;
  const result: AddAlertRuleFormValues = {
    enabled: !disabled,
    duration: parseInt(duration, 10),
    filters: formatEditFilters(filters),
    name,
    notificationChannels: formatEditNotificationChannels(channels),
    severity: formatEditSeverity(severity),
    template: formatEditTemplate(template_name, summary),
  };

  params_values?.forEach((param) => {
    const { float, type } = param;
    const typeMap: Record<keyof typeof AlertRuleParamType, number | undefined> = {
      FLOAT: float,
      BOOL: undefined,
      STRING: undefined,
    };
    result[param.name] = typeMap[type];
  });
  return result;
};
