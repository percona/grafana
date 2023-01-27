import React, { FC, useState } from 'react';

import { FieldSet, Switch, useStyles } from '@grafana/ui';

import { Messages } from './Backups.messages';
import { getStyles } from './Backups.styles';
export const Backups: FC<{}> = () => {
  const styles = useStyles(getStyles);
  const [enableBackups, setEnableBackups] = useState(false);

  return (
    <FieldSet
      label={
        <div className={styles.fieldSetLabel}>
          <div>{Messages.labels.enableBackups}</div>
          <Switch
            value={enableBackups}
            onClick={() => setEnableBackups((prevState) => !prevState)}
            data-testid="toggle-scheduled-backpup"
          />
        </div>
      }
      data-testid="configurations"
    >
      <div />
    </FieldSet>
  );
};

export default Backups;
