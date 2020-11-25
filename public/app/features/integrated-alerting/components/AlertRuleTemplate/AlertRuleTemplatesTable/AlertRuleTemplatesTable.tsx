import React, { useEffect, useState } from 'react';
import { useSortBy, useTable } from 'react-table';
import { Spinner, useStyles } from '@grafana/ui';
import { getStyles } from './AlertRuleTemplatesTable.styles';
import { css } from 'emotion';
import { logger } from '@percona/platform-core';
import { AlertRuleTemplateService } from '../AlertRuleTemplate.service';

export const AlertRuleTemplatesTable = () => {
  const style = useStyles(getStyles);
  const [pendingRequest, setPendingRequest] = useState(false);

  const getAlertRuleTemplates = async () => {
    setPendingRequest(true);
    try {
      const { templates } = await AlertRuleTemplateService.list();
    } catch (e) {
      logger.error(e);
    }
  };

  const data = React.useMemo(
    () => [
      {
        name: 'MySQL database down',
        source: 'Percona Enterprise Platform',
        created: '2020-10-01 21:17:00',
      },
      {
        name: 'MongoDB database down',
        source: 'Percona Enterprise Platform',
        created: '2020-10-01 21:17:00',
      },
      {
        name: 'High memory consumption',
        source: 'Built-in',
        created: '2020-10-01 21:17:00',
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        width: '70%',
      },
      {
        Header: 'Source',
        accessor: 'source',
        width: '20%',
      },
      {
        Header: 'Created',
        accessor: 'created',
        width: '10%',
      },
    ],
    []
  );

  useEffect(() => {
    getAlertRuleTemplates();
  }, []);

  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className={style.tableWrap}>
      <div className={style.table}>
        {pendingRequest ? (
          <div data-qa="table-loading" className={style.empty}>
            <Spinner />
          </div>
        ) : null}
        {rows.length && !pendingRequest ? (
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      className={css`
                        cursor: pointer;
                        width: ${column.width};
                      `}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};
