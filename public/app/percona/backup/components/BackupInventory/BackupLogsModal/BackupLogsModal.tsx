import React, { FC, useEffect } from 'react';
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

  const handleRefresh = () => {
    onUpdateLogs();
  };

  useEffect(() => {
    if (isVisible === true) {
      onUpdateLogs();
    }
  }, [isVisible]);

  return (
    <Modal title={title} isVisible={isVisible} onClose={onClose}>
      <pre>{getLogsContent(logs, loadingLogs)}</pre>
      <div className={styles.footer}>
        <Button variant="secondary" onClick={handleRefresh}>
          <Icon name="sync" />
        </Button>
      </div>
    </Modal>
  );
};
