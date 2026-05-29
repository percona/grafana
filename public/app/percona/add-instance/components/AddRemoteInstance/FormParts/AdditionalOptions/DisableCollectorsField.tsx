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
    <TextInputField
      name={name}
      label={
        <div>
          <label htmlFor={`input-${name}-id`}>{Messages.form.labels.additionalOptions.disableCollectors}</label>
          <p className={styles.description}>{Messages.form.descriptions.disableCollectors}</p>
        </div>
      }
      placeholder={Messages.form.placeholders.additionalOptions.disableCollectors}
      validators={[platformCoreValidators.disableCollectors]}
    />
  );
};

export default DisableCollectorsField;
