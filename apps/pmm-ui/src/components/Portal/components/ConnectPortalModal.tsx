import React, { FC } from 'react';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Messages } from './ConnectPortalModal.messages';
import pmmAppIcon from '../../../assets/pmm-app-icon.svg';
import swapIcon from '../../../assets/swap.svg';
import pmmPlatformIcon from '../../../assets/pmm-platform-purple.svg';

export interface ConnectPortalModalProps {
  isOpen?: boolean;
  isAdmin: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const ConnectPortalModal: FC<ConnectPortalModalProps> = ({ isOpen, onClose, onConfirm, isAdmin }) => {
  const styles = useStyles2(getStyles);

  return (
    <Modal title="" isOpen={isOpen} className={styles.modal} onDismiss={onClose}>
      <div className={styles.verticalGroup}>
        <img alt="pmm-app-icon" src={pmmAppIcon} className={styles.icon} />
        <img alt="swap" src={swapIcon} />
        <img alt="pmm-platform-icon" src={pmmPlatformIcon} className={styles.icon} />
      </div>
      <div>
        <h3>{Messages.title}</h3>
        <ul className={styles.unorderedList}>
          <li>
            {Messages.advisors1}
            <a href={Messages.link.advisors} className={styles.link} target="_blank" rel="noreferrer">
              {Messages.advisorsLinkDescription}
            </a>
            {Messages.advisors2}
          </li>
          <li>
            {Messages.alerts1}
            <a href={Messages.link.alerts} className={styles.link} target="_blank" rel="noreferrer">
              {Messages.alertsLinkDescription}
            </a>
            {Messages.alerts2}
          </li>
        </ul>
        {isAdmin ? (
          <p>{Messages.adminDescription}</p>
        ) : (
          <>
            <h4>{Messages.nonAdminWarningTitle}</h4>
            <p>{Messages.nonAdminDescription}</p>
          </>
        )}
      </div>
      <Modal.ButtonRow>
        {isAdmin ? (
          <Button onClick={onConfirm}>{Messages.button.continue}</Button>
        ) : (
          <Button onClick={onClose}>{Messages.button.close}</Button>
        )}
      </Modal.ButtonRow>
    </Modal>
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
  unorderedList: css`
    padding-left: ${theme.spacing(3)};
    padding-bottom: ${theme.spacing(2)};
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
});
