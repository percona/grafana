import React, { FC, useMemo, useState, useEffect } from 'react';
import { logger } from '@percona/platform-core';
import { NotificationChannelService } from './NotificationChannel.service';
import { Table } from '../Table/Table';
import { NotificationChannel as Channel } from './NotificationChannel.types';
import { Messages } from './NotificationChannel.messages';
import { NotificationChannelProvider } from './NotificationChannel.provider';

const { emptyTable, nameColumn, typeColumn, typeLabel } = Messages;

export const NotificationChannel: FC = () => {
  const [pendingRequest, setPendingRequest] = useState(false);
  const [data, setData] = useState<Channel[]>([]);

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
    ],
    []
  );

  const getNotificationChannels = async () => {
    setPendingRequest(true);
    try {
      setData(await NotificationChannelService.list());
    } catch (e) {
      logger.error(e);
    } finally {
      setPendingRequest(false);
    }
  };

  useEffect(() => {
    getNotificationChannels();
  }, []);

  return (
    <NotificationChannelProvider.Provider value={{ getNotificationChannels }}>
      <Table data={data} columns={columns} pendingRequest={pendingRequest} emptyMessage={emptyTable} />
    </NotificationChannelProvider.Provider>
  );
};
