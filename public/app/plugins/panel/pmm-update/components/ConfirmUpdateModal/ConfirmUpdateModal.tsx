import React from 'react';

import { Button, Modal, useStyles2 } from '@grafana/ui';

import { useVersionDetails } from '../../hooks';
import { ConfirmUpdateModalProps } from '../../types';

import { Messages } from './ConfirmUpdateModal.messages';
import { getStyles } from './ConfirmUpdateModal.styles';

export const ConfirmUpdateModal: React.FC<ConfirmUpdateModalProps> = ({ isOpen, onCancel, onConfirm }) => {
  const styles = useStyles2(getStyles);
  const [{ installedVersionDetails, nextVersionDetails }] = useVersionDetails();

  return (
    <Modal title={Messages.title} className={styles.modal} isOpen={isOpen} onDismiss={onCancel}>
      <p>
        {Messages.version(installedVersionDetails.installedVersion, nextVersionDetails.nextVersion)}
        <a className={styles.link} rel="noopener noreferrer" target="_blank" href={nextVersionDetails.newsLink}>
          {Messages.checkWhatsNew}
        </a>
        {Messages.dot}
      </p>
      <p>{Messages.instanceStop}</p>
      <p>
        {Messages.learnMore}
        {/* TODO: add docs link */}
        <a className={styles.link} rel="noopener noreferrer" target="_blank" href="/">
          {Messages.checkDocs}
        </a>
        {Messages.dot}
      </p>
      <Modal.ButtonRow>
        <Button data-testid="cancel-update-btn" onClick={onCancel} variant="secondary">
          {Messages.cancel}
        </Button>
        <Button data-testid="confirm-update-btn" onClick={onConfirm} variant="primary">
          {Messages.upgrade}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
};
