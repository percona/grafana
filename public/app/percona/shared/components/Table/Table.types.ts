import { Column } from 'react-table';

import { TableProps as PerconaTableProps } from 'app/percona/shared/core-ui';

export interface TableProps<T extends object> extends Omit<PerconaTableProps, 'columns'> {
  columns: Array<Column<T>>;
  style?: string;
}
