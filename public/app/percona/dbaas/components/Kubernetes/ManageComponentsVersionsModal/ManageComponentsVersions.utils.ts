import { SelectableValue } from '@grafana/data';
import { DBClusterComponent, DBClusterComponentVersionStatus, DBClusterMatrix } from '../../DBCluster/DBCluster.types';
import { Messages } from './ManageComponentsVersionsModal.messages';
import {
  ManageComponentsVersionsRenderProps,
  ManageComponentVersionsFields,
  SupportedComponents,
} from './ManageComponentsVersionsModal.types';

export const requiredVersions = (versions: SelectableValue[]) => {
  if (!versions || !Array.isArray(versions)) {
    return undefined;
  }

  const checked = versions.filter(v => v.value);

  return checked.length > 0 ? undefined : Messages.required;
};

export const componentsToOptions = (value: DBClusterMatrix): SelectableValue[] =>
  Object.keys(value)
    .filter(key => key in SupportedComponents)
    .map((key: SupportedComponents) => ({
      name: key,
      value: key,
      label: Messages.componentLabel[key],
    }));

export const versionsToOptions = (component: DBClusterComponent): SelectableValue[] =>
  Object.entries(component).map(([key, { status }]) => ({
    name: `v${key}`,
    value: true,
    label: key,
    status,
  }));

export const buildVersionsFieldName = (values: ManageComponentsVersionsRenderProps) =>
  `${values[ManageComponentVersionsFields.operator].value}${values[ManageComponentVersionsFields.component].value}`;

export const findRecommendedVersions = (versions: SelectableValue[]) =>
  versions.filter(({ status }) => status === DBClusterComponentVersionStatus.recommended);
