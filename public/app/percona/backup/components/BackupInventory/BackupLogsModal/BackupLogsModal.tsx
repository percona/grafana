import React, { FC } from 'react';

import { Modal } from 'app/percona/shared/core-ui';

import { ChunkedLogsViewer } from '../../ChunkedLogsViewer/ChunkedLogsViewer';

import { BackupLogsModalProps } from './BackupLogsModal.types';

export const BackupLogsModal: FC<BackupLogsModalProps> = ({ title, isVisible, onClose, getLogChunks }) => {
  return (
    <Modal title={title} isVisible={isVisible} onClose={onClose}>
      <ChunkedLogsViewer getLogChunks={getLogChunks} />
    </Modal>
  );
};
