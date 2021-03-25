import React, { FC, useEffect, useState } from 'react';
import { Spinner, useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { EmptyBlock } from 'app/features/integrated-alerting/components/EmptyBlock';
import { FeatureLoaderProps } from './FeatureLoader.types';
import { Messages } from './FeatureLoader.messages';
import { PMM_SETTINGS_URL } from './FeatureLoader.constants';
import { getStyles } from './FeatureLoader.styles';
import { FeatureLoaderService } from './FeatureLoader.service';

export const FeatureLoader: FC<FeatureLoaderProps> = ({ featureName, featureFlag, children }) => {
  const styles = useStyles(getStyles);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [featureEnabled, setFeatureEnabled] = useState(false);

  const getSettings = async () => {
    setLoadingSettings(true);

    try {
      const { settings } = await FeatureLoaderService.getSettings();
      setFeatureEnabled(!!settings[featureFlag]);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  if (featureEnabled) {
    return <>{children}</>;
  }

  return (
    <div className={styles.emptyBlock}>
      <EmptyBlock dataQa="empty-block">
        {loadingSettings ? (
          <Spinner />
        ) : (
          <>
            {Messages.featureDisabled(featureName)}&nbsp;
            <a data-qa="settings-link" className={styles.link} href={PMM_SETTINGS_URL}>
              {Messages.pmmSettings}
            </a>
          </>
        )}
      </EmptyBlock>
    </div>
  );
};
