import React, { FC, useState, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { Button, IconButton, useStyles } from '@grafana/ui';
import { config } from '@grafana/runtime';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/app_events';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { StorageLocationsActions } from './StorageLocationsActions';
import { Messages } from './StorageLocations.messages';
import { StorageLocation } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';
import { formatLocationList, formatToRawLocation } from './StorageLocations.utils';
import { getStyles } from './StorageLocations.styles';
import { StorageLocationDetails } from './StorageLocationDetails';
import { AddStorageLocationModal } from './AddStorageLocationModal';
import { RemoveStorageLocationModal } from './RemoveStorageLocationModal';

const { noData, columns } = Messages;
const { name, type, path, actions } = columns;

export const StorageLocations: FC = () => {
  const [pending, setPending] = useState(true);
  const [validatingLocation, setValidatingLocation] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [data, setData] = useState<StorageLocation[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const styles = useStyles(getStyles);
  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'name',
        width: '315px',
        Cell: ({ row, value }) => {
          const restProps = row.getToggleRowExpandedProps ? row.getToggleRowExpandedProps() : {};
          return (
            <div className={styles.nameWrapper} {...restProps}>
              <span>{value}</span>
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
        width: '150px',
      },
      {
        Header: path,
        accessor: 'path',
      },
      {
        Header: actions,
        accessor: 'locationID',
        Cell: ({ row }) => (
          <StorageLocationsActions
            onUpdate={handleUpdate}
            onDelete={onDeleteCLick}
            location={row.original as StorageLocation}
          />
        ),
        width: '130px',
      },
    ],
    []
  );
  const isAdmin = config.bootData.user.isGrafanaAdmin;

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

  const onAdd = async (location: StorageLocation) => {
    try {
      if (location.locationID) {
        await StorageLocationsService.update(formatToRawLocation(location));
        appEvents.emit(AppEvents.alertSuccess, [Messages.editSuccess(location.name)]);
      } else {
        await StorageLocationsService.add(formatToRawLocation(location));
        appEvents.emit(AppEvents.alertSuccess, [Messages.addSuccess]);
      }
      getData();
    } catch (e) {
      logger.error(e);
    } finally {
      setAddModalVisible(false);
      setSelectedLocation(null);
    }
  };

  const handleUpdate = (location: StorageLocation) => {
    setSelectedLocation(location);
    setAddModalVisible(true);
  };

  const handleTest = async (location: StorageLocation) => {
    setValidatingLocation(true);
    try {
      const rawLocation = formatToRawLocation(location, true);
      await StorageLocationsService.testLocation(rawLocation);
      appEvents.emit(AppEvents.alertSuccess, [Messages.testSuccess]);
    } catch (e) {
      logger.error(e);
    } finally {
      setValidatingLocation(false);
    }
  };

  const onDeleteCLick = (location: StorageLocation) => {
    setSelectedLocation(location);
    setDeleteModalVisible(true);
  };

  const handleDelete = async (location: StorageLocation) => {
    setDeletePending(true);
    try {
      await StorageLocationsService.delete(location.locationID);
      setDeleteModalVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [Messages.getDeleteSuccess(location.name)]);
      getData();
    } catch (e) {
      logger.error(e);
    } finally {
      setSelectedLocation(null);
      setDeletePending(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className={styles.addWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          data-qa="storage-location-add-modal-button"
          onClick={() => {
            setSelectedLocation(null);
            setAddModalVisible(true);
          }}
        >
          {Messages.add}
        </Button>
      </div>
      <Table
        data={data}
        totalItems={data.length}
        columns={columns}
        emptyMessage={noData}
        pendingRequest={pending}
        renderExpandedRow={renderSelectedSubRow}
      ></Table>
      <AddStorageLocationModal
        location={selectedLocation}
        isVisible={addModalVisible}
        showLocationValidation={isAdmin}
        waitingLocationValidation={validatingLocation}
        onClose={() => setAddModalVisible(false)}
        onAdd={onAdd}
        onTest={handleTest}
      ></AddStorageLocationModal>
      <RemoveStorageLocationModal
        location={selectedLocation}
        isVisible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        loading={deletePending}
        onDelete={handleDelete}
      />
    </>
  );
};
