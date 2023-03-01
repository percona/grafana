import React, { FC, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css, keyframes } from '@emotion/css';
import {IconName, useStyles2} from '@grafana/ui';
import { Tip } from '../Tip';
import tipsData from './data/tips.json';

export const TipsConnected: FC = () => {
  const styles = useStyles2(getStyles);
  const [tip, setTip] = useState(1);
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
      <div>
        {tipsData.map((t) => (
          <Tip
            title={t.title}
            number={t.id}
            buttonText={t.buttonText}
            buttonIcon={t.buttonIcon as IconName}
            buttonTooltipText={t.buttonTooltipText}
            tipText={t.text}
            onClick={ !t.completed ? () => setTip(t.id) : () => {} }
            completed={t.completed}
            opened={tip === t.id}
          />
        ))}
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  const pulseRing = keyframes`
    0% {
      transform: scale(.33);
    }
    80%, 100% {
      opacity: 0;
    }
  `;
  const pulseDot = keyframes`
    0% {
      transform: scale(1);
    }
    50% {
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

      background: #FF5286;
      animation: ${pulseDot} 1125ms cubic-bezier(0.04, 0.78, 0.52, 0.92) infinite;

      &:before {
        content: '';
        position: relative;
        display: block;
        width: 400%;
        height: 400%;
        box-sizing: border-box;
        margin-left: -150%;
        margin-top: -150%;
        border-radius: 50%;
        background: #FF5286;
        opacity: 0.5;

        animation: ${pulseRing} 1125ms ease-out -.5s infinite;
      }
    `,
    notificationMarkerHidden: css`
      animation: ${dotDisappearing} 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) 1;
      animation-fill-mode: forwards;
      &:before {
        display: none;
      }
    `,
  };
};
