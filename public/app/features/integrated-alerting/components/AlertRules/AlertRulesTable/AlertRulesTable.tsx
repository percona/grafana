import React, { FC, useContext } from 'react';
import { TableState, useTable, usePagination } from 'react-table';
import { useStyles } from '@grafana/ui';
import { css } from 'emotion';
import { getStyles } from './AlertRulesTable.styles';
import { AlertRule } from '../AlertRules.types';
import { AlertRulesTableProps } from './AlertRulesTable.types';
import { AlertRulesProvider } from '../AlertRules.provider';
import { Pagination } from '../../Table/Pagination';
import { PaginatedTableInstance, PaginatedTableOptions } from '../../Table';
import { PAGE_SIZES } from '../../Table/Pagination/Pagination.constants';
import { TableContent } from '../../Table/TableContent';

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
      <div className={style.tableWrap} data-qa="alert-rules-table-outer-wrapper">
        <div className={style.table} data-qa="alert-rules-inner-wrapper">
          <TableContent hasData={hasData} emptyMessage={emptyMessage} pending={pendingRequest}>
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
                              {alertRule.expr}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </>
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
