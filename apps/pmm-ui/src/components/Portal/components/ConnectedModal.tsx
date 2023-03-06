import React, { FC } from 'react';
import { Button, Modal, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Messages } from './ConnectedModal.messages';
import checkedIcon from '../../../assets/pmm-circle-check-green.svg';

export interface ConnectedModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ConnectedModal: FC<ConnectedModalProps> = ({ isOpen, onClose }) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <Modal title="" isOpen={isOpen} className={styles.modal} onDismiss={onClose}>
        <div className={styles.verticalGroup}>
          <h3>{Messages.title}</h3>
        </div>
        <ul className={styles.unorderedList}>
          <li className={styles.liStyle}>
            {Messages.advisorsDescription}
            <br />
            <a href="#" className={styles.link}>
              {Messages.advisorsLinkDescription}
            </a>
          </li>
          <li className={styles.liStyle}>
            {Messages.alertTemplatesDescription}
            <br />
            <a href="#" className={styles.link}>
              {Messages.alertTemplatesLinkDescription}
            </a>
          </li>
        </ul>
        <p>{Messages.contactUs}</p>
        <p className={styles.endingParagraph}>{Messages.bonVoyage}</p>
        <Modal.ButtonRow>
          <Button onClick={onClose}>{Messages.button.continue}</Button>
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
    padding-left: 8px;
    padding-right: 8px;
    align-items: center
    width: auto;
    /* decrease Modal's default padding */
    transform: translateY(-24px);
  `,
  unorderedList: css`
    padding-left: ${theme.spacing(3)};
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
  liStyle: css`
    padding-bottom: ${theme.spacing(2)};
    position: relative;
    list-style-type: none;
    &:before {
      content: '';
      position: absolute;
      top: 2px;
      left: -25px;
      width: 21px;
      height: 21px;
      background-image: url(${checkedIcon});
    }
  `,
  endingParagraph: css`
    margin-bottom: 0px;
  `,
});
