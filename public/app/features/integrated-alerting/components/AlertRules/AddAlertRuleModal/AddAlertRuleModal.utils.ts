import { AddAlertRuleFormValues } from './AddAlertRuleModal.types';
import { AlertRuleCreatePayload, AlertRulesListPayloadFilter } from '../AlertRules.types';

// TODO: handle new types as they gets added to AlertRuleFilterType
export const formatFilter = (filter: string): AlertRulesListPayloadFilter => {
  console.log(filter);
  const [key, value] = filter.split('=');
  console.log(key, value);

  return {
    key,
    value,
    type: 'EQUAL',
  };
};

export const formatFilters = (filters: string): AlertRulesListPayloadFilter[] => {
  const filterList = filters.split(/,\s*/);

  return filterList.map(formatFilter);
};

export const formatCreateAPIPayload = (data: AddAlertRuleFormValues): AlertRuleCreatePayload => {
  const { enabled, duration, filters, name, notificationChannels, severity, template, threshold } = data;

  return {
    custom_labels: {},
    disabled: !enabled,
    channel_ids: notificationChannels.map(channel => channel.value),
    filters: formatFilters(filters),
    for: `${duration}s`,
    params: [],
    severity: severity.value,
    template_name: template,
    threshold,
    summary: name,
  };
};
