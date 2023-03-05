import React, { FC } from 'react';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from "@grafana/data";
import { css } from "@emotion/css";
import checkedIcon from '../../../assets/pmm-circle-check-green.svg';

export interface ConnectedModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ConnectedModal: FC<ConnectedModalProps> = ({ isOpen, onClose}) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <Modal title="" isOpen={isOpen} className={styles.modal} onDismiss={onClose}>
        <div className={styles.verticalGroup}>
          <h3>This PMM instance is now connected to Percona Platform</h3>
          <ul className={styles.unorderedList}>
            <li className={styles.liStyle}>
              You now have access to more Advisiors to automatically check your health.
              <br />
              <a href="#" className={styles.link}>How to use Advisors</a>
            </li>
            <li className={styles.liStyle}>
              You now have access to more Alerts Templates to notify you when something happens.
              <br />
              <a href="#" className={styles.link}>How to use Alerts Templates</a>
            </li>
          </ul>
          <p>
            Every time you need to upgrade and scale your projects, visit our Percona Plans and contact us.
          </p>
          <p>
            Bon voyage 👋
          </p>
          <Button onClick={onClose} className={styles.button}>
            Continue exploring
          </Button>
        </div>
      </Modal>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  modal: css`
    width: 480px;
  `,
  verticalGroup: css`
    padding-left: 8px;
    padding-right: 8px;
    align-items: center
    width: auto;
    /* decrease Modal's default padding */
    transform: translateY(-24px);
  `,
  unorderedList: css`
    padding-left: ${theme.spacing(3)};
    padding-top: ${theme.spacing(2)};
    padding-bottom: ${theme.spacing(2)};
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
  liStyle: css`
    padding-bottom: ${theme.spacing(2)};
    position: relative;
    list-style-type: none;
    &:before {
        content: "";
        position: absolute;
        top: 2px;
        left: -25px;
        width: 21px;
        height: 21px;
        background-image: url(${checkedIcon});
    }
  `,
  button: css`
    float: right;
  `,
});
