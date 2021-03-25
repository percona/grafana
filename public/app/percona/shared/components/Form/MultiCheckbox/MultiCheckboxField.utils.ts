import { SelectableValue } from '@grafana/data';

export const formatOptions = (options: SelectableValue[]) =>
  options.reduce((acc, { label, value }) => ({ ...acc, [label as string]: value }), {});
