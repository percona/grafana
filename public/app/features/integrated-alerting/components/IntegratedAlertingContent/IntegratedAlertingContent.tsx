import React, { FC } from 'react';
import { Spinner, useStyles } from '@grafana/ui';
import { getStyles } from 'app/plugins/panel/homelinks/module';
import { IntegratedAlertingTabs } from '../IntegratedAlertingTabs';
import { EmptyBlock } from '../EmptyBlock';
import { Messages } from './IntegratedAlertingContent.messages';
import { PMM_SETTINGS_URL } from './IntegratedAlertingContent.constants';

export const IntegratedAlertingContent: FC<{ loadingSettings: boolean; alertingEnabled: boolean }> = ({
  loadingSettings,
  alertingEnabled,
}) => {
  const styles = useStyles(getStyles);
  if (alertingEnabled) {
    return <IntegratedAlertingTabs />;
  }

  return (
    <EmptyBlock dataQa="ia-empty-block">
      {loadingSettings ? (
        <Spinner />
      ) : (
        <>
          {Messages.alertingDisabled}&nbsp;
          <a className={styles.link} href={PMM_SETTINGS_URL}>
            {Messages.pmmSettings}
          </a>
        </>
      )}
    </EmptyBlock>
  );
};
