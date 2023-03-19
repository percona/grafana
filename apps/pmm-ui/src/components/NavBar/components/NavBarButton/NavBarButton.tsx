import React, { FC } from 'react';
import { IconName } from '@grafana/data';
import { Button, ToolbarButton, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export interface NavBarButtonProps {
  title?: string;
  imgSrc?: string;
  imgAlt?: string;
  icon?: IconName;
  onClick?: () => void;
}

export const NavBarButton: FC<NavBarButtonProps> = ({ title, imgSrc, imgAlt, icon, onClick }) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      {icon ? (
        <ToolbarButton icon={icon} onClick={onClick} title={title} />
      ) : (
        <Button className={styles.perconaButton} onClick={onClick}>
          {imgSrc && <img className={styles.perconaButtonImage} alt={imgAlt} src={imgSrc} />}
          <div className={styles.perconaButtonLabel}>{title}</div>
        </Button>
      )}
    </>
  );
};

export const getStyles = (theme: GrafanaTheme2) => ({
  perconaButton: css`
    color: ${theme.colors.text.secondary};

    &:hover {
      color: ${theme.colors.text.primary};
      background: ${theme.colors.background.secondary};
    }

    border-radius: ${theme.shape.borderRadius()};
    line-height: ${theme.components.height.md * theme.spacing.gridSize - 2}px;
    font-weight: ${theme.typography.fontWeightMedium};
    border: 1px solid ${theme.colors.border.weak};

    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 0px 0px 0px;

    border-radius: ${theme.shape.borderRadius()};
    background-color: rgb(24, 27, 31);

    flex: none;
    order: 0;
    flex-grow: 0;
    z-index: 0;
  `,
  perconaButtonImage: css`
    width: 32px;
    height: 32px;
    margin-right: 8px;
    flex: none;
    order: 0;
    flex-grow: 0;
  `,
  perconaButtonLabel: css`
    padding: 8px;
    justify-content: center;
    width: 97px;
    height: 16px;

    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    text-align: center;

    margin-right: 8px;
    flex: none;
    order: 1;
    flex-grow: 0;
  `,
});
