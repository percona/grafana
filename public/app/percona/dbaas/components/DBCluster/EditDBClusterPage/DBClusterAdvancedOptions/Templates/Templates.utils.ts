import { SelectableValue } from '@grafana/data';

import { DBClusterTemplatesResponse } from './Templates.types';

export const getTemplatesOptions = (
  templatesResponce: DBClusterTemplatesResponse | undefined
): Array<SelectableValue<string>> => {
  const templates = templatesResponce?.templates || [];
  const options = templates.map((template) => ({
    label: template.name,
    value: template.kind,
  }));
  return options?.length ? [...options, { label: 'Not selected', value: '' }] : [{ label: 'Not selected', value: '' }];
};
