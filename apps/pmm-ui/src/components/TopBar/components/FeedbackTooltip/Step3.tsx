import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { HorizontalGroup, useStyles2 } from '@grafana/ui';
import checkImg from '../../assets/pmm-circle-check-green.svg';
import feedbackSentImg from '../../assets/pmm-feedback-sent.svg';

interface Step3Props {}

export const Step3: FC<Step3Props> = () => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <HorizontalGroup>
        <img className={styles.imageChecked} alt="feedback-sent" src={feedbackSentImg} />
        <div>
          <div className={styles.contentTitle}>
            <img className={styles.imageChecked} alt="feedback-sent" src={checkImg} />
            Feedback sent!
          </div>
          <div className={styles.description}>
            Your input is playing a crucial role in shaping the future of PMM and making it even better. Thank you!
          </div>
        </div>
      </HorizontalGroup>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  imageChecked: css`
    padding: ${theme.spacing(0.5)};
  `,
  contentTitle: css`
    font-size: ${theme.typography.h4.fontSize};
    line-height: 22px;
    color: ${theme.colors.text.primary}
  `,
  description: css`
    padding-top: ${theme.spacing(1)};
    font-size: ${theme.typography.h6.fontSize};
    color: rgba(204, 204, 220, 0.65);
    text-align: justify;
  `,
});
