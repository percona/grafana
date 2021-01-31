import { Column, TableInstance, TableState, Row, TableOptions } from 'react-table';

export interface TableProps {
  data: object[];
  columns: Column[];
  pendingRequest?: boolean;
  emptyMessage?: string;
  totalItems: number;
  totalPages?: number;
  tableHash?: string;
  fetchData: (pageSize: number, pageIndex: number) => void;
}

interface ExtendedTableState extends TableState {
  pageIndex: number;
  pageSize: number;
}

export interface ExtendedTableInstance extends TableInstance {
  page: Row[];
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (page: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  pageCount: number;
  setPageSize: (size: number) => void;
  state: ExtendedTableState;
}

export interface ExtendedTableOptions extends TableOptions<object> {
  manualPagination?: boolean;
  pageCount?: number;
}
