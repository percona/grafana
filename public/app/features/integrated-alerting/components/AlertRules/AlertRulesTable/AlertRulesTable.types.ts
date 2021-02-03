import { Column } from 'react-table';

export interface AlertRulesTableProps {
  data: object[];
  columns: Column[];
  pendingRequest?: boolean;
  emptyMessage?: string;
  showPagination?: boolean;
  totalPages?: number;
  totalItems: number;
  pageSize: number;
  pageIndex: number;
  onPaginationChanged: (pageSize: number, pageIndex: number) => void;
}
