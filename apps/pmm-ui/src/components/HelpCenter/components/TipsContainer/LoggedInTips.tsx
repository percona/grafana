import React, { FC, useState } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css, keyframes } from '@emotion/css';
import {IconName, useStyles2} from '@grafana/ui';
import { Tip } from '../Tip';
import tipsData from './data/tips.json';

export const LoggedInTips: FC = () => {
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
      transform: scale(.8);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(.8);
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
      animation: ${pulseDot} 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;

      &:before {
        content: '';
        position: relative;
        display: block;
        width: 500%;
        height: 500%;
        box-sizing: border-box;
        margin-left: -200%;
        margin-top: -200%;
        border-radius: 50%;
        background: #ee8aa6;
        animation: ${pulseRing} 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      }
    `,
    notificationMarkerHidden: css`
      animation: ${dotDisappearing} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 1;
      animation-fill-mode: forwards;
      &:before {
        display: none;
      }
    `,
  };
};
