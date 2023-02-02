/* eslint-disable react/display-name */
import { logger } from '@percona/platform-core';
import { CancelToken } from 'axios';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, Row } from 'react-table';

import { OldPage } from 'app/core/components/Page/Page';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { FeatureLoader } from 'app/percona/shared/components/Elements/FeatureLoader';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { Databases, DATABASE_LABELS } from 'app/percona/shared/core';
import { fetchStorageLocations } from 'app/percona/shared/core/reducers/backups/backupLocations';
import { getBackupLocations, getPerconaSettingFlag } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from '../../Backup.messages';
import { formatLocationsToMap } from '../../Backup.utils';
import { useRecurringCall } from '../../hooks/recurringCall.hook';
import { DetailedDate } from '../DetailedDate';
import { Status } from '../Status';

import { DATA_INTERVAL, LIST_RESTORES_CANCEL_TOKEN } from './RestoreHistory.constants';
import { RestoreHistoryService } from './RestoreHistory.service';
import { Restore } from './RestoreHistory.types';
import { RestoreHistoryActions } from './RestoreHistoryActions';
import { RestoreHistoryDetails } from './RestoreHistoryDetails';
import { RestoreLogsModal } from './RestoreLogsModal/RestoreLogsModal';

export const RestoreHistory: FC = () => {
  const [pending, setPending] = useState(true);
  const [logsModalVisible, setLogsModalVisible] = useState(false);
  const [data, setData] = useState<Restore[]>([]);
  const [selectedRestore, setSelectedRestore] = useState<Restore | null>(null);
  const navModel = usePerconaNavModel('restore-history');
  const [generateToken] = useCancelToken();
  const [triggerTimeout] = useRecurringCall();
  const dispatch = useAppDispatch();
  const { result: locations = [] } = useSelector(getBackupLocations);

  const locationsByLocationId = useMemo(() => formatLocationsToMap(locations), [locations]);

  const columns = useMemo(
    (): Array<Column<Restore>> => [
      {
        Header: Messages.backupInventory.table.columns.status,
        accessor: 'status',
        Cell: ({ value, row }) => (
          <Status
            showLogsAction={row.original.vendor === Databases.mongodb}
            status={value}
            onLogClick={() => onLogClick(row.original)}
          />
        ),
        width: '100px',
      },
      {
        Header: Messages.backupInventory.table.columns.name,
        accessor: 'name',
        id: 'name',
      },
      {
        Header: Messages.backupInventory.table.columns.vendor,
        accessor: ({ vendor }: Restore) => DATABASE_LABELS[vendor],
        width: '150px',
      },
      {
        Header: Messages.restoreHistory.table.columns.started,
        accessor: 'started',
        Cell: ({ value }) => <DetailedDate dataTestId="restore-started" date={value} />,
        width: '200px',
      },
      {
        Header: Messages.restoreHistory.table.columns.finished,
        accessor: 'finished',
        Cell: ({ value }) => (value ? <DetailedDate dataTestId="restore-finished" date={value} /> : null),
        width: '200px',
      },
      {
        Header: Messages.restoreHistory.table.columns.targetService,
        accessor: 'serviceName',
      },
      {
        Header: Messages.backupInventory.table.columns.location,
        accessor: 'locationName',
        Cell: ({ row, value }) => (
          <span>
            {value} ({locationsByLocationId[row.original.locationId]?.type})
          </span>
        ),
      },
      {
        Header: Messages.restoreHistory.table.columns.actions,
        accessor: 'id',
        width: '100px',
        Cell: ({ row }) => <RestoreHistoryActions row={row} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locationsByLocationId]
  );

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Restore>) => (
      <RestoreHistoryDetails
        name={row.original.name}
        pitrTimestamp={row.original.pitrTimestamp}
        dataModel={row.original.dataModel}
      />
    ),
    []
  );

  const handleLogsClose = () => {
    setSelectedRestore(null);
    setLogsModalVisible(false);
  };

  const onLogClick = (restore: Restore) => {
    setSelectedRestore(restore);
    setLogsModalVisible(true);
  };

  const getLogs = useCallback(
    async (startingChunk: number, offset: number, token?: CancelToken) =>
      RestoreHistoryService.getLogs(selectedRestore!.id, startingChunk, offset, token),
    [selectedRestore]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const featureSelector = useCallback(getPerconaSettingFlag('backupEnabled'), []);

  useEffect(() => {
    const getData = async (showLoading = false) => {
      showLoading && setPending(true);
      await dispatch(fetchStorageLocations());

      try {
        const restores = await RestoreHistoryService.list(generateToken(LIST_RESTORES_CANCEL_TOKEN));
        setData(restores);
      } catch (e) {
        if (isApiCancelError(e)) {
          return;
        }
        logger.error(e);
      }
      setPending(false);
    };

    getData(true).then(() => triggerTimeout(getData, DATA_INTERVAL));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <FeatureLoader featureName={Messages.backupManagement} featureSelector={featureSelector}>
          <Table
            columns={columns}
            data={data}
            totalItems={data.length}
            emptyMessage={Messages.restoreHistory.table.noData}
            pendingRequest={pending}
            autoResetExpanded={false}
            renderExpandedRow={renderSelectedSubRow}
            getRowId={useCallback((row: Restore) => row.id, [])}
          />
          {logsModalVisible && (
            <RestoreLogsModal
              title={Messages.backupInventory.getLogsTitle(selectedRestore?.name || '')}
              isVisible
              onClose={handleLogsClose}
              getLogChunks={getLogs}
            />
          )}
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default RestoreHistory;
