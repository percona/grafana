import { FC, useMemo } from 'react';

import { useStyles2 } from '@grafana/ui';
import { getStyles } from 'app/percona/add-instance/components/AddRemoteInstance/FormParts/FormParts.styles';
import { PasswordInputField } from 'app/percona/shared/components/Form/PasswordInput';
import { RadioButtonGroupField } from 'app/percona/shared/components/Form/RadioButtonGroup';
import { TextInputField } from 'app/percona/shared/components/Form/TextInput';

import { RdsAuthMode } from '../../EditInstance.types';

import { ACCESS_KEY_VALIDATORS, AUTH_MODE_OPTIONS, ROLE_ARN_VALIDATORS } from './RdsCredentials.constants';
import { Messages } from './RdsCredentials.messages';
import { RdsCredentialsProps } from './RdsCredentials.types';
import { requiredAwsSecretKey } from './RdsCredentials.validators';

const { fields, authMode } = Messages;

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
            validators={ACCESS_KEY_VALIDATORS}
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
            validators={ROLE_ARN_VALIDATORS}
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
