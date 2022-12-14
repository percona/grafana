import { SelectableValue } from '@grafana/data/src';

import { DBCluster } from '../../DBCluster.types';

export const resourceValidator = (value?: number) => {
  if (!value || Math.floor(value) === value) {
    return undefined;
  }

  const precision = value.toString().split('.')[1]?.length || 0;

  return precision > 1 ? 'Only one decimal place allowed' : undefined;
};

export const canGetExpectedResources = (
  kubernetesCluster: DBCluster | SelectableValue,
  values: Record<string, any>
) => {
  const { memory, cpu, disk, nodes } = values;

  return kubernetesCluster && memory > 0 && cpu > 0 && disk > 0 && nodes > 0;
};
