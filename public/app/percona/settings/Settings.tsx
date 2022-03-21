import React, { FC, useMemo, useState } from 'react';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { Spinner, useTheme } from '@grafana/ui';
import { Advanced, AlertManager, Diagnostics, MetricsResolution, Platform, SSHKey } from './components';
import { TabKeys } from './Settings.types';
import { Messages } from './Settings.messages';
import { getSettingsStyles } from './Settings.styles';
import { PAGE_MODEL } from './Settings.constants';
import { Communication } from './components/Communication/Communication';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { ContentTab, TabbedContent, TabOrientation } from '../shared/components/Elements/TabbedContent';
import { EmptyBlock } from '../shared/components/Elements/EmptyBlock';
import { TechnicalPreview } from '../shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { getPerconaSettings, getPerconaUser } from 'app/percona/shared/core/selectors';

export const SettingsPanel: FC<GrafanaRouteComponentProps<{ tab: string }>> = ({ match }) => {
  const { path: basePath } = PAGE_MODEL;
  const tab = match.params.tab;
  const theme = useTheme();
  const styles = getSettingsStyles(theme);
  const { metrics, advanced, ssh, alertManager, perconaPlatform, communication } = Messages.tabs;
  const { result: settings, loading } = useSelector(getPerconaSettings);
  const { isAuthorized } = useSelector(getPerconaUser);
  const [techPreviewRef, setTechPreviewRef] = useState<HTMLDivElement | null>(null);

  const tabs: ContentTab[] = useMemo(
    (): ContentTab[] =>
      settings
        ? [
            {
              label: metrics,
              key: TabKeys.metrics,
              component: <MetricsResolution />,
            },
            {
              label: advanced,
              key: TabKeys.advanced,
              component: <Advanced />,
            },
            {
              label: ssh,
              key: TabKeys.ssh,
              component: <SSHKey />,
            },
            {
              label: alertManager,
              key: TabKeys.alertManager,
              component: <AlertManager />,
            },
            {
              label: perconaPlatform,
              key: TabKeys.perconaPlatform,
              component: (
                <>
                  {techPreviewRef && createPortal(<TechnicalPreview />, techPreviewRef)}
                  <Platform />
                </>
              ),
            },
            {
              label: communication,
              key: TabKeys.communication,
              hidden: !settings?.alertingEnabled,
              component: <Communication />,
            },
          ]
        : [],
    [settings, advanced, alertManager, communication, metrics, perconaPlatform, ssh, techPreviewRef]
  );

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <div ref={(e) => setTechPreviewRef(e)} />
      <div className={styles.settingsWrapper}>
        {(loading || !isAuthorized) && (
          <div className={styles.emptyBlock}>
            <EmptyBlock dataTestId="empty-block">
              {loading ? <Spinner /> : !isAuthorized && <div data-testid="unauthorized">{Messages.unauthorized}</div>}
            </EmptyBlock>
          </div>
        )}
        {!loading && isAuthorized && (
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
