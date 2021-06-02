import React from 'react';
import { RadioButtonGroupField } from '@percona/platform-core';
import { Messages } from '../AddBackupModal.messages';
import { RETRY_MODE_OPTIONS } from '../AddBackupModal.constants';

export const RetryModeSelector = () => (
  <>
    <RadioButtonGroupField
      disabled
      options={RETRY_MODE_OPTIONS}
      name="retryMode"
      label={Messages.retryMode}
      fullWidth
    />
    {/* <div className={styles.retryFields}>
              <NumberInputField fieldClassName={styles.retrySelect} name="retryTimes" label={Messages.retryTimes} />
              <NumberInputField
                fieldClassName={styles.retrySelect}
                name="retryInterval"
                label={Messages.retryInterval}
              />
            </div> */}
  </>
);
