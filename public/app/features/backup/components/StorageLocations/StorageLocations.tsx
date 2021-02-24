import React, { FC, useState, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { Button, IconButton, useStyles } from '@grafana/ui';
import { config } from '@grafana/runtime';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/core';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { Messages } from './StorageLocations.messages';
import { StorageLocation } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';
import { formatLocationList, formatToRawLocation } from './StorageLocations.utils';
import { getStyles } from './StorageLocations.styles';
import { StorageLocationDetails } from './StorageLocationDetails';
import { AddStorageLocationModal } from './AddStorageLocationModal';
import { StorageLocationsActions } from './StorageLocationsActions';

const { noData, columns } = Messages;
const { name, type, path, actions } = columns;

export const StorageLocations: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<StorageLocation[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>();
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
          <StorageLocationsActions onUpdate={handleUpdate} location={row.original as StorageLocation} />
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
      } else {
        await StorageLocationsService.add(formatToRawLocation(location));
      }
      appEvents.emit(AppEvents.alertSuccess, [Messages.addSuccess]);
      getData();
    } catch (e) {
      logger.error(e);
    } finally {
      setAddModalVisible(false);
      setSelectedLocation(undefined);
    }
  };

  const handleClose = () => {
    setAddModalVisible(false);
  };

  const handleUpdate = (location: StorageLocation) => {
    setSelectedLocation(location);
    setAddModalVisible(true);
  };

  const isLocationValid = (location: StorageLocation) => {
    const rawLocation = formatToRawLocation(location);
    return StorageLocationsService.testLocation(rawLocation);
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
        needsLocationValidation={isAdmin}
        onClose={handleClose}
        onAdd={onAdd}
        isLocationValid={isLocationValid}
      />
    </>
  );
};
