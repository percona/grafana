import React, { FC, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, TextArea, useStyles2 } from '@grafana/ui';
import { Messages } from './Step.messages';

interface Step2Props {
  onSubmit: (feedbackDescription: string) => void;
  onDismiss: () => void;
}

export const Step2: FC<Step2Props> = ({ onSubmit, onDismiss }) => {
  const styles = useStyles2(getStyles);
  const [feedbackValue, setFeedbackValue] = useState('');

  return (
    <div className={styles.main}>
      <div className={styles.contentTitle}>{Messages.step2Title}</div>
      <div className={styles.feedbackHolder}>
        <TextArea
          placeholder={Messages.placeholderText}
          onChange={(e) => {
            setFeedbackValue(e.currentTarget.value);
          }}
        />
      </div>
      <div className={styles.note}>{Messages.note}</div>
      <div>
        <Button icon="message" onClick={() => onSubmit(feedbackValue)}>
          {Messages.button.sendFeedback}
        </Button>
        <Button onClick={onDismiss} className={styles.dismissButton} variant="secondary" fill="text">
          {Messages.button.dismiss}
        </Button>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  main: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  contentTitle: css`
    font-size: ${theme.typography.h4.fontSize};
    line-height: 22px;
    color: ${theme.colors.text.primary};
  `,
  feedbackHolder: css`
    align-self: stretch;
  `,
  note: css`
    line-height: 15px;
    color: rgba(204, 204, 220, 0.65);
  `,
  dismissButton: css`
    margin-left: ${theme.spacing(1)};
  `,
});
