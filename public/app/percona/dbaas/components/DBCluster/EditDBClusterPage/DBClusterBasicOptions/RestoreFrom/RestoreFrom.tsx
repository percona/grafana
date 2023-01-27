import React, { FC } from 'react';
import { Field } from 'react-final-form';

import { SelectableValue } from '@grafana/data';
import { useStyles } from '@grafana/ui';

import { AsyncSelectFieldAdapter } from '../../../../../../shared/components/Form/FieldAdapters/FieldAdapters';
import { Messages } from '../DBClusterBasicOptions.messages';
import { BasicOptionsFields } from '../DBClusterBasicOptions.types';
import { optionRequired } from '../DBClusterBasicOptions.utils';

import { getStyles } from './RestoreFrom.styles';
import { RestoreFromProps } from './RestoreFrom.types';
export const RestoreFrom: FC<RestoreFromProps> = ({ form }) => {
  const styles = useStyles(getStyles);

  const { restoreFrom } = form.getState().values;
  const showBackupArtifacts = restoreFrom ? true : false; //TODO  11301 check cases when we show backup artifact

  const restoreFromOptions: SelectableValue[] = [{ label: 'none', value: 'none' }];
  const backupArtifactOptions: SelectableValue[] = [
    { label: 'test', value: 'test' },
    { label: 'test1', value: 'test1' },
  ];

  return (
    <div className={styles.line}>
      <Field
        name={BasicOptionsFields.restoreFrom}
        label={Messages.restoreFrom}
        dataTestId={`dbcluster-${BasicOptionsFields.restoreFrom}-field`}
        component={AsyncSelectFieldAdapter}
        loading={false}
        options={restoreFromOptions}
        validate={optionRequired}
        // disabled={}
        // onChange={onChangeDatabase}
        // defaultValue={}
      />
      <div className={!showBackupArtifacts ? styles.hiddenField : ''}>
        <Field
          name={BasicOptionsFields.backupArtifact}
          label={Messages.backupArtifact}
          dataTestId={`dbcluster-${BasicOptionsFields.backupArtifact}-field`}
          component={AsyncSelectFieldAdapter}
          loading={false}
          options={backupArtifactOptions}
          validate={optionRequired}
          // defaultValue={}
          // disabled={}
          // onChange={onChangeDatabase}
        />
      </div>
    </div>
  );
};

export default RestoreFrom;
