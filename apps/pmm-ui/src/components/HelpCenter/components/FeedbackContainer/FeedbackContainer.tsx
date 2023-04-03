import React, { FC } from 'react';
import { Feedback } from '../../../Feedback';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';

interface FeedbackContainerProps {
  visible: boolean;
  onFinish?: () => void;
}

export const FeedbackContainer: FC<FeedbackContainerProps> = ({ visible, onFinish }) => {
  const styles = useStyles2(getStyles);

  return <div className={styles.container}>{visible && <Feedback onFinish={onFinish} />}</div>;
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    padding-top: ${theme.spacing(1)};
  `,
});
