/* eslint-disable react/display-name */
import { Dropdown } from '@percona/platform-core';
import React, { FC, Fragment } from 'react';

import { IconButton, useTheme } from '@grafana/ui';

import { getStyles } from './MultipleActions.styles';
import { MultipleActionsProps } from './MultipleActions.types';

export const MultipleActions: FC<MultipleActionsProps> = ({ actions, disabled, dataTestId }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const Toggle = React.forwardRef<HTMLButtonElement>((props, ref) => (
    <IconButton name="ellipsis-v" size="xl" disabled={disabled} data-testid={dataTestId} ref={ref} {...props} />
  ));

  return (
    <Dropdown toggle={Toggle} data-testid="multiple-actions-dropdown">
      {actions.map(({ title, action, disabled }) => (
        <Fragment key={title}>
          {disabled ? <span className={styles.disabledButton}>{title}</span> : <span onClick={action}>{title}</span>}
        </Fragment>
      ))}
    </Dropdown>
  );
};