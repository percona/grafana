import { useStyles } from '@grafana/ui';
import { logger, CopyToClipboard } from '@percona/platform-core';
import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { BackupLogChunk } from '../../Backup.types';
import { useRecurringCall } from '../../hooks/recurringCall.hook';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { LIMIT, STREAM_INTERVAL, LOGS_CANCEL_TOKEN } from './ChunkedLogsViewer.constants';
import { getStyles } from './ChunkedLogsViewer.styles';
import { ChunkedLogsViewerProps } from './ChunkedLogsViewer.types';
import { Messages } from './ChunkedLogsViewer.messages';
import { isApiCancelError } from 'app/percona/shared/helpers/api';

export const ChunkedLogsViewer: FC<ChunkedLogsViewerProps> = ({ getLogChunks }) => {
  const [lastLog, setLastLog] = useState(false);
  const [logs, setLogs] = useState<BackupLogChunk[]>([]);
  const [triggerTimeout, , stopTimeout] = useRecurringCall();
  const [generateToken] = useCancelToken();
  const styles = useStyles(getStyles);
  const outputRef = useRef(null);

  const refreshCurrentLogs = async () => {
    try {
      const { logs: newLogs = [], end } = await getLogChunks(logs[0]?.id || 0, LIMIT, generateToken(LOGS_CANCEL_TOKEN));
      setLogs(newLogs);
      setLastLog(!!end);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
  };

  const formatLogs = useCallback(
    () => logs.map((log) => log.data).reduce((acc, message) => `${acc}${acc.length ? '\n' : ''}${message}`, ''),
    [logs]
  );

  useEffect(() => {
    triggerTimeout(refreshCurrentLogs, STREAM_INTERVAL, true);
  }, []);

  useEffect(() => {
    if (lastLog) {
      stopTimeout();
    }
  }, [lastLog]);

  return (
    <>
      <CopyToClipboard variant="secondary" textContainer={outputRef} popperConfig={{ placement: 'top-start' }} />
      <pre ref={outputRef}>
        {formatLogs()}
        {!lastLog && <div className={styles.loadingHolder}>{Messages.loading}</div>}
        {lastLog && !logs.length && Messages.noLogs}
      </pre>
    </>
  );
};
