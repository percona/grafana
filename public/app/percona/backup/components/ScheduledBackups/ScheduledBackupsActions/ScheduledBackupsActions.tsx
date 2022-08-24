import React, { FC } from 'react';

import { Icon, Spinner, Switch, useStyles } from '@grafana/ui';
import { getStyles } from './ScheduledBackupsActions.styles';
import { ScheduledBackupsActionsProps } from './ScheduledBackupsActions.types';
import { MultipleActions } from 'app/percona/dbaas/components/MultipleActions';
import { Messages } from './ScheduledBackupsActions.messages';
export const ScheduledBackupsActions: FC<ScheduledBackupsActionsProps> = ({
  backup,
  onEdit = () => {},
  onCopy = () => {},
  onDelete = () => {},
  onToggle = () => {},
  pending,
}) => {
  const styles = useStyles(getStyles);
  const handleEdit = () => onEdit(backup);
  const handleDelete = () => onDelete(backup);
  const handleCopy = () => onCopy(backup);
  const handleToggle = () => onToggle(backup);

  const getActions = [
    {
      title: (
        <div className={styles.dropdownField}>
          <Icon data-testid="copy-scheduled-backup-button" name="copy" />
          {Messages.copy}
        </div>
      ),
      action: handleCopy,
    },
    {
      title: (
        <div className={styles.dropdownField}>
          <Icon data-testid="edit-scheduled-backpup-button" name="pen" />
          {Messages.edit}
        </div>
      ),
      action: handleEdit,
    },
    {
      title: (
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
        </>
      )}
    </div>
  );
};
