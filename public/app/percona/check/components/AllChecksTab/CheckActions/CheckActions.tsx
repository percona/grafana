import React, { FC, useCallback, useState } from 'react';
import { IconButton, useStyles2 } from '@grafana/ui';
import { LoaderButton } from '@percona/platform-core';
import { Messages } from '../AllChecksTab.messages';
import { CheckActionsProps } from './CheckActions.types';
import { getStyles } from './CheckActions.styles';

export const CheckActions: FC<CheckActionsProps> = ({ check, onChangeCheck, onIntervalChangeClick }) => {
  const styles = useStyles2(getStyles);
  const [loading, setLoading] = useState(false);

  const handleChangeCheck = useCallback(async () => {
    setLoading(true);
    await onChangeCheck(check);
    setLoading(false);
  }, [check, onChangeCheck]);

  const handleIntervalChangeClick = useCallback(() => onIntervalChangeClick(check), [check, onIntervalChangeClick]);

  return (
    <div className={styles.actionsWrapper}>
      <LoaderButton
        variant={!!check.disabled ? 'primary' : 'destructive'}
        size="sm"
        loading={loading}
        onClick={handleChangeCheck}
        data-testid="check-table-loader-button"
      >
        {!!check.disabled ? Messages.enable : Messages.disable}
      </LoaderButton>
      <IconButton title={Messages.changeIntervalButtonTitle} name="pen" onClick={handleIntervalChangeClick} />
    </div>
  );
};
