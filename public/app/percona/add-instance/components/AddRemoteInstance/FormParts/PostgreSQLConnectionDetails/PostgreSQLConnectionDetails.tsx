import { PasswordInputField, TextInputField, validators } from '@percona/platform-core';
import React, { FC, useMemo } from 'react';

import { useStyles2 } from '@grafana/ui';
import Validators from 'app/percona/shared/helpers/validators';

import { Messages } from '../FormParts.messages';
import { getStyles } from '../FormParts.styles';
import { MainDetailsFormPartProps } from '../FormParts.types';

export const PostgreSQLConnectionDetails: FC<MainDetailsFormPartProps> = ({ form, remoteInstanceCredentials }) => {
  const styles = useStyles2(getStyles);
  const formValues = form && form.getState().values;
  const tlsFlag = formValues && formValues['tls'];

  const portValidators = useMemo(() => [validators.required, Validators.validatePort], []);
  const userPassValidators = useMemo(() => (tlsFlag ? [] : [validators.required]), [tlsFlag]);
  const maxQueryLengthValidators = useMemo(() => [Validators.min(-1)], []);

  return (
    <div className={styles.groupWrapper}>
      <h4 className={styles.sectionHeader}>{Messages.form.titles.mainDetails}</h4>
      <div className={styles.group}>
        <TextInputField
          name="serviceName"
          placeholder={Messages.form.placeholders.mainDetails.serviceName}
          label={Messages.form.labels.mainDetails.serviceName}
          tooltipText={Messages.form.tooltips.mainDetails.serviceName}
          tooltipIcon="info-circle"
        />
        <div />
      </div>
      <div className={styles.group}>
        <TextInputField
          name="address"
          placeholder={Messages.form.placeholders.mainDetails.address}
          validators={[validators.required]}
          disabled={remoteInstanceCredentials.isRDS}
          label={Messages.form.labels.mainDetails.address}
          tooltipText={Messages.form.tooltips.mainDetails.address}
          tooltipIcon="info-circle"
        />
        <TextInputField
          name="port"
          placeholder={`Port (default: ${remoteInstanceCredentials.port} )`}
          validators={portValidators}
          label={Messages.form.labels.mainDetails.port}
          tooltipText={Messages.form.tooltips.mainDetails.port}
          tooltipIcon="info-circle"
        />
      </div>
      <div className={styles.group}>
        <TextInputField
          key={`username-${tlsFlag}`}
          name="username"
          placeholder={Messages.form.placeholders.mainDetails.username}
          validators={userPassValidators}
          label={Messages.form.labels.mainDetails.username}
          tooltipText={Messages.form.tooltips.mainDetails.username}
          tooltipIcon="info-circle"
        />
        <PasswordInputField
          key={`password-${tlsFlag}`}
          name="password"
          placeholder={Messages.form.placeholders.mainDetails.password}
          validators={userPassValidators}
          label={Messages.form.labels.mainDetails.password}
          tooltipText={Messages.form.tooltips.mainDetails.password}
          tooltipIcon="info-circle"
        />
      </div>
      <div className={styles.group}>
        <TextInputField
          key="database"
          name="database"
          placeholder={Messages.form.placeholders.postgresqlDetails.database}
          label={Messages.form.labels.postgresqlDetails.database}
          tooltipText={Messages.form.tooltips.postgresqlDetails.database}
          tooltipIcon="info-circle"
        />
        <TextInputField
          key="maxQueryLength"
          name="maxQueryLength"
          placeholder={Messages.form.placeholders.postgresqlDetails.maxQueryLength}
          validators={maxQueryLengthValidators}
          label={Messages.form.labels.postgresqlDetails.maxQueryLength}
          tooltipText={Messages.form.tooltips.postgresqlDetails.maxQueryLength}
          tooltipIcon="info-circle"
        />
      </div>
    </div>
  );
};
