import React, { FC, useContext } from 'react';
import { IconButton, useStyles } from '@grafana/ui';
import { getStyles } from './NotificationChannelActions.styles';
import { NotificationChannelActionsProps } from './NotificationChannelActions.types';
import { NotificationChannelProvider } from '../NotificationChannel.provider';

export const NotificationChannelActions: FC<NotificationChannelActionsProps> = ({ notificationChannel }) => {
  const styles = useStyles(getStyles);
  const { setSelectedNotificationChannel, setAddModalVisible } = useContext(NotificationChannelProvider);
  console.log('HEY', setSelectedNotificationChannel);
  return (
    <div className={styles.actionsWrapper}>
      <IconButton
        data-qa="edit-notification-channel-button"
        name="pen"
        onClick={() => {
          setSelectedNotificationChannel(notificationChannel);
          setAddModalVisible(true);
        }}
      />
    </div>
  );
};
