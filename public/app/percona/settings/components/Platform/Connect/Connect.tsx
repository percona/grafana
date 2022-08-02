import React, { FC, useMemo } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useSelector } from 'react-redux';
import { useStyles } from '@grafana/ui';
import validators from 'app/percona/shared/helpers/validators';
import { ConnectRenderProps } from '../types';
import { Messages } from '../Platform.messages';
import { getStyles } from './Connect.styles';
import { LoaderButton, TextInputField } from '@percona/platform-core';
import { getPerconaServer, getPerconaSettings } from 'app/percona/shared/core/selectors';
import { PMMServerUrlWarning } from 'app/percona/dbaas/components/PMMServerURLWarning/PMMServerUrlWarning';

interface Props {
  onConnect: (values: ConnectRenderProps) => void;
  connecting: boolean;
  initialValues: ConnectRenderProps;
}

export const Connect: FC<Props> = ({ onConnect, connecting, initialValues }) => {
  const styles = useStyles(getStyles);
  const { saasHost } = useSelector(getPerconaServer);
  const { result: settings, loading: settingsLoading } = useSelector(getPerconaSettings);
  const showMonitoringWarning = useMemo(() => settingsLoading || !settings?.publicAddress, [
    settings?.publicAddress,
    settingsLoading,
  ]);

  const ConnectForm: FC<FormRenderProps<ConnectRenderProps>> = ({ pristine, valid, handleSubmit }) => (
    <form data-testid="connect-form" className={styles.form} onSubmit={handleSubmit} autoComplete="off">
      <legend className={styles.legend}>{Messages.title}</legend>
      {showMonitoringWarning && <PMMServerUrlWarning />}
      <TextInputField name="pmmServerId" disabled label={Messages.pmmServerId} />
      <TextInputField
        name="pmmServerName"
        label={Messages.pmmServerName}
        validators={[validators.required]}
        showErrorOnBlur
        required
        disabled={connecting}
      />
      <div className={styles.accessTokenRow}>
        <TextInputField
          name="accessToken"
          label={Messages.accessToken}
          validators={[validators.required]}
          showErrorOnBlur
          required
          disabled={connecting}
        />
        <a href={`${saasHost}/profile`} rel="noreferrer noopener" target="_blank">
          Get token
        </a>
      </div>
      <LoaderButton
        data-testid="connect-button"
        type="submit"
        size="md"
        variant="primary"
        disabled={!valid || connecting}
        loading={connecting}
        className={styles.submitButton}
      >
        {Messages.connect}
      </LoaderButton>
    </form>
  );

  return <Form onSubmit={onConnect} initialValues={initialValues} render={ConnectForm} />;
};
