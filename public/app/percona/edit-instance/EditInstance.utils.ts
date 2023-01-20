import { Databases } from '../shared/core';

import { EditInstanceFormValues, Instance } from './EditInstance.types';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const getServiceType = (result: Record<Databases, Instance>): Databases => Object.keys(result)[0] as Databases;

export const getInitialValues = (service?: Instance): EditInstanceFormValues => {
  if (service) {
    return {
      ...service,
      custom_labels: fromPayload(service.custom_labels || {}),
    };
  }

  return {
    environment: '',
    cluster: '',
    replication_set: '',
    region: '',
    availability_zone: '',
    custom_labels: '',
  };
};

export const fromPayload = (customLabels: Record<string, string>): string =>
  Object.entries(customLabels)
    .map(([label, value]) => label + ':' + value)
    .join('\n');

export const customLabelstoObject = (customLabels: string): Record<string, string> =>
  customLabels
    .split(/[\n\s]/)
    .filter(Boolean)
    .reduce((acc: Record<string, string>, val: string) => {
      const [key, value] = val.split(':');

      acc[key] = value;

      return acc;
    }, {});

// todo: refactor functions to be more performant
export const getCustomLabelsToAddEdit = (current: Record<string, string>, updated: string): Record<string, string> => {
  const updatedMap = customLabelstoObject(updated);
  const toRemove = getCustomLabelKeysToRemove(current, updated);
  const filtered = Object.entries(updatedMap).filter(([label]) => !toRemove.includes(label));
  return Object.fromEntries(filtered);
};

export const getCustomLabelKeysToRemove = (current: Record<string, string>, updated: string): string[] => {
  const updatedMap = customLabelstoObject(updated);
  return Object.keys(current).filter((label) => updatedMap[label] === undefined);
};
