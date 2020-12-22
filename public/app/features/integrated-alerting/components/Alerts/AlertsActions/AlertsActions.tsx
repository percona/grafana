import React, { FC } from 'react';
import { IconButton, useStyles } from '@grafana/ui';
import { getStyles } from './AlertsActions.styles';
import { AlertsActionsProps } from './AlertsActions.types';
import { AlertStatus } from '../Alerts.types';
import { AlertsService } from '../Alerts.service';

export const AlertsActions: FC<AlertsActionsProps> = ({ alert }) => {
  const styles = useStyles(getStyles);

  const toggleAlert = () => {
    AlertsService.toggle({
      alert_id: alert.alertId,
      silenced: alert.status === AlertStatus.SILENCED ? 'FALSE' : 'TRUE',
    });
  };

  const silenceIcon = alert.status === AlertStatus.SILENCED ? 'bell-alt' : 'bell-barred';

  return (
    <div className={styles.actionsWrapper}>
      <IconButton data-qa="silence-alert-button" name={silenceIcon} onClick={toggleAlert} />
    </div>
  );
};
