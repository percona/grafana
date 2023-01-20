import { IconName } from '@grafana/data';
import { Databases } from 'app/percona/shared/core';

import { InstanceAvailable, InstanceTypesExtra } from '../../panel.types';

export interface SelectInstanceProps extends InstanceListItem {
  isSelected: boolean;
  selectInstanceType: (type: string) => () => void;
}

export interface AddInstanceProps {
  selectedInstanceType: InstanceAvailable;
  onSelectInstanceType: (arg: InstanceAvailable) => void;
  showAzure: boolean;
}

export interface InstanceListItem {
  type: InstanceTypesExtra | Databases;
  icon?: IconName;
  title: string;
  isHidden?: boolean;
}
