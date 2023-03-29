import { useEffect, useState } from 'react';

import { getUpdateStatus } from '../UpdatePanel.service';
import { UpdateMethod, UpdateStatus } from '../types';

import { useInitializeUpdate } from './useInitializeUpdate';

export const usePerformUpdate = (): UpdateStatus => {
  const [updateFailed, setUpdateFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [output, setOutput] = useState('');
  const [updateFinished, setUpdateFinished] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [pmmServerStopped, setPmmServerStopped] = useState(false);

  const [authToken, initialLogOffset, initializationFailed, launchUpdate, updateMethod, ,] = useInitializeUpdate();

  useEffect(() => {
    console.log({ authToken, initialLogOffset, updateMethod });

    if (!authToken || initialLogOffset === undefined || updateMethod === UpdateMethod.invalid) {
      return;
    }

    const updateStatus = async (logOffset: number, errorsCount = 0) => {
      // Set the errorCount high enough to make it possible for the user to find the error
      if (errorsCount > 600 || initializationFailed) {
        setUpdateFailed(true);

        return;
      }

      let newErrorsCount = errorsCount;
      let newLogOffset = logOffset;
      let newIsUpdated = false;

      try {
        const response = await getUpdateStatus({ auth_token: authToken, log_offset: logOffset, method: updateMethod });

        if (!response) {
          throw Error('Invalid response received');
        }

        const { done, log_offset, log_lines } = response;

        // Check if PMM server has stopped
        if (log_lines.some((line) => line.includes('Stopping PMM Server in container'))) {
          setPmmServerStopped(true);
        }

        setOutput((previousOutput) => {
          const logLines = log_lines ?? [];

          return `${previousOutput}${logLines.join('\n')}\n`;
        });
        newLogOffset = log_offset ?? 0;
        newErrorsCount = 0;
        newIsUpdated = done ?? false;
      } catch (e) {
        newErrorsCount += 1;
        //@ts-ignore
        setErrorMessage(e.message);
      } finally {
        if (newIsUpdated) {
          setPmmServerStopped(false);
          setUpdateFinished(newIsUpdated);
        } else {
          const timeout = setTimeout(updateStatus, 500, newLogOffset, newErrorsCount);

          setTimeoutId(timeout);
        }
      }
    };

    updateStatus(initialLogOffset, 0);

    // eslint-disable-next-line consistent-return
    return () => {
      // @ts-ignore
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, initialLogOffset, updateMethod]);

  useEffect(() => {
    setUpdateFailed(initializationFailed);
  }, [initializationFailed]);

  return [output, errorMessage, updateFinished, updateFailed, launchUpdate, updateMethod, pmmServerStopped];
};
