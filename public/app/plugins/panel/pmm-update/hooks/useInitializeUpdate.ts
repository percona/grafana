import { logger } from '@percona/platform-core';
import { useState } from 'react';

import { startUpdate } from '../UpdatePanel.service';
import { UpdateInitialization, UpdateMethod } from '../types';

export const useInitializeUpdate = (): UpdateInitialization => {
  const [updateFailed, setUpdateFailed] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [updateMethod, setUpdateMethod] = useState(UpdateMethod.invalid);
  const [initialLogOffset, setInitialLogOffset] = useState(0);

  const launchUpdate = async (method: UpdateMethod) => {
    try {
      const data = await startUpdate(method);

      if (!data) {
        throw Error('Invalid response received');
      }

      const { auth_token, log_offset } = data;

      setUpdateMethod(method);
      setAuthToken(auth_token);
      setInitialLogOffset(log_offset);
    } catch (e) {
      setUpdateFailed(true);
      logger.error(e);
    }
  };

  return [authToken, initialLogOffset, updateFailed, launchUpdate, updateMethod];
};
