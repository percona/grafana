import { AsyncSelectField, NumberInputField, validators } from '@percona/platform-core';
import React, { FC, useState } from 'react';
import { FormRenderProps } from 'react-final-form';

import { FieldSet, Switch, useStyles } from '@grafana/ui';
import { validators as customValidators } from 'app/percona/shared/helpers/validators';

import { MAX_RETENTION, MIN_RETENTION } from '../../../../../backup/components/AddBackupPage/AddBackupPage.constants';
import { ScheduleSectionFields } from '../../../../../backup/components/AddBackupPage/ScheduleSection/ScheduleSectionFields/ScheduleSectionFields';
import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from '../../../../../backup/components/ScheduledBackups/ScheduledBackups.constants';
import { useCancelToken } from '../../../../../shared/components/hooks/cancelToken.hook';
import { RestoreService } from '../DBClusterBasicOptions/Restore/Restore.service';
import { AddDBClusterFormValues } from '../EditDBClusterPage.types';

import { Messages } from '././DBaaSBackups.messages';
import { getStyles } from './DBaaSBackups.styles';
import { DBaaSBackupFields } from './DBaaSBackups.types';

export const DBaaSBackups: FC<FormRenderProps> = ({ values }) => {
  const styles = useStyles(getStyles);
  const [enableBackups, setEnableBackups] = useState(false);
  const [generateToken] = useCancelToken();

  return (
    <FieldSet
      label={
        <div className={styles.fieldSetLabel}>
          <div>{Messages.labels.enableBackups}</div>
          <div className={styles.fieldSetSwitch}>
            <Switch
              value={enableBackups}
              onClick={() => setEnableBackups((prevState) => !prevState)}
              data-testid="toggle-scheduled-backpup"
            />
          </div>
        </div>
      }
      data-testid="configurations"
    >
      {enableBackups ? (
        <>
          <FieldSet className={styles.childFildSet} label={Messages.fieldSets.backupInfo}>
            <div className={styles.line}>
              <AsyncSelectField
                name={DBaaSBackupFields.location}
                loadOptions={() =>
                  RestoreService.loadStorageLocations(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN))
                }
                defaultOptions
                placeholder={Messages.placeholders.location}
                label={Messages.labels.location}
                validate={validators.required}
              />
              <NumberInputField
                name={DBaaSBackupFields.retention}
                label={Messages.labels.retention}
                defaultValue={7}
                validators={[validators.required, customValidators.range(MIN_RETENTION, MAX_RETENTION)]}
              />
            </div>
          </FieldSet>
          <FieldSet className={styles.childFildSet} label={Messages.fieldSets.schedule}>
            <ScheduleSectionFields values={values as AddDBClusterFormValues} />
          </FieldSet>
        </>
      ) : (
        <div />
      )}
    </FieldSet>
  );
};

export default DBaaSBackups;
