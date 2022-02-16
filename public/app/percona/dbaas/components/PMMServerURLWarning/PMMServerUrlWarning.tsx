import React, { FC } from 'react';
import { Icon, useStyles } from '@grafana/ui';
import { getStyles } from './PMMServerUrlWarning.styles';
import { buildWarningMessage } from './PMMServerURLWarning.utils';

export const PMMServerUrlWarning: FC = () => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.warningWrapper} data-testid="add-cluster-monitoring-warning">
      <Icon name="exclamation-triangle" className={styles.warningIcon} />
      <span className={styles.warningMessage}>{buildWarningMessage(styles.settingsLink)}</span>
    </div>
  );
};
