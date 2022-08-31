import React, { FC } from 'react';

import { useStyles2 } from '@grafana/ui';
import { BackupInventoryActionsProps } from './RestoreHistoryActions.types';
import { getStyles } from './RestoreHistoryActions.styles';
import { ExpandableRowButton } from 'app/percona/shared/components/Elements/ExpandableRowButton/ExpandableRowButton';

export const RestoreHistoryActions: FC<BackupInventoryActionsProps> = ({ row }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.actionsWrapper}>
      <ExpandableRowButton row={row} />
    </div>
  );
};
