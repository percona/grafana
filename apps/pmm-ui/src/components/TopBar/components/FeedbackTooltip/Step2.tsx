import React, { FC, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, TextArea, useStyles2 } from '@grafana/ui';
import { Messages } from './FeedbackTooltip.messages';


interface Step2Props {
  onSubmit?: (feedbackDescription: string) => void;
}

export const Step2: FC<Step2Props> = ({ onSubmit }) => {
  const styles = useStyles2(getStyles);
  const [feedbackValue, setFeedbackValue] = useState('');

  const submitFeedback = () => {
    if (onSubmit) {
      onSubmit(feedbackValue);
    }
  };

  return (
    <>
      <div className={styles.contentTitle}>
        {Messages.step2Title}
      </div>
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
        <Button icon="message" onClick={submitFeedback}>{Messages.button.sendFeedback}</Button>
        <Button className={styles.dismissButton} variant="secondary" fill="text">{Messages.button.dismiss}</Button>
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
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
