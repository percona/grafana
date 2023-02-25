import React, { FC } from 'react';
import {Button, IconName, Tooltip, useStyles2} from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import checkMarkImg from '../../assets/check-mark.svg';

interface TipProps {
  title: string;
  number?: number;
  tipText?: string;
  buttonText?: string;
  buttonIcon?: IconName;
  buttonTooltipText?: string;
  opened: boolean;
  completed?: boolean;
  onClick?: () => void;
}

export const Tip: FC<TipProps> = (props) => {
  const {
    title,
    number,
    tipText,
    opened,
    onClick,
    completed,
    buttonText,
    buttonIcon,
    buttonTooltipText,
  } = props;
  const styles = useStyles2(getStyles);

  let active: boolean = opened && !completed;
  return (
    <div className={`${styles.tipContainer} ${!active ? styles.tipContainerNoPadding : ''}`}>
      <div className={`${styles.tipHeader} ${!active ? styles.tipPointer : ''}`} onClick={onClick}>
        <div className={`${styles.tipNumber} ${completed ? styles.tipNumberCompleted : (active ? styles.tipNumberActive : styles.tipNumberNotActive)}`}>
          {completed &&
            <img
              alt="tip-check-mark"
              src={checkMarkImg}
            />
          }
          {!completed && number}
        </div>
        <div className={`${styles.tipTitle} ${completed ? styles.tipTitleCompleted : ''}`}>{title}</div>
      </div>
      <div className={`${styles.tipBody} ${!active ? styles.tipBodyHidden : ''}`}>
        <div className={styles.tipText}>{tipText}</div>
        {buttonTooltipText ?
          <Tooltip content={buttonTooltipText} placement="top" interactive={true}>
            <Button variant="secondary" size="md" type="button" icon={buttonIcon}>
              {buttonText}
            </Button>
          </Tooltip>

          : <Button variant="secondary" size="md" type="button" icon={buttonIcon}>
            {buttonText}
          </Button>

        }
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tipContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;

    width: 384px;
    padding-bottom: 16px;

    background: ${theme.colors.background.secondary};
    border-radius: 8px;
  `,
  tipPointer: css`
    cursor: pointer;
  `,
  tipContainerNoPadding: css`
    padding-bottom: 0;
  `,
  tipHeader: css`
    padding-top: 8px;
    padding-left: 8px;
    padding-bottom: 8px;
    display: flex;
    gap: 8px;
  `,
  tipNumber: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 2px;

    width: 28px;
    height: 28px;

    font-weight: 700;
    font-size: 18px;
  `,
  tipNumberActive: css`
    background-color: #f8d06b;
    color: #111217;
    transition: background-color 225ms linear;
  `,
  tipNumberNotActive: css`
    border: 2px solid ${theme.colors.border.weak};
    color: ${theme.colors.text.primary};
  `,
  tipNumberCompleted: css`
    background-color: rgba(108, 207, 142, 0.15);
  `,
  tipTitle: css`
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    color: ${theme.colors.text.primary};

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  tipTitleCompleted: css`
    text-decoration: line-through;
    opacity: 0.67;
  `,
  tipBody: css`
    padding: 16px 16px 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01071em;
    width: 100%;
    max-height: 15em;

    border-top: 1px solid ${theme.colors.border.weak};
  `,
  tipBodyHidden: css`
    padding: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;

    transition: max-height 225ms ease-out;
  `,
  tipText: css`
    margin-bottom: 16px;
  `,
});
