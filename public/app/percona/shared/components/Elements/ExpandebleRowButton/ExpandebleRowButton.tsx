import { IconButton, useStyles2 } from '@grafana/ui';
import React from 'react';
import { ExpandebleButtonProps } from './ExpandebleRowButton.type';
import { getStyles } from './ExpandebleRowButton.styles';
export const ExpandebleRowButton = ({ row }: ExpandebleButtonProps) => {
  const expandedRowProps = row.getToggleRowExpandedProps ? row.getToggleRowExpandedProps() : {};
  const styles = useStyles2(getStyles);
  return (
    <span className={styles.buttonWrapper} {...expandedRowProps}>
      {row.isExpanded ? (
        <IconButton data-testid="hide-row-details" size="xl" name="arrow-up" />
      ) : (
        <IconButton data-testid="show-row-details" size="xl" name="arrow-down" />
      )}
    </span>
  );
};
