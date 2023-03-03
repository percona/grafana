import React, { FC } from 'react';
import { useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

interface ActionCardProps {
  onClick?: () => void;
  imgSrc?: string;
  imgAlt?: string;
  text: string;
  isClickable?: boolean;
}

export const ActionCard: FC<ActionCardProps> = ({ imgSrc, onClick, imgAlt, text, isClickable }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={`${styles.actionCard} ${isClickable ? styles.actionCardClickable : ''}`} onClick={onClick}>
      <div className={styles.actionCardImageContainer}>
        <img className={styles.actionCardImage} src={imgSrc} alt={imgAlt} />
      </div>
      <div>
        <span>{text}</span>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  actionCard: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;

    width: 160px;
    height: 101px;

    background: ${theme.colors.background.canvas};
  `,
  actionCardClickable: css`
    cursor: pointer;
  `,
  actionCardImageContainer: css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 40px;
    gap: 10px;
    width: 160px;
    height: 80px;
  `,
  actionCardImage: css``,
});
