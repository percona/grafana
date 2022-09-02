/* eslint-disable react/display-name */
import { logger } from '@percona/platform-core';
import React, { FC, useMemo, useState, useEffect, useCallback } from 'react';

import { Button, useStyles } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';

import { Messages as IAMessages } from '../../IntegratedAlerting.messages';
import { useStoredTablePageSize } from '../Table/Pagination';
import { Table } from '../Table/Table';

import { AddNotificationChannelModal } from './AddNotificationChannelModal';
import { DeleteNotificationChannelModal } from './DeleteNotificationChannelModal/DeleteNotificationChannelModal';
import { GET_CHANNELS_CANCEL_TOKEN, NOTIFICATION_CHANNEL_TABLE_ID } from './NotificationChannel.constants';
import { Messages } from './NotificationChannel.messages';
import { NotificationChannelProvider } from './NotificationChannel.provider';
import { NotificationChannelService } from './NotificationChannel.service';
import { getStyles } from './NotificationChannel.styles';
import { NotificationChannel as Channel } from './NotificationChannel.types';
import { NotificationChannelActions } from './NotificationChannelActions/NotificationChannelActions';

const { emptyTable, nameColumn, typeColumn, actionsColumn, typeLabel } = Messages;

export const NotificationChannel: FC = () => {
  const styles = useStyles(getStyles);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(true);
  const navModel = usePerconaNavModel('integrated-alerting-notification-channels');
  const [data, setData] = useState<Channel[]>([]);
  const [pageSize, setPageSize] = useStoredTablePageSize(NOTIFICATION_CHANNEL_TABLE_ID);
  const [pageIndex, setPageindex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedNotificationChannel, setSelectedNotificationChannel] = useState<Channel | null>();
  const [generateToken] = useCancelToken();

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
  const getNotificationChannels = useCallback(async () => {
    setPendingRequest(true);
    try {
      const { channels, totals } = await NotificationChannelService.list(
        {
          page_params: {
            index: pageIndex,
            page_size: pageSize,
          },
        },
        generateToken(GET_CHANNELS_CANCEL_TOKEN)
      );
      setData(channels);
      setTotalItems(totals.total_items || 0);
      setTotalPages(totals.total_pages || 0);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPendingRequest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const handlePaginationChanged = useCallback(
    (pageSize: number, pageIndex: number) => {
      setPageSize(pageSize);
      setPageindex(pageIndex);
    },
    [setPageSize, setPageindex]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('alertingEnabled'), []);

  useEffect(() => {
    getNotificationChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <TechnicalPreview />
        <FeatureLoader featureName={IAMessages.integratedAlerting} featureSelector={featureSelector}>
          <NotificationChannelProvider.Provider
            value={{
              getNotificationChannels,
              setSelectedNotificationChannel,
              setAddModalVisible,
              setDeleteModalVisible,
            }}
          >
            <div className={styles.actionsWrapper}>
              <Button
                size="md"
                icon="plus-square"
                fill="text"
                onClick={() => {
                  setSelectedNotificationChannel(null);
                  setAddModalVisible(!addModalVisible);
                }}
                data-testid="notification-channel-add-modal-button"
              >
                {Messages.addAction}
              </Button>
            </div>
            <Table
              showPagination
              totalItems={totalItems}
              totalPages={totalPages}
              pageSize={pageSize}
              pageIndex={pageIndex}
              onPaginationChanged={handlePaginationChanged}
              data={data}
              columns={columns}
              pendingRequest={pendingRequest}
              emptyMessage={emptyTable}
            />
            <AddNotificationChannelModal
              isVisible={addModalVisible}
              setVisible={setAddModalVisible}
              notificationChannel={selectedNotificationChannel}
            />
            <DeleteNotificationChannelModal
              isVisible={deleteModalVisible}
              setVisible={setDeleteModalVisible}
              notificationChannel={selectedNotificationChannel!}
            />
          </NotificationChannelProvider.Provider>
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

NotificationChannel.displayName = 'NotificationChannel';

export default NotificationChannel;
