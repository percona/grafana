import React, { FC } from 'react';
import { IconButton, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { ToolTip } from '../../../ToolTip';

interface HelpCenterTooltipProps {
  visible: boolean;
  children?: any;
  onClose?: () => void;
}

export const HelpCenterTooltip: FC<HelpCenterTooltipProps> = ({ visible, children, onClose }) => {
  const styles = useStyles2(getStyles);

  const tooltipContent = (
    <>
      <div className={styles.modalHeaderClose}>
        <IconButton data-testid="modal-close-button" name="times" size="xl" onClick={onClose} />
      </div>

      <div className={styles.modalText}>
        <>
          <div className={styles.modalTitle}>Quick access to Help Center</div>
          <div className={styles.modalDescription}>
            From the top bar, get access to tips, contextual help and useful resources to get you going with getting the
            most out of PMM.
          </div>
        </>
      </div>
    </>
  );

  return (
    <ToolTip content={tooltipContent} visible={visible} placement="right-start">
      {children}
    </ToolTip>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  modalHeaderClose: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  modalText: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px 20px 16px;
    gap: 12px;

    flex: none;
    order: 0;
    flex-grow: 0;
  `,
  modalTitle: css`
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;

      display: flex;
      align-items: center;

      color: ${theme.colors.text.primary}
      opacity: 0.67;

      flex: none;
      order: 0;
      align-self: stretch;
      flex-grow: 0;
  `,
  modalDescription: css`
      color: ${theme.colors.text.secondary}
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
      opacity: 0.67;

      letter-spacing: 0.01071em;

      flex: none;
      order: 1;
      align-self: stretch;
      flex-grow: 0;
  `,
});
