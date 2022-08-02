import React, { FC, useEffect, useMemo, useState } from 'react';
import { useStyles2 } from '@grafana/ui';
import { useDispatch, useSelector } from 'react-redux';
import Page from 'app/core/components/Page/Page';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { getPerconaServer, getPerconaSettings } from 'app/percona/shared/core/selectors';
import { getSettingsStyles } from 'app/percona/settings/Settings.styles';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { Connected } from './Connected/Connected';
import { Connect } from './Connect/Connect';
import { PlatformService } from './Platform.service';
import appEvents from 'app/core/app_events';
import { AppEvents } from '@grafana/data';
import { logger } from '@percona/platform-core';
import { fetchServerInfoAction, fetchSettingsAction, updateSettingsAction } from 'app/percona/shared/core/reducers';
import { ConnectRenderProps } from './types';
import { CONNECT_AFTER_SETTINGS_DELAY, CONNECT_DELAY } from './Platform.constants';
import { Messages } from './Platform.messages';

export const Platform: FC = () => {
  const navModel = usePerconaNavModel('settings-percona-platform');
  const settingsStyles = useStyles2(getSettingsStyles);
  const { result } = useSelector(getPerconaSettings);
  const [connecting, setConnecting] = useState(false);
  const { serverId: pmmServerId = '' } = useSelector(getPerconaServer);
  const { result: settings, loading: settingsLoading } = useSelector(getPerconaSettings);
  const dispatch = useDispatch();
  const showMonitoringWarning = useMemo(() => settingsLoading || !settings?.publicAddress, [
    settings?.publicAddress,
    settingsLoading,
  ]);

  const [initialValues, setInitialValues] = useState<ConnectRenderProps>({
    pmmServerName: '',
    pmmServerId,
    accessToken: '',
  });

  useEffect(() => setInitialValues((oldValues) => ({ ...oldValues, pmmServerId })), [pmmServerId]);

  const connect = async (pmmServerName: string, accessToken: string) => {
    try {
      await PlatformService.connect({
        server_name: pmmServerName,
        personal_access_token: accessToken,
      });
      // We need some short delay for changes to apply before immediately calling getSettings
      setTimeout(async () => {
        appEvents.emit(AppEvents.alertSuccess, [Messages.connectSucceeded]);
        setConnecting(false);
        dispatch(fetchServerInfoAction());
        dispatch(fetchSettingsAction());
      }, CONNECT_DELAY);
    } catch (e) {
      logger.error(e);
      setConnecting(false);
    }
  };

  const handleConnect = async ({ pmmServerName, accessToken }: ConnectRenderProps) => {
    setInitialValues((oldValues) => ({ ...oldValues, pmmServerName, accessToken }));
    setConnecting(true);
    if (showMonitoringWarning) {
      await dispatch(updateSettingsAction({ body: { pmm_public_address: window.location.host } }));
      setTimeout(() => connect(pmmServerName, accessToken), CONNECT_AFTER_SETTINGS_DELAY);
    } else {
      connect(pmmServerName, accessToken);
    }
  };

  return (
    <Page navModel={navModel} vertical tabsDataTestId="settings-tabs">
      <Page.Contents dataTestId="settings-tab-content" className={settingsStyles.pageContent}>
        <FeatureLoader>
          {result?.isConnectedToPortal ? (
            <Connected />
          ) : (
            <Connect initialValues={initialValues} onConnect={handleConnect} connecting={connecting} />
          )}
        </FeatureLoader>
      </Page.Contents>
    </Page>
  );
};

export default Platform;
