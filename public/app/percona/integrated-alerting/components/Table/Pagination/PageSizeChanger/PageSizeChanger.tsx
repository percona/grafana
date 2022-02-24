import React, { FC } from 'react';
import { useStyles, Select } from '@grafana/ui';
import { getStyles } from './PageSizeChanger.styles';
import { Messages } from './PageSizeChanger.messages'
import { PageSizeChangerProps } from './PageSizeChanger.types';

export const PageSizeChanger: FC<PageSizeChangerProps> = ({
  pageSize,
  pageSizeOptions,
  pageSizeChanged,
  disabled,
  showRowsPerPageLabel,
}) => {
  const styles = useStyles(getStyles);

  return (
    <span>
      {showRowsPerPageLabel && (<span className={styles.rowsPerPage}>{Messages.rowsPerPage}</span>)}
      <span className={styles.pageSize}> 
        <Select
          data-testid="pagination-size-select"
          isSearchable={false}
          value={pageSize}
          options={pageSizeOptions}
          disabled={disabled}
          onChange={(e) => pageSizeChanged(e.value || 0)}
        />
      </span>
    </span>
  );
};
