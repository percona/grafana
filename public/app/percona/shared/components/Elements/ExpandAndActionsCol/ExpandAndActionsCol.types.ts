import { Row } from 'react-table';

import { Action } from 'app/percona/dbaas/components/MultipleActions/MultipleActions.types';

export interface ExpandAndActionsColProps<T extends object> {
  actions?: Action[];
  row: Row<T>;
  loading?: boolean;
}
