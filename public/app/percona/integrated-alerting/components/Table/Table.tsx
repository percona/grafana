import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTable, usePagination, useExpanded } from 'react-table';
import { css } from '@emotion/css';
import { useStyles } from '@grafana/ui';
import { getStyles } from './Table.styles';
import {
  TableProps,
  PaginatedTableInstance,
  PaginatedTableOptions,
  PaginatedTableState,
  FilterFieldTypes,
} from './Table.types';
import { Pagination } from './Pagination';
import { PAGE_SIZES } from './Pagination/Pagination.constants';
import { TableContent } from './TableContent';
import { Overlay } from 'app/percona/shared/components/Elements/Overlay/Overlay';
import { Filter } from './Filter/Filter';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { UrlQueryValue } from '@grafana/data';
import { getValuesFromQueryParams } from 'app/percona/shared/helpers/getValuesFromQueryParams';

const defaultPropGetter = () => ({});

export const Table: FC<TableProps> = ({
  pendingRequest = false,
  data: rawData,
  columns,
  showPagination,
  totalPages,
  onPaginationChanged = () => null,
  emptyMessage = '',
  totalItems,
  pageSize: propPageSize,
  pageIndex: propPageIndex = 0,
  pagesPerView,
  children,
  autoResetExpanded = true,
  autoResetPage = true,
  renderExpandedRow = () => <></>,
  getHeaderProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  showFilter,
}) => {
  const [data, setFilteredData] = useState<Object[]>([]);
  const [queryParams] = useQueryParams();
  const style = useStyles(getStyles);
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
  const plugins: any[] = [useExpanded];

  if (showPagination) {
    plugins.push(usePagination);

    if (manualPagination) {
      tableOptions.pageCount = totalPages;
    }

    if (propPageSize) {
      initialState.pageSize = propPageSize;
    }
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

  const getQueryParams = useMemo(() => {
    const customTransform = (params: UrlQueryValue): any => {
      if (params !== undefined && params !== null) {
        return params;
      }
      return [];
    };
    const queryKeys = columns.map((column) => ({ key: column.accessor as string, transform: customTransform }));
    queryKeys.push({ key: 'search-text-input', transform: customTransform });
    queryKeys.push({ key: 'search-select', transform: customTransform });
    const params = getValuesFromQueryParams(queryParams, queryKeys);
    return params ?? {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const filter = useCallback(() => {
    const queryParamsObj = getQueryParams;
    if (Object.keys(queryParams).length > 0) {
      const dataArray = rawData.filter((filterValue) => isValueInColumn(filterValue, queryParamsObj));
      setFilteredData(dataArray);
    } else {
      setFilteredData(rawData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getQueryParams, rawData]);
  useEffect(() => filter(), [filter, rawData]);

  const isValueInColumn = (filterValue: any, queryParams: any) => {
    let result = false;
    columns.forEach((column) => {
      if (column.type === FilterFieldTypes.TEXT && queryParams['search-text-input']) {
        if (column.accessor === queryParams['search-select'] || queryParams['search-select'] === 'All') {
          if (isTextIncluded(queryParams['search-text-input'], filterValue[column.accessor as string])) {
            result = true;
            return;
          }
        }
      }
    });
    console.log(result);
    return result;
  };

  const isTextIncluded = (needle: string, haystack: string): boolean =>
    haystack.toLowerCase().includes(needle.toLowerCase());

  return (
    <>
      <Overlay dataTestId="table-loading" isPending={pendingRequest}>
        {showFilter && <Filter columns={columns} rawData={rawData} setFilteredData={setFilteredData} />}
        <div className={style.tableWrap} data-testid="table-outer-wrapper">
          <div className={style.table} data-testid="table-inner-wrapper">
            <TableContent loading={pendingRequest} hasData={hasData} emptyMessage={emptyMessage}>
              <table {...getTableProps()} data-testid="table">
                <thead data-testid="table-thead">
                  {headerGroups.map((headerGroup) => (
                    /* eslint-disable-next-line react/jsx-key */
                    <tr {...headerGroup.getHeaderGroupProps()}>
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
                            <tr {...row.getRowProps(getRowProps(row))}>
                              {row.cells.map((cell) => {
                                return (
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
          onPageChange={(pageIndex) => onPageChanged(pageIndex)}
          onPageSizeChange={(pageSize) => onPageSizeChanged(pageSize)}
        />
      )}
    </>
  );
};
