import React from 'react';
import { useStyles } from '@grafana/ui';
import { NumberInputField, RadioButtonGroupField } from '@percona/platform-core';
import { RetryMode } from 'app/percona/backup/Backup.types';
import { Messages } from '../AddBackupModal.messages';
import { RETRY_MODE_OPTIONS } from '../AddBackupModal.constants';
import { RetryModeSelectorProps } from './RetryModeSelector.types';
import { getStyles } from './RetryModeSelector.styles';
import { retryValidator } from './RetryModeSelector.utils';

export const RetryModeSelector = ({ retryMode }: RetryModeSelectorProps) => {
  const disabledFields = retryMode === RetryMode.AUTO;
  const styles = useStyles(getStyles);

  return (
    <div data-qa="retry-mode-selector">
      <RadioButtonGroupField options={RETRY_MODE_OPTIONS} name="retryMode" label={Messages.retryMode} fullWidth />
      <div className={styles.retryFields}>
        <NumberInputField
          validators={[retryValidator]}
          disabled={disabledFields}
          fieldClassName={styles.retrySelect}
          name="retryTimes"
          label={Messages.retryTimes}
        />
        <NumberInputField
          validators={[retryValidator]}
          disabled={disabledFields}
          fieldClassName={styles.retrySelect}
          name="retryInterval"
          label={Messages.retryInterval}
        />
      </div>
    </div>
  );
};
