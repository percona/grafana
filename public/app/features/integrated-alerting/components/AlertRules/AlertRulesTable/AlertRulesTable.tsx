import React, { FC, useContext } from 'react';
import { TableState, useTable, usePagination } from 'react-table';
import { Spinner, useStyles } from '@grafana/ui';
import { css } from 'emotion';
import { getStyles } from './AlertRulesTable.styles';
import { AlertRule } from '../AlertRules.types';
import { AlertRulesTableProps } from './AlertRulesTable.types';
import { AlertRulesProvider } from '../AlertRules.provider';
import { Pagination } from '../../Table/Pagination';
import { PaginatedTableInstance, PaginatedTableOptions } from '../../Table';
import { PAGE_SIZES } from 'app/core/constants';

export const AlertRulesTable: FC<AlertRulesTableProps> = ({
  pendingRequest,
  data,
  columns,
  emptyMessage,
  showPagination,
  totalPages,
  totalItems,
  pageSize: propPageSize,
  pageIndex: propPageIndex,
  onPaginationChanged,
}) => {
  const style = useStyles(getStyles);
  const { selectedRuleDetails } = useContext(AlertRulesProvider);
  const manualPagination = totalPages >= 0;
  const initialState = {
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

  const onPageChanged = (newPageIndex: number) => {
    gotoPage(newPageIndex);
    onPaginationChanged(pageSize, newPageIndex);
  };

  const onPageSizeChanged = (newPageSize: number) => {
    setPageSize(newPageSize);
    onPaginationChanged(newPageSize, pageIndex);
  };

  return (
    <>
      <div className={style.tableWrap} data-qa="alert-rules-table-outer-wrapper">
        <div className={style.table} data-qa="alert-rules-inner-wrapper">
          {pendingRequest ? (
            <div data-qa="alert-rules-table-loading" className={style.empty}>
              <Spinner />
            </div>
          ) : null}
          {!pageCount && !pendingRequest ? (
            <div data-qa="alert-rules-table-no-data" className={style.empty}>
              {<h1>{emptyMessage}</h1>}
            </div>
          ) : null}
          {pageCount && !pendingRequest ? (
            <table {...getTableProps()} data-qa="alert-rules-table">
              <thead data-qa="alert-rules-table-thead">
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
              <tbody {...getTableBodyProps()} data-qa="alert-rules-table-tbody">
                {page.map(row => {
                  prepareRow(row);
                  const alertRule = row.original as AlertRule;

                  return (
                    <>
                      <tr {...row.getRowProps()} className={alertRule.disabled ? style.disabledRow : ''}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                      {selectedRuleDetails && alertRule.ruleId === selectedRuleDetails.ruleId && (
                        <tr>
                          <td colSpan={columns.length}>
                            <pre data-qa="alert-rules-details" className={style.details}>
                              {alertRule.rawValues.template.yaml}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
      {showPagination && (
        <Pagination
          pageCount={pageCount}
          initialPageIndex={0}
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
