import React, { FC, useState } from 'react';
import { cx } from '@emotion/css';
import { Field, Form } from 'react-final-form';
import { Button, Spinner, TextArea, useTheme } from '@grafana/ui';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/store/store';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { updateSettingsAction } from 'app/percona/shared/core/reducers';
import { SET_SETTINGS_CANCEL_TOKEN } from '../../Settings.constants';
import Page from 'app/core/components/Page/Page';
import { useNavModel } from 'app/core/hooks/useNavModel';
import { PermissionLoader } from 'app/percona/shared/components/Elements/PermissionLoader/PermissionLoader';
import { getSettingsStyles } from 'app/percona/settings/Settings.styles';
import { Messages } from 'app/percona/settings/Settings.messages';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';
import { getStyles } from './SSHKey.styles';
import { WithDiagnostics } from '../WithDiagnostics/WithDiagnostics';

export const SSHKey: FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const settingsStyles = getSettingsStyles(theme);
  const {
    ssh: { action, label, link, tooltip },
    tooltipLinkText,
  } = Messages;
  const [loading, setLoading] = useState(false);
  const [generateToken] = useCancelToken();
  const { result: settings } = useSelector(getPerconaSettings);
  const dispatch = useAppDispatch();
  const navModel = useNavModel('settings-ssh', true);
  const { sshKey } = settings!;
  const isEqual = (a: string, b: string) => !(a && !b) || a === b;

  const applyChanges = async ({ key }: { key: string }) => {
    setLoading(true);
    await dispatch(
      updateSettingsAction({
        body: { ssh_key: key },
        token: generateToken(SET_SETTINGS_CANCEL_TOKEN),
      })
    );
    setLoading(false);
  };

  return (
    <Page navModel={navModel} vertical>
      <Page.Contents>
        <PermissionLoader
          featureSelector={() => true}
          renderError={() => null}
          renderSuccess={() => (
            <WithDiagnostics>
              <div className={cx(settingsStyles.wrapper, styles.sshKeyWrapper)}>
                <Form
                  onSubmit={applyChanges}
                  initialValues={{ key: sshKey }}
                  render={({ handleSubmit, pristine }) => (
                    <form onSubmit={handleSubmit}>
                      <div className={settingsStyles.labelWrapper} data-testid="ssh-key-label">
                        <span>{label}</span>
                        <LinkTooltip tooltipText={tooltip} link={link} linkText={tooltipLinkText} icon="info-circle" />
                      </div>
                      <Field
                        name="key"
                        isEqual={isEqual}
                        render={({ input }) => (
                          <TextArea {...input} className={styles.textarea} data-testid="ssh-key" />
                        )}
                      />
                      <Button
                        className={settingsStyles.actionButton}
                        type="submit"
                        disabled={pristine || loading}
                        data-testid="ssh-key-button"
                      >
                        {loading && <Spinner />}
                        {action}
                      </Button>
                    </form>
                  )}
                />
              </div>
            </WithDiagnostics>
          )}
        />
      </Page.Contents>
    </Page>
  );
};

export default SSHKey;
