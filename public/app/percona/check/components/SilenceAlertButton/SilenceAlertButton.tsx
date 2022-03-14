import React, { FC, useState } from 'react';
import { logger, LoaderButton } from '@percona/platform-core';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { Labels } from 'app/percona/check/types';
import { AlertsReloadContext } from 'app/percona/check/Check.context';
import { CheckService } from 'app/percona/check/Check.service';

interface SilenceAlertButtonProps {
  labels: Labels;
}

export const SilenceAlertButton: FC<SilenceAlertButtonProps> = ({ labels }) => {
  const alertsReloadContext = React.useContext(AlertsReloadContext);
  const [isRequestPending, setRequestPending] = useState(false);

  const handleClick = async () => {
    setRequestPending(true);
    try {
      await CheckService.silenceAlert('', false);
      await alertsReloadContext.fetchAlerts();
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setRequestPending(false);
  };

  return (
    <LoaderButton type="button" size="sm" variant="secondary" loading={isRequestPending} onClick={handleClick}>
      Silence
    </LoaderButton>
  );
};
