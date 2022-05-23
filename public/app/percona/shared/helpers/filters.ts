import { SelectableValue } from '@grafana/data';

export const ALL_VALUES_LABEL = 'All';
export const ALL_VALUES_VALUE = 'all';
export const ALL_VALUES_OPTION: SelectableValue<string> = { label: ALL_VALUES_LABEL, value: ALL_VALUES_VALUE };

export const isTextIncluded = (needle: string, haystack: string): boolean =>
  haystack.toLowerCase().includes(needle.toLowerCase());

export const isSameOption = <T = any>(filterValue: T, value: T, anyValue?: T): boolean =>
  filterValue === anyValue || filterValue === value;
