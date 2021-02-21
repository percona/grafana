import React, { FC, useState, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { IconButton, useStyles } from '@grafana/ui';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/core';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { DeleteModal } from 'app/features/integrated-alerting/components/DeleteModal';
import { StorageLocationsActions } from './StorageLocationsActions';
import { Messages } from './StorageLocations.messages';
import { StorageLocation } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';
import { formatLocationList } from './StorageLocations.utils';
import { getStyles } from './StorageLocations.styles';
import { StorageLocationDetails } from './StorageLocationDetails';

const { noData, columns } = Messages;
const { name, type, path, actions } = columns;

export const StorageLocations: FC = () => {
  const [pending, setPending] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | undefined>(undefined);
  const [data, setData] = useState<StorageLocation[]>([]);
  const styles = useStyles(getStyles);
  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'name',
        Cell: ({ row, value }) => {
          const restProps = row.getToggleRowExpandedProps ? row.getToggleRowExpandedProps() : {};
          return (
            <div className={styles.nameWrapper} {...restProps}>
              {value}
              {row.isExpanded ? (
                <IconButton data-qa="hide-storage-location-details" name="arrow-up" />
              ) : (
                <IconButton data-qa="show-storage-location-details" name="arrow-down" />
              )}
            </div>
          );
        },
      },
      {
        Header: type,
        accessor: 'type',
      },
      {
        Header: path,
        accessor: 'path',
      },
      {
        Header: actions,
        accessor: 'locationID',
        Cell: ({ row }) => (
          <StorageLocationsActions onDelete={onDeleteCLick} location={row.original as StorageLocation} />
        ),
        width: '130px',
      },
    ],
    []
  );

  const getData = async () => {
    setPending(true);
    try {
      const rawData = await StorageLocationsService.list();
      setData(formatLocationList(rawData));
    } catch (e) {
      logger.error(e);
    } finally {
      setPending(false);
    }
  };

  const renderSelectedSubRow = React.useCallback(
    (row: Row) => <StorageLocationDetails location={row.original as StorageLocation} />,
    []
  );

  const onDeleteCLick = (location: StorageLocation) => {
    setSelectedLocation(location);
    setDeleteModalVisible(true);
  };

  const onDelete = async () => {
    setDeletePending(true);
    try {
      await StorageLocationsService.delete(selectedLocation?.description || '');
      setDeleteModalVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [Messages.getDeleteSuccess(selectedLocation?.name || '')]);
    } catch (e) {
      logger.error(e);
    } finally {
      setSelectedLocation(undefined);
      setDeletePending(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Table
        data={data}
        columns={columns}
        emptyMessage={noData}
        pendingRequest={pending}
        renderExpandedRow={renderSelectedSubRow}
      ></Table>
      <DeleteModal
        message={Messages.getDeleteMessage(selectedLocation?.name || '')}
        onDelete={onDelete}
        loading={deletePending}
        isVisible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
      />
    </>
  );
};
