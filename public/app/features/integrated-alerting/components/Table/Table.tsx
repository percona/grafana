import React, { FC } from 'react';
import { Row, useExpanded, useTable } from 'react-table';
import { css } from 'emotion';
import { Spinner, useStyles } from '@grafana/ui';
import { getStyles } from './Table.styles';
import { TableProps } from './Table.types';
import { EmptyBlock } from '../EmptyBlock';

export const Table: FC<TableProps> = ({ pendingRequest, data, columns, emptyMessage, children, renderExpandedRow }) => {
  const style = useStyles(getStyles);
  const tableInstance = useTable({ columns, data }, useExpanded);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = tableInstance;

  return (
    <div className={style.tableWrap} data-qa="table-outer-wrapper">
      <div className={style.table} data-qa="table-inner-wrapper">
        {pendingRequest ? (
          <EmptyBlock dataQa="table-loading">
            <Spinner />
          </EmptyBlock>
        ) : null}
        {!rows.length && !pendingRequest ? (
          <EmptyBlock dataQa="table-no-data">{<h1>{emptyMessage}</h1>}</EmptyBlock>
        ) : null}
        {rows.length && !pendingRequest ? (
          <table {...getTableProps()} data-qa="table">
            <thead data-qa="table-thead">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      className={css`
                        width: ${column.width};
                      `}
                      {...column.getHeaderProps()}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} data-qa="table-tbody">
              {children
                ? children(rows, tableInstance)
                : rows.map(row => {
                    prepareRow(row);
                    return (
                      <React.Fragment key={row.id}>
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => {
                            return (
                              <td key={cell.column.id} {...cell.getCellProps()}>
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
                        </tr>
                        {row.isExpanded ? (
                          <tr>
                            <td colSpan={visibleColumns.length}>{renderExpandedRow(row)}</td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};

Table.defaultProps = {
  renderExpandedRow: (row: Row) => <span></span>,
};
