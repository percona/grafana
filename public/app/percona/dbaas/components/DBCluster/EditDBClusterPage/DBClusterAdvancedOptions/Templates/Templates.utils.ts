import { SelectableValue } from '@grafana/data';

import { DBClusterTemplatesResponse } from './Templates.types';
export const notSelectedOption = { label: 'Not selected', value: '' };
export const getTemplatesOptions = (
  templatesResponce: DBClusterTemplatesResponse | undefined
): Array<SelectableValue<string>> => {
  const templates = templatesResponce?.templates || [];
  const options = templates.map((template) => ({
    label: template.name,
    value: template.kind,
  }));
  return options?.length ? [...options, notSelectedOption] : [notSelectedOption];
};
