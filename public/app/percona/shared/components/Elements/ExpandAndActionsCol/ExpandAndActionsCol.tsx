import React, { PropsWithChildren, ReactElement } from 'react';

import { Spinner, Tooltip, useStyles2 } from '@grafana/ui';
import { MultipleActions } from 'app/percona/dbaas/components/MultipleActions';
import { ExpandableRowButton } from 'app/percona/shared/components/Elements/ExpandableRowButton/ExpandableRowButton';

import { Messages } from './ExpandAndActionsCol.messages';
import { getStyles } from './ExpandAndActionsCol.styles';
import { ExpandAndActionsColProps } from './ExpandAndActionsCol.types';

export const ExpandAndActionsCol = <T extends object>({
  row,
  loading = false,
  actions = [],
  children,
}: PropsWithChildren<ExpandAndActionsColProps<T>>): ReactElement => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.actionsWrapper}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {children}
          <Tooltip content={Messages.details} placement="top">
            <span>
              <ExpandableRowButton row={row} />
            </span>
          </Tooltip>
          {!!actions.length && <MultipleActions actions={actions} dataTestId="actions" />}
        </>
      )}
    </div>
  );
};
