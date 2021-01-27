import React, { FC, useCallback, useMemo, useState } from 'react';
import { Button, useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { NotificationChannelService } from './NotificationChannel.service';
import { Table } from '../Table/Table';
import { NotificationChannel as Channel } from './NotificationChannel.types';
import { Messages } from './NotificationChannel.messages';
import { NOTIFICATION_CHANNEL_TABLE_HASH } from './NotificationChannel.constants';
import { NotificationChannelProvider } from './NotificationChannel.provider';
import { getStyles } from './NotificationChannel.styles';
import { AddNotificationChannelModal } from './AddNotificationChannelModal';
import { NotificationChannelActions } from './NotificationChannelActions/NotificationChannelActions';
import { DeleteNotificationChannelModal } from './DeleteNotificationChannelModal/DeleteNotificationChannelModal';
import { useStoredTablePageSize } from 'app/core/hooks/useStoredTablePageSize';

const { emptyTable, nameColumn, typeColumn, actionsColumn, typeLabel } = Messages;

export const NotificationChannel: FC = () => {
  const styles = useStyles(getStyles);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [data, setData] = useState<Channel[]>([]);
  const [selectedNotificationChannel, setSelectedNotificationChannel] = useState<Channel>();
  const [pageSize, setPageSize] = useStoredTablePageSize(NOTIFICATION_CHANNEL_TABLE_HASH);

  const columns = useMemo(
    () => [
      {
        Header: nameColumn,
        accessor: 'summary',
      },
      {
        Header: typeColumn,
        accessor: ({ type }: Channel) => typeLabel[type],
      },
      {
        Header: actionsColumn,
        width: '80px',
        accessor: (notificationChannel: Channel) => (
          <NotificationChannelActions notificationChannel={notificationChannel} />
        ),
      },
    ],
    []
  );

  // TODO set totalPages, totalItems as pass them to the table
  const getNotificationChannels = async (pageSize: number, pageIndex: number) => {
    setPendingRequest(true);
    try {
      setData(await NotificationChannelService.list());
    } catch (e) {
      logger.error(e);
    } finally {
      setPendingRequest(false);
    }
  };

  // TODO Refetch data with new params when API's ready
  const onPageChange = useCallback((pageSize: number, pageIndex: number) => {
    setPageSize(pageSize);
    getNotificationChannels(pageSize, pageIndex);
  }, []);

  return (
    <NotificationChannelProvider.Provider
      value={{ getNotificationChannels, setSelectedNotificationChannel, setAddModalVisible, setDeleteModalVisible }}
    >
      <div className={styles.actionsWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          onClick={() => {
            setSelectedNotificationChannel(null);
            setAddModalVisible(!addModalVisible);
          }}
          data-qa="notification-channel-add-modal-button"
        >
          {Messages.addAction}
        </Button>
      </div>
      <Table
        data={data}
        columns={columns}
        pendingRequest={pendingRequest}
        emptyMessage={emptyTable}
        totalItems={data.length}
        onPageChange={onPageChange}
        pageSize={pageSize}
      />
      <AddNotificationChannelModal
        isVisible={addModalVisible}
        setVisible={setAddModalVisible}
        notificationChannel={selectedNotificationChannel}
      />
      <DeleteNotificationChannelModal
        isVisible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        notificationChannel={selectedNotificationChannel}
      />
    </NotificationChannelProvider.Provider>
  );
};
