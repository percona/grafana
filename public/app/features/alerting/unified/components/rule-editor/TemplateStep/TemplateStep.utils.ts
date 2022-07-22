import { SelectableValue } from '@grafana/data';
import { Template } from 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate.types';
import { Severity } from 'app/percona/shared/core';
import {
  AlertRuleCreatePayload,
  AlertRuleFilterType,
  AlertRulesListPayloadFilter,
  AlertRulesListResponseChannel,
} from 'app/percona/shared/services/AlertRules/AlertRules.types';

import { RuleFormValues } from '../../../types/rule-form';

import { FiltersForm } from './TemplateStep.types';

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
