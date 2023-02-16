import { logger } from '@percona/platform-core';
import { useState } from 'react';

import { startUpdate } from '../UpdatePanel.service';
import { UpdateInitialization } from '../types';

export const useInitializeUpdate = (): UpdateInitialization => {
  const [updateFailed, setUpdateFailed] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [initialLogOffset, setInitialLogOffset] = useState(0);

  const launchUpdate = async () => {
    try {
      const data = await startUpdate();

      if (!data) {
        throw Error('Invalid response received');
      }

      const { auth_token, log_offset } = data;

      setAuthToken(auth_token);
      setInitialLogOffset(log_offset);
    } catch (e) {
      setUpdateFailed(true);
      logger.error(e);
    }
  };

  return [authToken, initialLogOffset, updateFailed, launchUpdate];
};
