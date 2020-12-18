import { AddAlertRuleFormValues } from './AddAlertRuleModal.types';
import { AlertRuleCreatePayload, AlertRulesListPayloadFilter, AlertRulesListResponseParam } from '../AlertRules.types';
import { NotificationChannel } from '../../NotificationChannel/NotificationChannel.types';
import { Template } from '../../AlertRuleTemplate/AlertRuleTemplatesTable/AlertRuleTemplatesTable.types';
import { SelectableValue } from '@grafana/data';

export const formatChannelsOptions = (channels: NotificationChannel[]): Array<SelectableValue<string>> =>
  channels
    ? channels.map(channel => ({
        value: channel.channelId,
        label: channel.summary,
      }))
    : [];

export const formatTemplateOptions = (templates: Template[]): Array<SelectableValue<string>> =>
  templates
    ? templates.map(template => ({
        value: template.name,
        label: template.summary,
      }))
    : [];

// TODO: handle new types as they gets added to AlertRuleFilterType
export const formatFilter = (filter: string): AlertRulesListPayloadFilter => {
  if (!filter) {
    return {
      key: '',
      value: '',
      type: 'EQUAL',
    };
  }

  const [key, value] = filter.split('=');

  return {
    key,
    value,
    type: 'EQUAL',
  };
};

export const formatFilters = (filters: string): AlertRulesListPayloadFilter[] => {
  const trimmedFilters = filters.trim();

  if (trimmedFilters === '') {
    return [];
  }

  const filterList = trimmedFilters.split(/,\s*/);

  return filterList.map(formatFilter);
};

export const formatBooleanThreshold = (value: string): AlertRulesListResponseParam => {
  return {
    name: 'threshold',
    type: 'BOOL',
    bool: value.toLowerCase() === 'true',
  };
};

export const formatFloatThreshold = (value: string): AlertRulesListResponseParam => {
  return {
    name: 'threshold',
    type: 'FLOAT',
    float: parseFloat(value),
  };
};

export const formatStringThreshold = (value: string): AlertRulesListResponseParam => {
  return {
    name: 'threshold',
    type: 'STRING',
    string: value,
  };
};

export const formatThreshold = (value: string): AlertRulesListResponseParam => {
  const trimmedValue = value.trim();

  if (/^true|false$/i.test(trimmedValue)) {
    return formatBooleanThreshold(trimmedValue);
  } else if (/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(trimmedValue)) {
    return formatFloatThreshold(trimmedValue);
  } else {
    return formatStringThreshold(trimmedValue);
  }
};

export const formatCreateAPIPayload = (data: AddAlertRuleFormValues): AlertRuleCreatePayload => {
  const { enabled, duration, filters, name, notificationChannels, severity, template, threshold } = data;

  return {
    custom_labels: {},
    disabled: !enabled,
    channel_ids: notificationChannels ? notificationChannels.map(channel => channel.value) : [],
    filters: formatFilters(filters),
    for: `${duration}s`,
    params: [formatThreshold(threshold)],
    severity: severity.value,
    template_name: template.value,
    summary: name,
  };
};
