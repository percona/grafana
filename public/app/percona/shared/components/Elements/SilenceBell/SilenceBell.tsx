import React, { FC, useState, useCallback } from 'react';
import { IconButton, Spinner } from '@grafana/ui';
import { SilenceBellProps } from './SilenceBell.types';

export const SilenceBell: FC<SilenceBellProps> = ({ silenced, tooltip = '', onClick = () => null }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = useCallback(() => {
    setLoading(true);
    onClick();
    setLoading(false);
  }, [onClick]);

  return loading ? (
    <Spinner />
  ) : (
    <IconButton
      tooltipPlacement="top"
      tooltip={tooltip}
      onClick={handleClick}
      name={silenced ? 'percona-bell' : 'percona-bell-slash'}
      iconType="mono"
    ></IconButton>
  );
};
