import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { Messages } from './Step.messages';
import { FeedbackNote } from '../Feedback';
import sadImage from '../../TopBar/assets/sad.svg';
import mehImage from '../../TopBar/assets/meh.svg';
import smileImage from '../../TopBar/assets/smile.svg';

interface Step1Props {
  onSubmit: (val: FeedbackNote) => void;
}

export const Step1: FC<Step1Props> = ({ onSubmit }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.main}>
      <div className={styles.contentTitle}>{Messages.step1Title}</div>
      <div className={styles.rating}>
        <Button variant="secondary" icon="info" onClick={() => onSubmit('bad')} className={fixedIconStyle(sadImage)}>
          {Messages.button.badFeedback}
        </Button>
        <Button variant="secondary" icon="info" onClick={() => onSubmit('fair')} className={fixedIconStyle(mehImage)}>
          {Messages.button.fairFeedback}
        </Button>
        <Button variant="secondary" icon="info" onClick={() => onSubmit('good')} className={fixedIconStyle(smileImage)}>
          {Messages.button.goodFeedback}
        </Button>
      </div>
      <div className={styles.ratingDescription}>{Messages.ratingDescription}</div>
    </div>
  );
};

const fixedIconStyle = (image: any) =>
  css`
    width: 102px;

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
  main: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
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
