import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { DBIcon } from '../../DBIcon';
import { StorageLocatationsActionProps } from './StorageLocationsActions.types';
import { getStyles } from './StorageLocationsActions.styles';

export const StorageLocationsActions: FC<StorageLocatationsActionProps> = ({ locationID }) => {
  const styles = useStyles(getStyles);
  const iconProps = { role: 'button' };

  return (
    <div className={styles.actionsWrapper}>
      <DBIcon type="save" data-qa="save-storage-location-button" {...iconProps} />
      <DBIcon type="see" data-qa="see-storage-location-button" {...iconProps} />
      <DBIcon type="delete" data-qa="delete-storage-location-button" {...iconProps} />
    </div>
  );
};
