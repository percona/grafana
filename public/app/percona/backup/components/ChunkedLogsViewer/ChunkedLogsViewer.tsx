import { Button, Icon, useStyles } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import React, { FC, useState, useEffect } from 'react';
import { BackupLogChunk } from '../../Backup.types';
import { getStyles } from './ChunkedLogsViewer.styles';
import { ChunkedLogsViewerProps } from './ChunkedLogsViewer.types';

const LIMIT = 50;
const OFFSET = 20;

export const ChunkedLogsViewer: FC<ChunkedLogsViewerProps> = ({ getLogChunks }) => {
  const [endOfStream, setEndOfStream] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<BackupLogChunk[]>([]);
  const styles = useStyles(getStyles);

  const refreshCurrentLogs = async () => {
    setLoading(true);
    try {
      const { logs: newLogs = [], end } = await getLogChunks(logs[0]?.id || 0, LIMIT);
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
      const { logs: newLogs = [], end } = await getLogChunks(logs[logs.length - 1].id + 1, OFFSET);

      if (newLogs.length) {
        const lastId = newLogs[newLogs.length - 1].id;
        const diff = lastId - logs[0].id + 1;

        if (diff > LIMIT + OFFSET) {
          const sliceStart = LIMIT + OFFSET - diff;
          const subLogs = logs.slice(logs[0].id + sliceStart);
          setLogs([...subLogs, ...newLogs]);
        } else {
          setLogs([...logs, ...newLogs]);
        }
      }
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
        Math.max(0, logs[0].id - OFFSET),
        Math.min(logs[0].id, OFFSET)
      );

      if (newLogs.length) {
        const diff = logs[logs.length - 1].id - newLogs[0].id + 1;

        if (diff > LIMIT + OFFSET) {
          const sliceStart = LIMIT + OFFSET - diff;
          const subLogs = logs.slice(logs[0].id, logs[logs.length - 1].id - sliceStart + 1);
          setLogs([...newLogs, ...subLogs]);
        } else {
          setLogs([...newLogs, ...logs]);
        }
      }
      setEndOfStream(!!end);
    } catch (e) {
      logger.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCurrentLogs();
  }, []);

  return (
    <>
      <pre>
        {logs.length ? (
          <>
            {logs[0]?.id !== 0 && (
              <div className={styles.btnHolder}>
                <Button
                  className={styles.olderBtn}
                  size="sm"
                  onClick={getOlderLogs}
                  variant="secondary"
                  disabled={loading}
                >
                  Load older logs
                </Button>
              </div>
            )}
            {logs.map((log) => log.message).reduce((acc, message) => `${acc}${acc.length ? '\n' : ''}${message}`, '')}
            {!endOfStream && logs.length >= LIMIT + OFFSET && (
              <div className={styles.btnHolder}>
                <Button
                  className={styles.newerBtn}
                  size="sm"
                  onClick={getNewerLogs}
                  variant="secondary"
                  disabled={loading}
                >
                  Load newer logs
                </Button>
              </div>
            )}
          </>
        ) : (
          'No Logs'
        )}
      </pre>
      <div className={styles.btnHolder}>
        <Button variant="secondary" onClick={refreshCurrentLogs} disabled={loading}>
          <Icon name="sync" />
        </Button>
      </div>
    </>
  );
};
