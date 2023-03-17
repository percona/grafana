import React, { FC, useEffect, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { useDispatch, useSelector } from 'react-redux'
import { TipsContainer } from './TipsContainer';
import { StoreState } from '../../../../reducers/store';
import { fetchSystemTipsAction, setSystemTipsCurrentlySelected } from '../../../../reducers/tips/tips';

interface StartMonitoringTipsContainerProps {
  userId: number;
}

export const StartMonitoringTipsContainer: FC<StartMonitoringTipsContainerProps>=(props) => {
  const {systemTips: {loading, tips, currentlySelected}}=useSelector((state: StoreState) => state.tips);
  const dispatch=useDispatch();

  let areTipsCompleted=true;
  tips.forEach((t) => {
    areTipsCompleted=areTipsCompleted && t.completed;
  })

  useEffect(() => {
    dispatch(fetchSystemTipsAction({userId: userId}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles=useStyles2(getStyles);
  const {userId}=props;

  return (
    <>
      {!areTipsCompleted && <>
        <div className={styles.top}/>
        <div className={styles.headerContainer}>
          <h3 className={styles.tipsLabel}>Start Monitoring with PMM</h3>
        </div>
        <TipsContainer
          key="2"
          tips={tips}
          loading={loading}
          currentlySelectedTipId={currentlySelected}
          userId={userId}
          setTipSelected={setSystemTipsCurrentlySelected}
        />
      </>
      }
    </>
  );
};

const getStyles=(theme: GrafanaTheme2) => {
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
