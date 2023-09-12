import React, { FC } from 'react';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Messages } from './ConfirmEmailModal.messages';
import pmmAppIcon from '../../../assets/pmm-app-icon.svg';
import swapIcon from '../../../assets/swap.svg';
import pmmPlatformIcon from '../../../assets/pmm-platform-purple.svg';

export interface ConfirmEmailModalProps {
  isOpen?: boolean;
  onResend?: () => void;
  onClose?: () => void;
}

export const ConfirmEmailModal: FC<ConfirmEmailModalProps> = ({ isOpen, onClose, onResend }) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <Modal title="" isOpen={isOpen} className={styles.modal} onDismiss={onClose}>
        <div className={styles.verticalGroup}>
          <img alt="pmm-app-icon" src={pmmAppIcon} className={styles.icon} />
          <img alt="swap" src={swapIcon} />
          <img alt="pmm-platform-icon" src={pmmPlatformIcon} className={styles.icon} />
        </div>
        <h3>{Messages.title}</h3>
        <p>{Messages.description}</p>
        <p>{Messages.checkYourMail}</p>
        <Modal.ButtonRow>
          <Button onClick={onResend} variant="secondary" fill="text">
            {Messages.button.resend}
          </Button>
          <Button onClick={onClose}>{Messages.button.close}</Button>
        </Modal.ButtonRow>
      </Modal>
    </>
  );
};
const getStyles = (theme: GrafanaTheme2) => ({
  modal: css`
    width: 480px;
  `,
  verticalGroup: css`
    align-items: center
    width: 10px;
    /* decrease Modal's default padding */
    transform: translateY(-24px);
  `,
  icon: css`
    width: 64px;
    height: 64px;
  `,
});
