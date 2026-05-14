import { ReactNode } from 'react';

import { useStyles2 } from '@grafana/ui';

import { CheckboxField } from '../../../../Checkbox';
import { ExtendedColumn } from '../../../Table.types';

import { getStyles } from './BooleanField.styles';

const BooleanField = <T extends object>({ column }: { column: ExtendedColumn<T> }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.booleanField}>
      <CheckboxField
        name={String(column.accessor)}
        label={column.label ?? (column.Header as ReactNode)}
        data-testid={`${String(column.accessor)}-filter-checkbox`}
        format={(value) => (typeof value === 'boolean' ? value : value === 'true')}
      />
    </div>
  );
};

export default BooleanField;
