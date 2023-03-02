import React, { FC } from 'react';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
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
        <h3>Get more out of PMM by connecting to Percona Platform</h3>
        <ul className={styles.unorderedList}>
          <li>Get more <a href="#" className={styles.link}>Advisors</a> to automatically check your system health status.</li>
          <li>Get more <a href="#" className={styles.link}>Alerts Templates</a> to notify you when something happens.</li>
        </ul>
        {isAdmin ? (
          <p>
            By clicking on Continue to Platform you’ll be taken to the Percona Platform to sign in and give permissions
            to Percona to access this PMM instance details.
          </p>
        ) : (
          <>
            <h4>Contact your PMM administrator</h4>
            <p>
              In order to get advantage of the above you need to contact your PMM administrator to connect it with
              Percona Platform.
            </p>
          </>
        )}
      </div>
      <Modal.ButtonRow>
        {isAdmin ? <Button onClick={onConfirm}>Continue to platform</Button> : <Button onClick={onClose}>Close</Button>}
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
