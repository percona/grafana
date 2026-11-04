import { FC, useMemo } from 'react';

import { useStyles2 } from '@grafana/ui';
import { TextInputField } from 'app/percona/shared/components/Form/TextInput';
import { TextareaInputField } from 'app/percona/shared/components/Form/TextareaInput';
import Validators from 'app/percona/shared/helpers/validators';

import { getStyles } from '../../EditInstance.styles';

import { Messages } from './Labels.messages';

const { fields } = Messages;

export const Labels: FC = () => {
  const styles = useStyles2(getStyles);
  const customLabelsValidators = useMemo(() => [Validators.validateKeyValue], []);

  return (
    <div className={styles.groupWrapper}>
      <h4 className={styles.sectionHeader}>{Messages.title}</h4>
      <p>{Messages.description}</p>
      <div className={styles.group}>
        <TextInputField name="environment" label={fields.environment} placeholder={fields.environment} />
        <TextInputField name="cluster" label={fields.cluster} placeholder={fields.cluster} />
      </div>
      <div className={styles.group}>
        <TextInputField name="replication_set" label={fields.replicationSet} placeholder={fields.replicationSet} />
        <div />
      </div>
      <div className={styles.group}>
        <TextareaInputField
          name="custom_labels"
          label={
            <div>
              <label htmlFor="input-custom_labels-id">{fields.customLabels}</label>
              <p className={styles.description}>{Messages.customLabelsDescription}</p>
            </div>
          }
          placeholder={Messages.customLabelsPlaceholder}
          validators={customLabelsValidators}
        />
        <div />
      </div>
    </div>
  );
};
