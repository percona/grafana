import React, { FC } from 'react';
import { IconButton, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { ToolTip } from '../../../ToolTip';
import { Feedback } from '../../../Feedback';

interface FeedbackTooltipProps {
  visible: boolean;
  pmmServerId?: string;
  children?: any;
  onClose?: () => void;
}

export const FeedbackTooltip: FC<FeedbackTooltipProps> = ({ visible, children, onClose, pmmServerId}) => {
  const styles = useStyles2(getStyles);

  const feedbackClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const tooltipContent = (
    <>
      {/* close button */}
      <div className={styles.modalHeaderClose}>
        <IconButton data-testid="modal-close-button" name="times" size="lg" onClick={feedbackClose} />
      </div>

      <div className={styles.feedbackContentForm}>
        <Feedback pmmServerId={pmmServerId} />
      </div>
    </>
  );

  return (
    <ToolTip content={tooltipContent} visible={visible}>
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
  feedbackContentForm: css`
    padding: 0 24px 24px 24px;
  `,
});
