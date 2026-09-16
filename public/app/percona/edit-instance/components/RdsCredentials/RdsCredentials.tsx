import { FC, useMemo } from 'react';

import { useStyles2 } from '@grafana/ui';
import { getStyles } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.styles';
import { PasswordInputField } from 'app/percona/shared/components/Form/PasswordInput';
import { RadioButtonGroupField } from 'app/percona/shared/components/Form/RadioButtonGroup';
import { TextInputField } from 'app/percona/shared/components/Form/TextInput';
import { validators } from 'app/percona/shared/helpers/validatorsForm';

import { RdsAuthMode } from '../../EditInstance.types';

import { Messages } from './RdsCredentials.messages';
import { RdsCredentialsProps } from './RdsCredentials.types';
import { requiredAwsSecretKey } from './RdsCredentials.validators';

const { fields, authMode } = Messages;

const AUTH_MODE_OPTIONS = [
  { value: RdsAuthMode.accessKey, label: authMode.options.accessKey },
  { value: RdsAuthMode.iamRole, label: authMode.options.iamRole },
  { value: RdsAuthMode.hostCredentials, label: authMode.options.hostCredentials },
];

const roleArnValidators = [validators.required, validators.awsRoleArn];
const accessKeyValidators = [validators.required];

// Only the inputs belonging to the selected mode are rendered, which is what makes the modes
// mutually exclusive without a cross-field validator: whatever the other modes left behind in
// form state is ignored when the payload is built. The parent form does not set
// destroyOnUnregister, so switching back and forth keeps what was typed.
export const RdsCredentials: FC<RdsCredentialsProps> = ({ exporter, mode }) => {
  const styles = useStyles2(getStyles);
  const secretKeyValidators = useMemo(
    () => [requiredAwsSecretKey(exporter.awsAccessKey, exporter.isAwsSecretKeySet)],
    [exporter.awsAccessKey, exporter.isAwsSecretKeySet]
  );

  return (
    <div className={styles.groupWrapper} data-testid="rds-credentials">
      <h4 className={styles.sectionHeader}>{Messages.sectionTitle}</h4>
      <p>{Messages.description}</p>
      <RadioButtonGroupField
        name="rds_auth_mode"
        label={authMode.label}
        tooltipText={authMode.tooltipText}
        options={AUTH_MODE_OPTIONS}
      />
      {mode === RdsAuthMode.accessKey && (
        <div className={styles.group}>
          <TextInputField
            name="aws_access_key"
            label={fields.awsAccessKey.label}
            placeholder={fields.awsAccessKey.placeholder}
            validators={accessKeyValidators}
          />
          <PasswordInputField
            name="aws_secret_key"
            label={fields.awsSecretKey.label}
            placeholder={
              exporter.isAwsSecretKeySet ? fields.awsSecretKey.storedPlaceholder : fields.awsSecretKey.placeholder
            }
            validators={secretKeyValidators}
          />
        </div>
      )}
      {mode === RdsAuthMode.iamRole && (
        <div className={styles.group}>
          <TextInputField
            name="aws_role_arn"
            label={fields.awsRoleArn.label}
            placeholder={fields.awsRoleArn.placeholder}
            tooltipText={fields.awsRoleArn.tooltipText}
            validators={roleArnValidators}
          />
        </div>
      )}
      {mode === RdsAuthMode.hostCredentials && (
        <p data-testid="rds-host-credentials-note">{Messages.hostCredentials}</p>
      )}
    </div>
  );
};

export default RdsCredentials;
