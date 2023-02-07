import React from 'react';

import { Button, Modal } from '@grafana/ui';

import { Messages } from './InfoModal.messages';
import { InfoModalProps } from './InforModal.types';

export const InfoModal = ({ isOpen, closeModal }: InfoModalProps) => {
  return (
    <Modal isOpen={isOpen} onDismiss={closeModal} title={Messages.modalTitle}>
      {Messages.modalContent}
      <Modal.ButtonRow>
        <Button onClick={closeModal}>{Messages.buttonLabel}</Button>
      </Modal.ButtonRow>
    </Modal>
  );
};
