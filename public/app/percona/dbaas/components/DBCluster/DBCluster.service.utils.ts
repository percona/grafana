import { SelectableValue } from '@grafana/data';
import {
  ManageComponentsVersionsRenderProps,
  SupportedComponents,
} from '../Kubernetes/ManageComponentsVersionsModal/ManageComponentsVersionsModal.types';
import { Operators } from './AddDBClusterModal/DBClusterBasicOptions/DBClusterBasicOptions.types';
import { DBClusterChangeComponentAPI } from './DBCluster.types';

export const getComponentChange = (
  operator: Operators,
  component: SupportedComponents,
  componentsVersions: ManageComponentsVersionsRenderProps
): DBClusterChangeComponentAPI => {
  const versions = componentsVersions[`${operator}${component}`] as SelectableValue[];

  return {
    versions: versions.map(({ label, value }) => ({
      version: label as string,
      ...(value && { enable: true }),
      ...(!value && { disable: true }),
    })),
  };
};
