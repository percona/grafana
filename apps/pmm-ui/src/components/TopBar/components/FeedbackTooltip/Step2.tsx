import React, { FC, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, TextArea, useStyles2 } from '@grafana/ui';

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
        We&apos;re sorry to hear it... Can you tell us more about your experience and what went wrong?
      </div>
      <div className={styles.feedbackHolder}>
        <TextArea
          placeholder="Write your feedback here"
          onChange={(e) => {
            setFeedbackValue(e.currentTarget.value);
          }}
        />
      </div>
      <div className={styles.ratingDestription}>We will use your feedback to improve our products and services.</div>
      <div>
        <Button icon="message" onClick={submitFeedback}>Send feedback</Button>
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  contentTitle: css`
      font-size: ${theme.typography.h4.fontSize};
      line-height: 22px;
      color: ${theme.colors.text.primary}
  `,
  feedbackHolder: css`
    align-self: stretch;
  `,
  ratingDestription: css`
      line-height: 15px;
      color: rgba(204, 204, 220, 0.65);
  `,
});
