import React, { FC, useState } from 'react';
import { Spinner, useStyles } from '@grafana/ui';
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
  // const silenceIcon = isSilenced ? 'bell-alt' : 'bell-barred';
  // const title = isSilenced ? Messages.activateTitle : Messages.silenceTitle;

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

  return (
    <div className={styles.actionsWrapper}>
      {pendingRequest ? (
        <Spinner />
      ) : (
        <svg
          onClick={toggleAlert}
          width="20"
          height="17"
          viewBox="0 0 20 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.7 5.5V2.35C12.7 1.6048 12.0952 1 11.35 1L8.65 1C7.9048 1 7.3 1.6048 7.3 2.35V5.5L0.999999 11.8L19 11.8L12.7 5.5Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.1499 14.5C12.4137 15.5125 11.3481 16.3 9.9999 16.3C8.6517 16.3 7.5861 15.5134 6.8499 14.5"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        // <IconButton data-qa="silence-alert-button" name={silenceIcon} title={title} onClick={toggleAlert} />
      )}
    </div>
  );
};
