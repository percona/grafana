import { AsyncSelectField, validators } from '@percona/platform-core';
import React, { FC } from 'react';

import { useStyles } from '@grafana/ui';

import { LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN } from '../../../../../../backup/components/ScheduledBackups/ScheduledBackups.constants';
import { useCancelToken } from '../../../../../../shared/components/hooks/cancelToken.hook';
import { AddDBClusterFormValues } from '../../EditDBClusterPage.types';

import { Messages } from './Restore.messages';
import { RestoreService } from './Restore.service';
import { getStyles } from './Restore.styles';
import { RestoreFields, RestoreFromProps } from './Restore.types';

export const Restore: FC<RestoreFromProps> = ({ form }) => {
  const styles = useStyles(getStyles);

  const [generateToken] = useCancelToken();

  const { restoreFrom, kubernetesCluster } = form.getState().values as AddDBClusterFormValues;
  const restoreFromValue = restoreFrom?.value;
  return (
    <>
      <div className={styles.line}>
        <AsyncSelectField
          name={RestoreFields.restoreFrom}
          loadOptions={() => RestoreService.loadStorageLocations(generateToken(LIST_SCHEDULED_BACKUPS_CANCEL_TOKEN))}
          defaultOptions
          placeholder={Messages.placeholders.restoreFrom}
          label={Messages.labels.restoreFrom}
          validate={validators.required}
        />
        {restoreFromValue !== undefined && restoreFromValue ? (
          <AsyncSelectField
            name={RestoreFields.backupArtifact}
            loadOptions={() => RestoreService.loadBackupArtifacts(restoreFromValue)}
            defaultOptions
            placeholder={Messages.placeholders.backupArtifact}
            label={Messages.labels.backupArtifact}
            validate={validators.required}
          />
        ) : (
          <div />
        )}
      </div>
      {kubernetesCluster?.value && (
        <div className={styles.line}>
          <AsyncSelectField
            name={RestoreFields.secretsName}
            loadOptions={() => RestoreService.loadSecretsNames(kubernetesCluster?.value)}
            defaultOptions
            placeholder={Messages.placeholders.secretsName}
            label={Messages.labels.secretsName}
            validate={validators.required}
          />
          <div />
        </div>
      )}
    </>
  );
};

export default Restore;
