/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import { css } from '@emotion/css';
import React, { FC, useEffect } from 'react';
import {
  useTable,
  usePagination,
  useExpanded,
  useRowSelect,
  PluginHook,
  ColumnInstance,
  UseRowSelectRowProps,
  UseRowSelectInstanceProps,
  Row,
} from 'react-table';

import { useStyles2 } from '@grafana/ui';

import { Overlay } from '../Overlay';

import { Pagination } from './Pagination';
import { PAGE_SIZES } from './Pagination/Pagination.constants';
import { TableCheckbox } from './Selection';
import { getStyles } from './Table.styles';
import { TableProps, PaginatedTableInstance, PaginatedTableOptions, PaginatedTableState } from './Table.types';
import { TableContent } from './TableContent';

const defaultPropGetter = () => ({});

export const Table: FC<TableProps> = ({
  pendingRequest = false,
  data,
  columns,
  showPagination,
  rowSelection,
  totalPages,
  onPaginationChanged = () => null,
  emptyMessage = '',
  emptyMessageClassName,
  overlayClassName,
  totalItems,
  pageSize: propPageSize,
  pageIndex: propPageIndex = 0,
  pagesPerView,
  children,
  autoResetExpanded = true,
  autoResetPage = true,
  renderExpandedRow = () => <></>,
  onRowSelection,
  allRowsSelectionMode = 'all',
  getHeaderProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) => {
  const style = useStyles2(getStyles);
  const manualPagination = !!(totalPages && totalPages >= 0);
  const initialState: Partial<PaginatedTableState> = {
    pageIndex: propPageIndex,
  };
  const tableOptions: PaginatedTableOptions = {
    columns,
    data,
    initialState,
    manualPagination,
    autoResetExpanded,
    autoResetPage,
  };
  const plugins: Array<PluginHook<any>> = [useExpanded];

  if (showPagination) {
    plugins.push(usePagination);

    if (manualPagination) {
      tableOptions.pageCount = totalPages;
    }

    if (propPageSize) {
      initialState.pageSize = propPageSize;
    }
  }

  if (rowSelection) {
    plugins.push(useRowSelect);
    plugins.push((hooks) => {
      hooks.visibleColumns.push((cols: Array<ColumnInstance<any>>) => [
        {
          id: 'selection',
          width: '50px',
          Header: ({
            getToggleAllRowsSelectedProps,
            getToggleAllPageRowsSelectedProps,
          }: UseRowSelectInstanceProps<any>) => (
            <div data-testid="select-all">
              <TableCheckbox
                id="all"
                {...(allRowsSelectionMode === 'all' || !showPagination
                  ? getToggleAllRowsSelectedProps()
                  : getToggleAllPageRowsSelectedProps())}
              />
            </div>
          ),
          Cell: ({ row }: { row: UseRowSelectRowProps<any> & Row<any> }) => (
            <div data-testid="select-row">
              <TableCheckbox id={row.id} {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...cols,
      ]);
    });
  }

  const tableInstance = useTable(tableOptions, ...plugins) as PaginatedTableInstance;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    prepareRow,
    visibleColumns,
    pageCount,
    setPageSize,
    gotoPage,
    selectedFlatRows,
    state: { pageSize, pageIndex },
  } = tableInstance;
  const hasData = data.length > 0;

  const onPageChanged = (newPageIndex: number) => {
    gotoPage(newPageIndex);
    onPaginationChanged(pageSize, newPageIndex);
  };

  const onPageSizeChanged = (newPageSize: number) => {
    gotoPage(0);
    setPageSize(newPageSize);
    onPaginationChanged(newPageSize, 0);
  };

  useEffect(() => {
    if (onRowSelection) {
      onRowSelection(selectedFlatRows);
    }
  }, [onRowSelection, selectedFlatRows]);

  return (
    <>
      <Overlay dataTestId="table-loading" isPending={pendingRequest} overlayClassName={overlayClassName}>
        <div className={style.tableWrap} data-testid="table-outer-wrapper">
          <div className={style.table} data-testid="table-inner-wrapper">
            <TableContent
              loading={pendingRequest}
              hasData={hasData}
              emptyMessage={emptyMessage}
              emptyMessageClassName={emptyMessageClassName}
            >
              <table {...getTableProps()} data-testid="table">
                <thead data-testid="table-thead">
                  {headerGroups.map((headerGroup) => (
                    /* eslint-disable-next-line react/jsx-key */
                    <tr data-testid="table-thead-tr" {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        /* eslint-disable-next-line react/jsx-key */
                        <th
                          className={css`
                            width: ${column.width};
                          `}
                          {...column.getHeaderProps([
                            {
                              className: column.className,
                              style: column.style,
                            },
                            getColumnProps(column),
                            getHeaderProps(column),
                          ])}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()} data-testid="table-tbody">
                  {children
                    ? children(showPagination ? page : rows, tableInstance)
                    : (showPagination ? page : rows).map((row) => {
                        prepareRow(row);

                        return (
                          <React.Fragment key={row.id}>
                            <tr data-testid="table-tbody-tr" {...row.getRowProps(getRowProps(row))}>
                              {row.cells.map((cell) => (
                                <td
                                  {...cell.getCellProps([
                                    {
                                      className: cell.column.className,
                                      style: cell.column.style,
                                    },
                                    getCellProps(cell),
                                  ])}
                                  key={cell.column.id}
                                >
                                  {cell.render('Cell')}
                                </td>
                              ))}
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
            </TableContent>
          </div>
        </div>
      </Overlay>
      {showPagination && hasData && (
        <Pagination
          pagesPerView={pagesPerView}
          pageCount={pageCount}
          initialPageIndex={pageIndex}
          totalItems={totalItems}
          pageSizeOptions={PAGE_SIZES}
          pageSize={pageSize}
          nrRowsOnCurrentPage={page.length}
          onPageChange={(pIndex) => onPageChanged(pIndex)}
          onPageSizeChange={(pSize) => onPageSizeChanged(pSize)}
        />
      )}
    </>
  );
};
