import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { DBIcon } from '../../DBIcon';
import { StorageLocatationsActionProps } from './StorageLocationsActions.types';
import { getStyles } from './StorageLocationsActions.styles';

export const StorageLocationsActions: FC<StorageLocatationsActionProps> = ({ location }) => {
  const styles = useStyles(getStyles);

  return (
    <div className={styles.actionsWrapper}>
      <DBIcon type="edit" data-qa="edit-storage-location-button" role="button" />
      <DBIcon type="delete" data-qa="delete-storage-location-button" role="button" />
    </div>
  );
};
