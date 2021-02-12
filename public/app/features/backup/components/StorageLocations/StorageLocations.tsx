import React, { FC, useState, useEffect } from 'react';
import { Column, Row } from 'react-table';
import { logger } from '@percona/platform-core';
import { IconButton, useStyles } from '@grafana/ui';
import { Table } from 'app/features/integrated-alerting/components/Table/Table';
import { DescriptionBlock } from '../DescriptionBlock';
import { Messages } from './StorageLocations.messages';
import { StorageLocation } from './StorageLocations.types';
import { StorageLocationsService } from './StorageLocations.service';
import { formatLocationList } from './StorageLocations.utils';
import { getStyles } from './StorageLocations.styles';
import { KeysBlock } from '../KeysBlock/KeysBlock';

const { noData, columns } = Messages;
const { name, type, path } = columns;

export const StorageLocations: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<StorageLocation[]>([]);
  const styles = useStyles(getStyles);
  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: name,
        accessor: 'name',
        id: 'name',
        Cell: ({ row, value }) => (
          <div className={styles.nameWrapper} {...row.getToggleRowExpandedProps()}>
            {value}
            {row.isExpanded ? (
              <IconButton data-qa="hide-storage-location-details" name="arrow-up" />
            ) : (
              <IconButton data-qa="show-storage-location-details" name="arrow-down" />
            )}
          </div>
        ),
      },
      {
        Header: type,
        accessor: 'type',
      },
      {
        Header: path,
        accessor: 'path',
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
    (row: Row) => (
      <div>
        <DescriptionBlock description={(row.original as any).description} />
        <KeysBlock accessKey={(row.original as any).accessKey} secretKey={(row.original as any).secretKey} />
      </div>
    ),
    []
  );

  useEffect(() => {
    getData();
  }, []);

  return (
    <Table
      data={data}
      columns={columns}
      emptyMessage={noData}
      pendingRequest={pending}
      renderExpandedRow={renderSelectedSubRow}
    ></Table>
  );
};
