import React from 'react';

import { Button, IconButton, useStyles2 } from '@grafana/ui';

import { Messages } from './NavActions.messages';
import { getStyles } from './NavActions.styles';
import { NavActionsProps } from './NavActions.types';

export const NavActions = ({ buttonOnClick, iconOnClick }: NavActionsProps) => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.navActions}>
      <IconButton name="info-circle" size="lg" onClick={iconOnClick} />
      <Button onClick={buttonOnClick}>{Messages.buttonLabel}</Button>
    </div>
  );
};
