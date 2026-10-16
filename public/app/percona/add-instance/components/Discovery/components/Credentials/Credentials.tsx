import { FC, useCallback } from 'react';
import { Form as FormFinal } from 'react-final-form';

import { useStyles } from '@grafana/ui';
import { ADD_INSTANCE_FORM_NAME } from 'app/percona/add-instance/panel.constants';
import { PasswordInputField } from 'app/percona/shared/components/Form/PasswordInput';
import { TextInputField } from 'app/percona/shared/components/Form/TextInput';
import { validators } from 'app/percona/shared/helpers/validatorsForm';

import { Messages } from './Credentials.messages';
import { getStyles } from './Credentials.styles';
import { CredentialsProps, RDSCredentialsForm } from './Credentials.types';

const { awsAccessKey, awsSecretKey, awsRoleArn } = Messages.form.fields;

// Keys and a role ARN are mutually exclusive. The same rule sits on all three inputs so the
// message appears on whichever one the user is editing, since an error only renders on a
// field that has been touched or modified. None of the fields is required: the form submits
// empty on mount so PMM Server can discover with its own ambient identity.
const exclusiveValidators = [validators.awsCredentialsExclusive];
const roleArnValidators = [validators.awsRoleArn, validators.awsCredentialsExclusive];

const Credentials: FC<CredentialsProps> = ({ discover }) => {
  const styles = useStyles(getStyles);

  const onSubmit = useCallback(
    (values: RDSCredentialsForm) => {
      discover(values);
    },
    [discover]
  );

  return (
    <FormFinal
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form
          id={ADD_INSTANCE_FORM_NAME}
          onSubmit={handleSubmit}
          className={styles.instanceForm}
          data-testid="credentials-form"
        >
          <div className={styles.fieldsWrapper}>
            <div className={styles.credentialsRow}>
              <TextInputField
                name={awsAccessKey.name}
                placeholder={awsAccessKey.placeholder}
                label={awsAccessKey.label}
                fieldClassName={styles.credentialsField}
                validators={exclusiveValidators}
              />
              <PasswordInputField
                name={awsSecretKey.name}
                placeholder={awsSecretKey.placeholder}
                label={awsSecretKey.label}
                fieldClassName={styles.credentialsField}
                validators={exclusiveValidators}
              />
            </div>
            <TextInputField
              name={awsRoleArn.name}
              placeholder={awsRoleArn.placeholder}
              label={awsRoleArn.label}
              tooltipText={awsRoleArn.tooltipText}
              fieldClassName={styles.roleArnField}
              validators={roleArnValidators}
            />
          </div>
        </form>
      )}
    />
  );
};

export default Credentials;
