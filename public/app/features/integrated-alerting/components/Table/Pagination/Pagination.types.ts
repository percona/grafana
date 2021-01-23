export interface PaginationProps {
  pageCount?: number;
  initialPageIndex?: number;
  pagesPerView?: number;
  onPageChange?: (pageIndex: number) => void;
}
