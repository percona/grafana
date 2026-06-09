import { FC } from 'react';

import { useStyles2 } from '@grafana/ui';
import { TextInputField } from 'app/percona/shared/components/Form/TextInput';
import { validators as platformCoreValidators } from 'app/percona/shared/helpers/validatorsForm';

import { Messages } from '../FormParts.messages';
import { getStyles } from '../FormParts.styles';

interface Props {
  name: string;
}

const DisableCollectorsField: FC<Props> = ({ name }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.fieldWrapper}>
      <TextInputField
        name={name}
        label={
          <>
            <span>{Messages.form.labels.additionalOptions.disableCollectors}</span>
            <br />
            <span className={styles.description}>{Messages.form.descriptions.disableCollectors}</span>
          </>
        }
        placeholder={Messages.form.placeholders.additionalOptions.disableCollectors}
        validators={[platformCoreValidators.disableCollectors]}
      />
    </div>
  );
};

export default DisableCollectorsField;
