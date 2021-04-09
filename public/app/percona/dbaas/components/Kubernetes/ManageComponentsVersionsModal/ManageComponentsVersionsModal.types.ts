import { SelectableValue } from '@grafana/data';
import { Operators } from '../../DBCluster/AddDBClusterModal/DBClusterBasicOptions/DBClusterBasicOptions.types';
import { Kubernetes } from '../Kubernetes.types';

export interface ManageComponentsVersionsModalProps {
  selectedKubernetes: Kubernetes;
  isVisible: boolean;
  setVisible: (value: boolean) => void;
}

export interface ManageComponentsVersionsRenderProps {
  operator: SelectableValue;
  component: SelectableValue;
  // used for dynamically generated attributes
  // based on operator and supported components
  [key: string]: any;
}

export interface PossibleComponentOptions {
  [Operators.xtradb]?: SelectableValue[];
  [Operators.psmdb]?: SelectableValue[];
}

export enum SupportedComponents {
  pxc = 'pxc',
  proxysql = 'proxysql',
  mongod = 'mongod',
}

export enum ManageComponentVersionsFields {
  operator = 'operator',
  component = 'component',
}

export type SetComponentOptionsAction = (options: SelectableValue[]) => void;
export type SetVersionsOptionsAction = (options: SelectableValue[]) => void;
export type SetVersionsFieldNameAction = (name: string) => void;
export type SetDefaultFieldNameAction = (name: string) => void;
