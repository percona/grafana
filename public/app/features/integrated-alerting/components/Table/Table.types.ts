import { Column, TableInstance, TableState, Row } from 'react-table';

export interface TableProps {
  data: object[];
  columns: Column[];
  pendingRequest?: boolean;
  emptyMessage?: string;
  totalItems: number;
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
