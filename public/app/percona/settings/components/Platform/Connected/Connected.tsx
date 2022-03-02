import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useStyles } from '@grafana/ui';
import { AppEvents } from '@grafana/data';
import { LoaderButton, logger } from '@percona/platform-core';
import { appEvents } from 'app/core/app_events';
import { setSettings } from 'app/percona/shared/core/reducers';
import { PlatformService } from '../Platform.service';
import { Messages } from './Connected.messages';
import { getStyles } from './Connected.styles';

export const Connected: FC = () => {
  const styles = useStyles(getStyles);
  const dispatch = useDispatch();
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await PlatformService.disconnect();
      appEvents.emit(AppEvents.alertSuccess, [Messages.disconnectSucceeded]);
      dispatch(setSettings({ isConnectedToPortal: false }));
    } catch (e) {
      logger.error(e);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <section data-testid="connected-wrapper" className={styles.wrapper}>
      <header className={styles.title}>{Messages.title}</header>
      <p>{Messages.connected}</p>
      <LoaderButton
        data-testid="disconnect-button"
        size="md"
        variant="primary"
        disabled={disconnecting}
        loading={disconnecting}
        onClick={handleDisconnect}
      >
        {Messages.disconnect}
      </LoaderButton>
    </section>
  );
};
