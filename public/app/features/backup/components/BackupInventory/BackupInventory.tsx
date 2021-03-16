import React, { FC, useMemo, useState, useEffect } from 'react';
import { Column } from 'react-table';
import { logger } from '@percona/platform-core';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { BackupCreation } from './BackupCreation';
import { Messages } from './BackupInventory.messages';
import { Backup } from './BackupInventory.types';
import { BackupInventoryService } from './BackupInventory.service';

const { columns, noData } = Messages;
const { name, created, location } = columns;

export const BackupInventory: FC = () => {
  const [pending, setPending] = useState(false);
  const [data, setData] = useState<Backup[]>([]);
  const columns = useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        width: '250px',
      },
      {
        Header: created,
        accessor: 'created',
        Cell: ({ value }) => <BackupCreation date={value} />,
      },
      {
        Header: location,
        accessor: 'location',
      },
    ],
    []
  );

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <Table
      data={data}
      totalItems={data.length}
      columns={columns}
      emptyMessage={noData}
      pendingRequest={pending}
    ></Table>
  );
};
