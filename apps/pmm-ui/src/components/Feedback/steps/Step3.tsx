import React, { FC, useEffect } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { Messages } from './Step.messages';
import checkImg from '../../../assets/pmm-circle-check-green.svg';
import feedbackSentImg from '../../TopBar/assets/pmm-feedback-sent.svg';

interface Step3Props {
  onFinish: () => void;
  displayTimeMs: number;
}

export const Step3: FC<Step3Props> = ({ displayTimeMs, onFinish }) => {
  const styles = useStyles2(getStyles);

  useEffect(() => {
    setTimeout(() => onFinish(), displayTimeMs);
  }, []);

  return (
    <>
      <div className={styles.main}>
        <img className={styles.imageChecked} alt="feedback-sent" src={feedbackSentImg} />
        <div className={styles.text}>
          <div className={styles.contentTitle}>
            <img className={styles.imageChecked} alt="feedback-sent" src={checkImg} />
            {Messages.step3Title}
          </div>
          <div className={styles.description}>{Messages.thankYou}</div>
        </div>
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  main: css`
    display: flex;
  `,
  imageChecked: css`
    padding: ${theme.spacing(0.5)};
  `,
  text: css`
    margin-left: ${theme.spacing(2)};
  `,
  contentTitle: css`
    font-size: ${theme.typography.h4.fontSize};
    line-height: 22px;
    color: ${theme.colors.text.primary};
  `,
  description: css`
    padding-top: ${theme.spacing(1)};
    font-size: ${theme.typography.h6.fontSize};
    color: rgba(204, 204, 220, 0.65);
    text-align: justify;
  `,
});
