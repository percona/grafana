import { SelectableValue } from '@grafana/data';

export interface PageSizeChangerProps {
  pageSizeOptions: Array<SelectableValue<number>>;
  pageSize: number;
  showRowsPerPageLabel?: boolean;
  disabled?: boolean;
  pageSizeChanged: (page: number) => void;
}
