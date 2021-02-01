import { Column } from 'react-table';

export interface AlertRulesTableProps {
  data: object[];
  columns: Column[];
  pendingRequest?: boolean;
  emptyMessage?: string;
  showPagination?: boolean;
  totalPages?: number;
  totalItems: number;
  tableHash?: string;
  fetchData: (pageSize: number, pageIndex: number) => void;
}
