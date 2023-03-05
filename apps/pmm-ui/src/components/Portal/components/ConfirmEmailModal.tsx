import React, { FC } from 'react';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
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
        <h3>Finish the connection to Percona Platform</h3>
        <p>
          To get advantage of all the perks from the PMM connection to Percona Platform you still need to confirm your
          email address.
        </p>
        <p>All you need to do is check your email inbox and click on the confirmation link we’ve sent.</p>
        <Modal.ButtonRow>
          <Button onClick={onResend} variant="secondary" fill="text">
            Re-send email
          </Button>
          <Button onClick={onClose}>Close</Button>
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
