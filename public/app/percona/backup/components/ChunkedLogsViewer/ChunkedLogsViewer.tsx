import { Button, Field, Icon, Switch, useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { BackupLogChunk } from '../../Backup.types';
import { useRecurringCall } from '../../hooks/recurringCall.hook';
import { useCancelToken } from 'app/percona/shared/components/hooks/cancelToken.hook';
import { LIMIT, BUFFER, STREAM_INTERVAL, LOGS_CANCEL_TOKEN } from './ChunkedLogsViewer.constants';
import { getStyles } from './ChunkedLogsViewer.styles';
import { ChunkedLogsViewerProps } from './ChunkedLogsViewer.types';
import { Messages } from './ChunkedLogsViewer.messages';
import { concatenateNewerLogs, concatenateOlderLogs } from './ChunkedLogsViewer.utils';

export const ChunkedLogsViewer: FC<ChunkedLogsViewerProps> = ({ getLogChunks }) => {
  const [endOfStream, setEndOfStream] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<BackupLogChunk[]>([]);
  const [stream, setStream] = useState(false);
  const [triggerTimeout, , stopTimeout] = useRecurringCall();
  const [generateToken] = useCancelToken();
  const styles = useStyles(getStyles);

  const refreshCurrentLogs = async () => {
    setLoading(true);
    try {
      const { logs: newLogs = [], end } = await getLogChunks(logs[0]?.id || 0, LIMIT, generateToken(LOGS_CANCEL_TOKEN));
      setLogs(newLogs);
      setEndOfStream(!!end);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getNewerLogs = async () => {
    setLoading(true);
    try {
      const { logs: newLogs = [], end } = await getLogChunks(
        logs[logs.length - 1].id + 1,
        BUFFER,
        generateToken(LOGS_CANCEL_TOKEN)
      );
      setLogs(concatenateNewerLogs(logs, newLogs, LIMIT, BUFFER));
      setEndOfStream(!!end);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getOlderLogs = async () => {
    setLoading(true);
    try {
      const { logs: newLogs = [], end } = await getLogChunks(
        Math.max(0, logs[0].id - BUFFER),
        Math.min(logs[0].id, BUFFER),
        generateToken(LOGS_CANCEL_TOKEN)
      );
      setLogs(concatenateOlderLogs(logs, newLogs, LIMIT, BUFFER));
      setEndOfStream(!!end);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onChangeStream = useCallback(
    (e) => {
      setStream(e.currentTarget.checked);
    },
    [setStream]
  );

  useEffect(() => {
    refreshCurrentLogs();
  }, []);

  useEffect(() => {
    if (stream) {
      triggerTimeout(refreshCurrentLogs, STREAM_INTERVAL);
    } else {
      stopTimeout();
    }
  }, [stream]);

  useEffect(() => {
    if (endOfStream) {
      setStream(false);
    }
  }, [endOfStream]);

  return (
    <>
      <pre>
        {logs.length ? (
          <>
            {logs[0]?.id !== 0 && (
              <div className={styles.btnHolder}>
                {loading ? (
                  Messages.loading
                ) : (
                  <Button className={styles.olderBtn} size="sm" onClick={getOlderLogs} variant="secondary">
                    {Messages.loadOlderLogs}
                  </Button>
                )}
              </div>
            )}
            {logs.map((log) => log.data).reduce((acc, message) => `${acc}${acc.length ? '\n' : ''}${message}`, '')}
            {!endOfStream && (
              <div className={styles.btnHolder}>
                {loading ? (
                  Messages.loading
                ) : (
                  <Button className={styles.newerBtn} size="sm" onClick={getNewerLogs} variant="secondary">
                    {Messages.loadNewerLogs}
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          Messages.noLogs
        )}
      </pre>
      <Field label={Messages.streamLogs} disabled={endOfStream}>
        <Switch value={stream} onChange={onChangeStream} />
      </Field>
      <div className={styles.btnHolder}>
        <Button variant="secondary" onClick={refreshCurrentLogs} disabled={loading}>
          <Icon name="sync" />
        </Button>
      </div>
    </>
  );
};
