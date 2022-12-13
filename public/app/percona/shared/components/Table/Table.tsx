import { cx } from '@emotion/css';
import { Table as PerconaTable } from '@percona/platform-core';
import React, { useMemo } from 'react';
import { Column } from 'react-table';

import { useStyles2 } from '@grafana/ui';

import { Messages } from './Table.messages';
import { getStyles } from './Table.styles';
import { TableProps } from './Table.types';
import OptionsCell from './components/OptionsCell/OptionsCell';

const Table = <T extends object>({ getOptions, ...props }: TableProps<T>) => {
  const styles = useStyles2(getStyles);
  const optionsColumn = useMemo(
    () =>
      getOptions
        ? {
            Header: Messages.options,
            accessor: (item: T) => <OptionsCell menu={getOptions(item)} />,
          }
        : undefined,
    [getOptions]
  );
  const columns = useMemo(
    () => (optionsColumn ? [...props.columns, optionsColumn] : props.columns),
    [optionsColumn, props.columns]
  );

  return (
    <div className={cx(styles.Table, getOptions && styles.WithOptionsCol, props.style)}>
      {/* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */}
      <PerconaTable {...props} columns={columns as Column[]} />
    </div>
  );
};

export default Table;
