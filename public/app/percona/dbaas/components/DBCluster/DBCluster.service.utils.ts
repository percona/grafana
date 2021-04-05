import { SelectableValue } from '@grafana/data';
import { DEFAULT_SUFFIX } from '../Kubernetes/ManageComponentsVersionsModal/ManageComponentsVersionsModal.constants';
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
  const name = `${operator}${component}`;
  const defaultName = `${name}${DEFAULT_SUFFIX}`;
  const versions = componentsVersions[name] as SelectableValue[];
  const defaultVersion = componentsVersions[defaultName];

  return {
    default_version: defaultVersion.label,
    versions: versions.map(({ label, value }) => ({
      version: label as string,
      ...(value && { enable: true }),
      ...(!value && { disable: true }),
    })),
  };
};
