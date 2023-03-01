import { FormApi } from 'final-form';

import { SelectableValue } from '@grafana/data';

import { EditDBClusterForm } from '../../EditDBClusterPage.types';

export interface RestoreFromProps {
  form: FormApi<EditDBClusterForm, Partial<EditDBClusterForm>>;
}

export enum RestoreFields {
  restoreFrom = 'restoreFrom',
  backupArtifact = 'backupArtifact',
  secretsName = 'secretsName',
}

export interface RestoreFieldsProps {
  [RestoreFields.restoreFrom]?: SelectableValue<string>;

  [RestoreFields.backupArtifact]?: SelectableValue<string>;
  [RestoreFields.secretsName]?: SelectableValue<string>;
}
