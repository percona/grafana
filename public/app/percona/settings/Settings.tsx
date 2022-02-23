import React, { FC, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { Spinner, useTheme } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { Advanced, AlertManager, Diagnostics, MetricsResolution, Platform, SSHKey } from './components';
import { FeatureFlags, FeatureFlagsStaticProps } from '../shared/core';
import { setFeatures } from '../shared/core/reducers';
import { LoadingCallback, SettingsService } from './Settings.service';
import { Settings, TabKeys, SettingsAPIChangePayload } from './Settings.types';
import { Messages } from './Settings.messages';
import { getSettingsStyles } from './Settings.styles';
import { GET_SETTINGS_CANCEL_TOKEN, SET_SETTINGS_CANCEL_TOKEN, PAGE_MODEL } from './Settings.constants';
import { Communication } from './components/Communication/Communication';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { ContentTab, TabbedContent, TabOrientation } from '../shared/components/Elements/TabbedContent';
import { useCancelToken } from '../shared/components/hooks/cancelToken.hook';
import { EmptyBlock } from '../shared/components/Elements/EmptyBlock';
import { TechnicalPreview } from '../shared/components/Elements/TechnicalPreview/TechnicalPreview';

export const SettingsPanel: FC<GrafanaRouteComponentProps<{ tab: string }>> = ({ match }) => {
  const { path: basePath } = PAGE_MODEL;
  const tab = match.params.tab;
  const [generateToken] = useCancelToken();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [hasNoAccess, setHasNoAccess] = useState(false);
  const styles = getSettingsStyles(theme);
  const { metrics, advanced, ssh, alertManager, perconaPlatform, communication } = Messages.tabs;
  const [settings, setSettings] = useState<Settings>();
  const techPreviewRef = useRef<HTMLDivElement | null>(null);

  const updateSettings = useCallback(
    async (body: SettingsAPIChangePayload, callback: LoadingCallback, onError = () => {}) => {
      // we save the test email here so that we can sent it all the way down to the form again after re-render
      // the field is deleted from the payload so as not to be sent to the API
      let password = '';
      let testEmail = '';

      if ('email_alerting_settings' in body) {
        password = body.email_alerting_settings.password || '';
        testEmail = body.email_alerting_settings.test_email || '';

        if (testEmail) {
          body.email_alerting_settings.test_email = undefined;
        }
      }
      const response = await SettingsService.setSettings(body, callback, generateToken(SET_SETTINGS_CANCEL_TOKEN));

      if (response) {
        const flags: Partial<FeatureFlags> = {};
        FeatureFlagsStaticProps.forEach((flag) => {
          flags[flag] = flag in response && !!response[flag];
        });

        if (Object.keys(flags).length > 0) {
          dispatch(setFeatures(flags));
        }

        // password is not being returned by the API, hence this construction
        const newSettings: Settings = {
          ...response,
          alertingSettings: {
            ...response.alertingSettings,
            email: { ...response.alertingSettings.email, password, test_email: testEmail },
          },
        };
        setSettings(newSettings);
      } else {
        onError();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getSettings = useCallback(async () => {
    try {
      setLoading(true);
      const settings = await SettingsService.getSettings(generateToken(GET_SETTINGS_CANCEL_TOKEN));
      setSettings(settings);
    } catch (e) {
      if (e.response?.status === 401) {
        setHasNoAccess(true);
      }
      logger.error(e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs: ContentTab[] = useMemo(
    (): ContentTab[] =>
      settings
        ? [
            {
              label: metrics,
              key: TabKeys.metrics,
              component: (
                <MetricsResolution metricsResolutions={settings.metricsResolutions} updateSettings={updateSettings} />
              ),
            },
            {
              label: advanced,
              key: TabKeys.advanced,
              component: (
                <Advanced
                  dataRetention={settings.dataRetention}
                  telemetryEnabled={!!settings.telemetryEnabled}
                  updatesDisabled={!!settings.updatesDisabled}
                  sttEnabled={!!settings.sttEnabled}
                  dbaasEnabled={!!settings.dbaasEnabled}
                  alertingEnabled={!!settings.alertingEnabled}
                  backupEnabled={!!settings.backupEnabled}
                  azureDiscoverEnabled={!!settings.azureDiscoverEnabled}
                  publicAddress={settings.publicAddress}
                  updateSettings={updateSettings}
                  sttCheckIntervals={settings.sttCheckIntervals}
                />
              ),
            },
            {
              label: ssh,
              key: TabKeys.ssh,
              component: <SSHKey sshKey={settings.sshKey || ''} updateSettings={updateSettings} />,
            },
            {
              label: alertManager,
              key: TabKeys.alertManager,
              component: (
                <AlertManager
                  alertManagerUrl={settings.alertManagerUrl || ''}
                  alertManagerRules={settings.alertManagerRules || ''}
                  updateSettings={updateSettings}
                />
              ),
            },
            {
              label: perconaPlatform,
              key: TabKeys.perconaPlatform,
              component: (
                <>
                  {techPreviewRef.current && createPortal(<TechnicalPreview />, techPreviewRef.current)}
                  <Platform isConnected={settings.isConnectedToPortal} getSettings={getSettings} />
                </>
              ),
            },
            {
              label: communication,
              key: TabKeys.communication,
              hidden: !settings?.alertingEnabled,
              component: (
                <Communication
                  alertingSettings={settings.alertingSettings}
                  alertingEnabled={!!settings.alertingEnabled}
                  updateSettings={updateSettings}
                />
              ),
            },
          ]
        : [],
    [settings, advanced, alertManager, communication, metrics, perconaPlatform, ssh, getSettings, updateSettings]
  );

  useEffect(() => {
    getSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <div ref={(e) => (techPreviewRef.current = e)} />
      <div className={styles.settingsWrapper}>
        {(loading || hasNoAccess) && (
          <div className={styles.emptyBlock}>
            <EmptyBlock dataTestId="empty-block">
              {loading ? <Spinner /> : hasNoAccess && <div data-testid="unauthorized">{Messages.unauthorized}</div>}
            </EmptyBlock>
          </div>
        )}
        {!loading && !hasNoAccess && (
          <>
            <TabbedContent
              activeTabName={tab}
              className={styles.tabsWrapper}
              tabs={tabs}
              basePath={basePath}
              orientation={TabOrientation.Vertical}
              tabsdataTestId="settings-tabs"
              contentdataTestId="settings-tab-content"
              renderTab={({ Content }) => <Content className={styles.tabContentWrapper} />}
            />
            <Diagnostics />
          </>
        )}
      </div>
    </PageWrapper>
  );
};
export default SettingsPanel;
