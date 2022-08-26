import React, { FC } from 'react';
import { Icon, Spinner, Switch, useStyles2 } from '@grafana/ui';
import { getStyles } from './ScheduledBackupsActions.styles';
import { ScheduledBackupsActionsProps } from './ScheduledBackupsActions.types';
import { MultipleActions } from 'app/percona/dbaas/components/MultipleActions';
import { Messages } from './ScheduledBackupsActions.messages';
import { ExpandebleRowButton } from 'app/percona/shared/components/Elements/ExpandebleRowButton/ExpandebleRowButton';
export const ScheduledBackupsActions: FC<ScheduledBackupsActionsProps> = ({
  row,
  backup,
  onEdit = () => {},
  onCopy = () => {},
  onDelete = () => {},
  onToggle = () => {},
  pending,
}) => {
  const styles = useStyles2(getStyles);
  const handleEdit = () => onEdit(backup);
  const handleDelete = () => onDelete(backup);
  const handleCopy = () => onCopy(backup);
  const handleToggle = () => onToggle(backup);

  const getActions = [
    {
      content: (
        <div className={styles.dropdownField}>
          <Icon data-testid="copy-scheduled-backup-button" name="copy" />
          {Messages.copy}
        </div>
      ),
      action: handleCopy,
    },
    {
      content: (
        <div className={styles.dropdownField}>
          <Icon data-testid="edit-scheduled-backpup-button" name="pen" />
          {Messages.edit}
        </div>
      ),
      action: handleEdit,
    },
    {
      content: (
        <div className={styles.dropdownField}>
          <Icon data-testid="delete-scheduled-backpup-button" name="times" />
          {Messages.delete}
        </div>
      ),
      action: handleDelete,
    },
  ];

  return (
    <div className={styles.actionsWrapper}>
      {pending ? (
        <Spinner />
      ) : (
        <>
          <span>
            <Switch value={backup.enabled} onClick={handleToggle} data-testid="toggle-scheduled-backpup" />
          </span>
          <MultipleActions actions={getActions} dataTestId="dbcluster-actions" />
          <ExpandebleRowButton row={row} />
        </>
      )}
    </div>
  );
};
