import { FormApi } from 'final-form';

import { Databases } from 'app/percona/shared/core';

import { DBClusterPageMode } from '../../EditDBClusterPage.types';
export enum ConfigurationFields {
  storageClass = 'storageClass',
  configuration = 'configuration',
}

export interface ConfigurationProps {
  databaseType: Databases;
  k8sClusterName: string;
  mode: DBClusterPageMode;
  form: FormApi<Record<string, any>, Partial<Record<string, any>>>;
}