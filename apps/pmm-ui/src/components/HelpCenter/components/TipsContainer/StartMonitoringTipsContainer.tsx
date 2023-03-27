import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { TipsContainer } from './TipsContainer';
import { setSystemTipsCurrentlySelected, TipModel } from '../../../../reducers/tips/tips';

interface StartMonitoringTipsContainerProps {
  userId: number;
  tips: TipModel[];
  currentlySelectedTipId: number;
}

export const StartMonitoringTipsContainer: FC<StartMonitoringTipsContainerProps> = (props) => {
  const {userId, tips, currentlySelectedTipId} = props;
  const styles = useStyles2 (getStyles);

  return (
    <>
      <div className={styles.top}/>
      <div className={styles.headerContainer}>
        <h3 className={styles.tipsLabel}>Start Monitoring with PMM</h3>
      </div>
      <TipsContainer
        key="2"
        tips={tips}
        currentlySelectedTipId={currentlySelectedTipId}
        userId={userId}
        setTipSelected={setSystemTipsCurrentlySelected}
      />
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    top: css`
      height: 24px;
    `,
    tipsLabel: css`
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      color: ${theme.colors.text.primary};
    `,
    headerContainer: css`
      display: flex;
      justify-content: flex-start;
    `,
  };
};
