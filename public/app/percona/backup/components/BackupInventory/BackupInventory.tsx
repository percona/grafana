import React, { FC, useMemo, useState, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { Table } from 'app/percona/integrated-alerting/components/Table';
import { ExpandableCell } from 'app/percona/shared/components/Elements/ExpandableCell/ExpandableCell';
import { BackupInventoryDetails } from './BackupInventoryDetails/BackupInventoryDetails';
import { Status } from './Status';
import { BackupCreation } from './BackupCreation';
import { Messages } from './BackupInventory.messages';
import { Backup } from './BackupInventory.types';
import { BackupInventoryService } from './BackupInventory.service';
import { BackupInventoryActions } from './BackupInventoryActions';
import { RestoreBackupModal } from './RestoreBackupModal';

const { columns, noData } = Messages;
const { name, created, location, vendor, status, actions } = columns;

export const BackupInventory: FC = () => {
  const [pending, setPending] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [data, setData] = useState<Backup[]>([]);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'name',
        width: '250px',
        Cell: ({ row, value }) => <ExpandableCell row={row} value={value} />,
      },
      {
        Header: vendor,
        accessor: 'vendor',
        width: '150px',
      },
      {
        Header: created,
        accessor: 'created',
        Cell: ({ value }) => <BackupCreation date={value} />,
      },
      {
        Header: location,
        accessor: 'locationName',
      },
      {
        Header: status,
        accessor: 'status',
        Cell: ({ value }) => <Status status={value} />,
      },
      {
        Header: actions,
        accessor: 'id',
        Cell: ({ row }) => <BackupInventoryActions onRestore={onRestoreClick} backup={row.original as Backup} />,
        width: '80px',
      },
    ],
    []
  );

  const onRestoreClick = (backup: Backup) => {
    setSelectedBackup(backup);
    setRestoreModalVisible(true);
  };

  const handleClose = () => {
    setSelectedBackup(null);
    setRestoreModalVisible(false);
  };

  const handleRestore = async (serviceId: string, locationId: string, artifactId: string) => {
    try {
      await BackupInventoryService.restore(serviceId, locationId, artifactId);
      setRestoreModalVisible(false);
    } catch (e) {
      logger.error(e);
    }
  };

  const getData = async () => {
    setPending(true);

    try {
      const backups = await BackupInventoryService.list();
      setData(backups);
    } catch (e) {
      logger.error(e);
    } finally {
      setPending(false);
    }
  };

  const renderSelectedSubRow = React.useCallback(
    (row: Row<Backup>) => (
      <BackupInventoryDetails
        name={row.original.name}
        status={row.original.status}
        dataModel={row.original.dataModel}
      />
    ),
    []
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Table
        data={data}
        totalItems={data.length}
        columns={columns}
        emptyMessage={noData}
        pendingRequest={pending}
        renderExpandedRow={renderSelectedSubRow}
      ></Table>
      <RestoreBackupModal
        backup={selectedBackup}
        isVisible={restoreModalVisible}
        onClose={handleClose}
        onRestore={handleRestore}
      />
    </>
  );
};
