import React, { FC, useEffect, useState } from 'react';
import { Tip } from '../Tip';
import { IconName, Spinner, useStyles2 } from '@grafana/ui';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../../../reducers/store';
import {
  fetchSystemTipsAction,
  fetchUserTipsAction,
  setUserTipsCurrentlySelected
} from '../../../../reducers/tips/tips';
import { TipsContainer } from "./TipsContainer";
import { GrafanaTheme2 } from "@grafana/data";
import { css, keyframes } from "@emotion/css";

export interface ExploreYourNewPowerUpsTipsContainerProps {
  userId: number;
}

export const ExploreYourNewPowerUpsTipsContainer: FC<ExploreYourNewPowerUpsTipsContainerProps>=(props) => {
  const {userTips: {loading, tips, currentlySelected}}=useSelector((state: StoreState) => state.tips);

  const styles=useStyles2(getStyles);
  const [isHoveredMarker, setHoveredMarker]=useState(false);

  const state = useSelector((state: StoreState) => state.tips);
  const dispatch=useDispatch();
  const {userId}=props;

  let areTipsCompleted=true;
  tips.forEach((t) => {
    areTipsCompleted=areTipsCompleted && t.completed;
  })

  useEffect(() => {
    dispatch(fetchUserTipsAction({ userId: userId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <>
      {!areTipsCompleted && <>
        <div className={styles.top}/>
        <div className={styles.headerContainer}>
          <h3 className={styles.tipsLabel}>Explore PMM benefits</h3>
          <div
            className={`${styles.notificationMarker} ${isHoveredMarker ? styles.notificationMarkerHidden : ''}`}
            onMouseEnter={() => {
              setHoveredMarker(true);
            }}
            onFocusCapture={() => {
              setHoveredMarker(false);
            }}
          />
        </div>
        <TipsContainer
          key="1"
          tips={tips}
          loading={loading}
          currentlySelectedTipId={currentlySelected}
          userId={userId}
          setTipSelected={setUserTipsCurrentlySelected}
        />
      </>
      }
    </>
  );
};

const getStyles=(theme: GrafanaTheme2) => {
  const pulseRing=keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(4);
    }
  `;
  const pulseDot=keyframes`
    0% {
      transform: scale(1);
    }
    80% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  `;
  const dotDisappearing=keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `;

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
    notificationMarker: css`
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-left: 10px;

      background: #ff5286;
      animation: ${pulseDot} 1125ms cubic-bezier(0.05, 0.91, 0.53, 0.97) infinite;

      &:before {
        content: '';
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 50%;
        background: #ff5286;
        opacity: 0.5;

        animation: ${pulseRing} 1125ms cubic-bezier(0.27, 0.8, 0.46, 0.93) -0.5s infinite;
      }
    `,
    notificationMarkerHidden: css`
      animation: ${dotDisappearing} 1s ease-in-out 1;
      animation-fill-mode: forwards;

      &:before {
        display: none;
      }
    `,
  };
};

