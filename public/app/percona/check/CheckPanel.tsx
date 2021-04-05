import React, { FC, useEffect, useMemo, useState } from 'react';
import { Spinner, useStyles } from '@grafana/ui';
import { PMM_SETTINGS_URL } from 'app/percona/check/CheckPanel.constants';
import { Settings, TabKeys } from './types';
import { CheckService } from './Check.service';
import { getStyles } from './CheckPanel.styles';
import { Messages } from './CheckPanel.messages';
import { AllChecksTab, FailedChecksTab } from './components';
import { PAGE_MODEL } from './CheckPanel.constants';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { TabbedContent, ContentTab } from '../shared/components/Elements/TabbedContent';

export const CheckPanel: FC = () => {
  const { path: basePath } = PAGE_MODEL;

  const [hasNoAccess, setHasNoAccess] = useState(false);
  const [isSttEnabled, setIsSttEnabled] = useState(false);
  const [getSettingsPending, setGetSettingsPending] = useState(false);
  const styles = useStyles(getStyles);

  const getSettings = async () => {
    try {
      setGetSettingsPending(true);
      const resp = (await CheckService.getSettings()) as Settings;

      setIsSttEnabled(!!resp.settings?.stt_enabled);
      setHasNoAccess(false);
    } catch (err) {
      setHasNoAccess(err.response?.status === 401);

      console.error(err);
    } finally {
      setGetSettingsPending(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  const tabs = useMemo<ContentTab[]>(
    (): ContentTab[] => [
      {
        label: Messages.failedChecksTitle,
        key: TabKeys.failedChecks,
        component: () => <FailedChecksTab key="failed-checks" hasNoAccess={hasNoAccess} />,
      },
      {
        label: Messages.allChecksTitle,
        key: TabKeys.allChecks,
        component: () => <AllChecksTab key="all-checks" />,
      },
    ],
    [hasNoAccess, isSttEnabled]
  );

  if (hasNoAccess) {
    return (
      <PageWrapper pageModel={PAGE_MODEL}>
        <div className={styles.panel} data-qa="db-check-panel">
          <div className={styles.empty} data-qa="db-check-panel-unauthorized">
            {Messages.unauthorized}
          </div>
        </div>
      </PageWrapper>
    );
  }

  // TODO replace with FeatureLoader when available
  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <div className={styles.panel} data-qa="db-check-panel">
        {getSettingsPending && (
          <div className={styles.spinner} data-qa="db-check-spinner">
            <Spinner />
          </div>
        )}
        {!getSettingsPending &&
          (isSttEnabled ? (
            <TabbedContent tabs={tabs} basePath={basePath} />
          ) : (
            <div className={styles.empty}>
              {Messages.sttDisabled}{' '}
              <a className={styles.link} href={PMM_SETTINGS_URL} data-qa="db-check-panel-settings-link">
                {Messages.pmmSettings}
              </a>
            </div>
          ))}
      </div>
    </PageWrapper>
  );
};

export default CheckPanel;
