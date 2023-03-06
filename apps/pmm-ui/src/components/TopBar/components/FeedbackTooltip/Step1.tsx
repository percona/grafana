import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { Messages } from './FeedbackTooltip.messages';
import sadImage from '../../assets/sad.svg';
import mehImage from '../../assets/meh.svg';
import smileImage from '../../assets/smile.svg';

interface Step1Props {
  onSubmit: () => void;
}

export const Step1: FC<Step1Props> = ({ onSubmit }) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <div className={styles.contentTitle}>{Messages.step1Title}</div>
      <div className={styles.rating}>
        <Button variant="secondary" icon="info" onClick={onSubmit} className={fixedIconStyle(sadImage)}>
          {Messages.button.badFeedback}
        </Button>
        <Button variant="secondary" icon="info" onClick={onSubmit} className={fixedIconStyle(mehImage)}>
          {Messages.button.fairFeedback}
        </Button>
        <Button variant="secondary" icon="info" onClick={onSubmit} className={fixedIconStyle(smileImage)}>
          {Messages.button.goodFeedback}
        </Button>
      </div>
      <div className={styles.ratingDescription}>{Messages.ratingDescription}</div>
    </>
  );
};

const fixedIconStyle = (image: any) =>
  css`
    & > div > svg {
      background-color: currentColor;
      -webkit-mask-image: url(${image});
      mask-image: url(${image});
    }

    & > div > svg > path {
      display: none;
    }
  `;

const getStyles = (theme: GrafanaTheme2) => ({
  contentTitle: css`
    font-size: ${theme.typography.h4.fontSize};
    color: ${theme.colors.text.primary};
  `,
  rating: css`
    display: flex;
    align-self: stretch;
    justify-content: space-between;
  `,
  ratingDescription: css`
    color: rgba(204, 204, 220, 0.65);
  `,
});
