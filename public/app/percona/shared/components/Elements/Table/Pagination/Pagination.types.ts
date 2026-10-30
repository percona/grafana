import { SelectableValue } from '@grafana/data';

export interface PaginationProps {
  totalItems: number;
  pageCount: number;
  initialPageIndex?: number;
  // Controls the active page from the parent; initialPageIndex only seeds it when this is unset.
  pageIndex?: number;
  pagesPerView?: number;
  pageSizeOptions: Array<SelectableValue<number>>;
  pageSize: number;
  nrRowsOnCurrentPage: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (size: number) => void;
}
