import React, { FC, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css, keyframes } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { TipsContainer } from './TipsContainer';

export const TipsConnected: FC = () => {
  const styles = useStyles2(getStyles);
  const [isHoveredMarker, setHoveredMarker] = useState(false);

  return (
    <>
      <div className={styles.top} />
      <div className={styles.headerContainer}>
        <h3 className={styles.tipsLabel}>Explore your new power-ups</h3>
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
      <TipsContainer />
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  const pulseRing = keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(4);
    }
  `;
  const pulseDot = keyframes`
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
  const dotDisappearing = keyframes`
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

        animation: ${pulseRing} 1125ms cubic-bezier(0.27, 0.8, 0.46, 0.93) -.5s infinite;
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
