export interface PageChangerProps {
  activePageIndex: number;
  pageCount: number;
  shownPages: number[];
  showFirstLastPageButtons?: boolean;
  disabled?: boolean;
  gotoPage: (page: number) => void;
}
