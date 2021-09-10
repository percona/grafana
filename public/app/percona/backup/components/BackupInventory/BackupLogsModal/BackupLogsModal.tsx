import React, { FC, useEffect, useRef } from 'react';
import { Button, Icon, useStyles } from '@grafana/ui';
import { Modal } from '@percona/platform-core';
import { getStyles } from './BackupLogsModal.styles';
import { BackupLogsModalProps } from './BackupLogsModal.types';
import { getLogsContent } from './BackupLogsModal.utils';

export const BackupLogsModal: FC<BackupLogsModalProps> = ({
  title,
  isVisible,
  logs,
  loadingLogs,
  onUpdateLogs,
  onClose,
}) => {
  const styles = useStyles(getStyles);
  const scrollRef = useRef<null | HTMLPreElement>(null);

  const handleRefresh = async () => {
    await onUpdateLogs();
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isVisible === true) {
      handleRefresh();
    }
  }, [isVisible]);

  return (
    <Modal title={title} isVisible={isVisible} onClose={onClose}>
      <div>
        <pre className={styles.pre}>
          {getLogsContent(logs, loadingLogs)}
          <span ref={scrollRef}></span>
        </pre>
      </div>
      <div className={styles.footer}>
        <Button variant="secondary" onClick={handleRefresh}>
          <Icon name="sync" />
        </Button>
      </div>
    </Modal>
  );
};
