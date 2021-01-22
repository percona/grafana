import React, { FC } from 'react';
import { useTable, usePagination, TableState } from 'react-table';
import { css } from 'emotion';
import { Spinner, useStyles } from '@grafana/ui';
import { getStyles } from './Table.styles';
import { TableProps, ExtendedTableInstance } from './Table.types';
import { PAGE_SIZES } from './Table.constants';

export const Table: FC<TableProps> = ({ pendingRequest, data, columns, emptyMessage }) => {
  const style = useStyles(getStyles);
  const initialState: Partial<TableState> = {
    pageIndex: 0,
    pageSize: PAGE_SIZES[0],
  } as Partial<TableState>;
  const tableInstance = useTable({ columns, data, initialState }, usePagination) as ExtendedTableInstance;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageCount,
    setPageSize,
    gotoPage,
    previousPage,
    nextPage,
    state: { pageSize, pageIndex },
  } = tableInstance;
  const leftItemNumber = pageIndex * pageSize + 1;
  const rightItemNumber = pageIndex * pageSize + page.length;

  return (
    <>
      <div className={style.tableWrap} data-qa="table-outer-wrapper">
        <div className={style.table} data-qa="table-inner-wrapper">
          {pendingRequest ? (
            <div data-qa="table-loading" className={style.empty}>
              <Spinner />
            </div>
          ) : null}
          {!pageCount && !pendingRequest ? (
            <div data-qa="table-no-data" className={style.empty}>
              {<h1>{emptyMessage}</h1>}
            </div>
          ) : null}
          {pageCount && !pendingRequest ? (
            <table {...getTableProps()} data-qa="table">
              <thead data-qa="table-thead">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        className={css`
                          cursor: pointer;
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
                {page.map(row => {
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
      <div className={style.pagination} data-qa="pagination">
        <span>
          {'Rows per page:'}
          <select value={pageSize} onChange={e => setPageSize(+e.target.value)}>
            {PAGE_SIZES.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </span>
        <span>
          {`Showing ${leftItemNumber}-${rightItemNumber} of ${data.length}`}
          <span>
            <button onClick={() => gotoPage(0)}>{'<<'}</button>
            <button onClick={() => previousPage()}>{'<'}</button>
            <button onClick={() => nextPage()}>{'>'}</button>
            <button onClick={() => gotoPage(pageCount - 1)}>{'>>'}</button>
          </span>
        </span>
      </div>
    </>
  );
};
