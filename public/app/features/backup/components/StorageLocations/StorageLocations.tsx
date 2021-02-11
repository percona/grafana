import React, { FC, useState, useEffect } from 'react';
import { Column } from 'react-table';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { Messages } from './StorageLocations.messages';
import { Location } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';

const { noData, columns } = Messages;
const { name, type, endpoint, labels } = columns;

export const StorageLocations: FC = () => {
  const [data] = useState<Location[]>([]);
  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
      },
      {
        Header: type,
        accessor: 'type',
      },
      {
        Header: endpoint,
        accessor: 'endpoint',
      },
      {
        Header: labels,
        accessor: 'labels',
      },
    ],
    []
  );

  useEffect(() => {
    StorageLocationsService.list();
  }, []);

  return <Table data={data} columns={columns} emptyMessage={noData}></Table>;
};
