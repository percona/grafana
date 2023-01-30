import { AsyncSelectField, validators } from '@percona/platform-core';
import React, { FC } from 'react';

import { useStyles } from '@grafana/ui';

import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from '../../../../../../backup/components/ScheduledBackups/ScheduledBackups.constants';
import { useCancelToken } from '../../../../../../shared/components/hooks/cancelToken.hook';
import { AddDBClusterFormValues } from '../../EditDBClusterPage.types';
import { Messages } from '../DBClusterBasicOptions.messages';
import { BasicOptionsFields } from '../DBClusterBasicOptions.types';

import { RestoreFromService } from './RestoreFrom.service';
import { getStyles } from './RestoreFrom.styles';
import { RestoreFromProps } from './RestoreFrom.types';

export const RestoreFrom: FC<RestoreFromProps> = ({ form }) => {
  const styles = useStyles(getStyles);

  const [generateToken] = useCancelToken();

  const { restoreFrom } = form.getState().values as AddDBClusterFormValues;
  const restoreFromValue = restoreFrom?.value;
  return (
    <div className={styles.line}>
      <AsyncSelectField
        name={BasicOptionsFields.restoreFrom}
        loadOptions={() => RestoreFromService.loadStorageLocations(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN))}
        defaultOptions
        placeholder={Messages.placeholders.restoreFrom}
        label={Messages.restoreFrom}
        validate={validators.required}
      />
      {restoreFromValue !== undefined && restoreFromValue ? (
        <AsyncSelectField
          name={BasicOptionsFields.backupArtifact}
          loadOptions={() => RestoreFromService.loadBackupArtifacts(restoreFromValue)}
          defaultOptions
          placeholder={Messages.placeholders.backupArtifact}
          label={Messages.backupArtifact}
          validate={validators.required}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default RestoreFrom;
