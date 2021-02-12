import React, { FC } from 'react';
import { Spinner, useStyles } from '@grafana/ui';
import { TableContentProps } from './TableContent.types';
import { getStyles } from './TableContent.styles';

export const TableContent: FC<TableContentProps> = ({ pending, hasData, emptyMessage, children }) => {
  const styles = useStyles(getStyles);
  if (pending) {
    return (
      <div data-qa="table-loading" className={styles.empty}>
        <Spinner />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div data-qa="table-no-data" className={styles.empty}>
        {<h1>{emptyMessage}</h1>}
      </div>
    );
  }

  return <>{children}</>;
};
