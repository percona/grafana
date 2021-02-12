import React, { FC } from 'react';
import { useTable, usePagination, TableState } from 'react-table';
import { css } from 'emotion';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Table.styles';
import { TableProps, PaginatedTableInstance, PaginatedTableOptions } from './Table.types';
import { Pagination } from './Pagination';
import { PAGE_SIZES } from './Pagination/Pagination.constants';
import { TableContent } from './TableContent';

export const Table: FC<TableProps> = ({
  pendingRequest,
  data,
  columns,
  showPagination,
  totalPages,
  onPaginationChanged,
  emptyMessage,
  totalItems,
  pageSize: propPageSize,
  pageIndex: propPageIndex,
}) => {
  const style = useStyles(getStyles);
  const manualPagination = totalPages >= 0;
  const initialState: Partial<TableState> = {
    pageIndex: propPageIndex,
    pageSize: propPageSize,
  } as Partial<TableState>;
  const tableOptions: PaginatedTableOptions = {
    columns,
    data,
    initialState,
    manualPagination,
  };

  if (manualPagination) {
    tableOptions.pageCount = totalPages;
  }

  const tableInstance = useTable(tableOptions, usePagination) as PaginatedTableInstance;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageCount,
    setPageSize,
    gotoPage,
    state: { pageSize, pageIndex },
  } = tableInstance;
  const hasData = !!(pageCount && !pendingRequest);

  const onPageChanged = (newPageIndex: number) => {
    gotoPage(newPageIndex);
    onPaginationChanged(pageSize, newPageIndex);
  };

  const onPageSizeChanged = (newPageSize: number) => {
    gotoPage(0);
    setPageSize(newPageSize);
    onPaginationChanged(newPageSize, 0);
  };

  return (
    <>
      <div className={style.tableWrap} data-qa="table-outer-wrapper">
        <div className={style.table} data-qa="table-inner-wrapper">
          <TableContent hasData={hasData} emptyMessage={emptyMessage} pending={pendingRequest}>
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
          </TableContent>
        </div>
      </div>
      {showPagination && hasData && (
        <Pagination
          pageCount={pageCount}
          initialPageIndex={pageIndex}
          totalItems={totalItems}
          pageSizeOptions={PAGE_SIZES}
          pageSize={pageSize}
          nrRowsOnCurrentPage={page.length}
          onPageChange={pageIndex => onPageChanged(pageIndex)}
          onPageSizeChange={pageSize => onPageSizeChanged(pageSize)}
        />
      )}
    </>
  );
};
