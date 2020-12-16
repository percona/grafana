import { AddAlertRuleFormValues } from './AddAlertRuleModal.types';
import { AlertRuleCreatePayload, AlertRulesListPayloadFilter } from '../AlertRules.types';
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

export const formatCreateAPIPayload = (data: AddAlertRuleFormValues): AlertRuleCreatePayload => {
  const { enabled, duration, filters, name, notificationChannels, severity, template, threshold } = data;

  return {
    custom_labels: {},
    disabled: !enabled,
    channel_ids: notificationChannels ? notificationChannels.map(channel => channel.value) : [],
    filters: formatFilters(filters),
    for: `${duration}s`,
    params: [],
    severity: severity.value,
    template_name: template.value,
    threshold,
    summary: name,
  };
};
