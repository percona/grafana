import React, { FC, useState } from 'react';
import { IconButton, Spinner, useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/core';
import { getStyles } from './AlertsActions.styles';
import { AlertsActionsProps } from './AlertsActions.types';
import { AlertStatus } from '../Alerts.types';
import { AlertsService } from '../Alerts.service';
import { Messages } from './AlertsActions.messages';

export const AlertsActions: FC<AlertsActionsProps> = ({ alert, getAlerts }) => {
  const styles = useStyles(getStyles);
  const [pendingRequest, setPendingRequest] = useState(false);

  const isSilenced = alert.status === AlertStatus.SILENCED;

  const toggleAlert = async () => {
    setPendingRequest(true);
    try {
      await AlertsService.toggle({
        alert_id: alert.alertId,
        silenced: isSilenced ? 'FALSE' : 'TRUE',
      });
      appEvents.emit(AppEvents.alertSuccess, [isSilenced ? Messages.activateSuccess : Messages.silenceSuccess]);
      getAlerts();
    } catch (e) {
      logger.error(e);
    } finally {
      setPendingRequest(false);
    }
  };

  const silenceIcon = isSilenced ? 'bell-alt' : 'bell-barred';

  return (
    <div className={styles.actionsWrapper}>
      {pendingRequest ? (
        <Spinner />
      ) : (
        <IconButton data-qa="silence-alert-button" name={silenceIcon} onClick={toggleAlert} />
      )}
    </div>
  );
};
