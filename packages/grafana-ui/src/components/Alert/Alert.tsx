import { css, cx } from '@emotion/css';
import { useId } from '@react-aria/utils';
import React, { HTMLAttributes, ReactNode } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { useTheme2 } from '../../themes';
import { IconName } from '../../types/icon';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  /** On click handler for alert button, mostly used for dismissing the alert */
  onRemove?: (event: React.MouseEvent) => void;
  severity?: AlertVariant;
  children?: ReactNode;
  elevated?: boolean;
  buttonContent?: React.ReactNode | string;
  bottomSpacing?: number;
  topSpacing?: number;
  // @Percona
  customButtonContent?: ReactNode;
  onCustomButtonClick?: (event: React.MouseEvent) => void;
}

export function getIconFromSeverity(severity: AlertVariant): IconName {
  switch (severity) {
    case 'error':
    case 'warning':
      return 'exclamation-triangle';
    case 'info':
      return 'info-circle';
    case 'success':
      return 'check';
  }
}

export const Alert = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      title,
      onRemove,
      children,
      buttonContent,
      elevated,
      bottomSpacing,
      topSpacing,
      className,
      // @Percona
      customButtonContent,
      onCustomButtonClick,
      severity = 'error',
      ...restProps
    },
    ref
  ) => {
    const theme = useTheme2();
    const styles = getStyles(theme, severity, elevated, bottomSpacing, topSpacing);
    const titleId = useId();

    return (
      <div
        ref={ref}
        className={cx(styles.alert, className)}
        data-testid={selectors.components.Alert.alertV2(severity)}
        role="alert"
        aria-labelledby={titleId}
        {...restProps}
      >
        <div className={styles.icon}>
          <Icon size="xl" name={getIconFromSeverity(severity)} />
        </div>

        <div className={styles.body}>
          <div id={titleId} className={styles.title}>
            {title}
          </div>
          {children && <div className={styles.content}>{children}</div>}
        </div>

        {/* @Percona */}
        {customButtonContent && (
          <div className={styles.buttonWrapper}>
            <Button aria-label="Custom button" variant="primary" onClick={onCustomButtonClick} type="button">
              {customButtonContent}
            </Button>
          </div>
        )}

        {/* If onRemove is specified, giving preference to onRemove */}
        {onRemove && !buttonContent && (
          <div className={styles.close}>
            <IconButton aria-label="Close alert" name="times" onClick={onRemove} size="lg" type="button" />
          </div>
        )}

        {onRemove && buttonContent && (
          <div className={styles.buttonWrapper}>
            <Button aria-label="Close alert" variant="secondary" onClick={onRemove} type="button">
              {buttonContent}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

const getStyles = (
  theme: GrafanaTheme2,
  severity: AlertVariant,
  elevated?: boolean,
  bottomSpacing?: number,
  topSpacing?: number
) => {
  const color = theme.colors[severity];
  const borderRadius = theme.shape.borderRadius();

  return {
    alert: css`
      flex-grow: 1;
      position: relative;
      border-radius: ${borderRadius};
      display: flex;
      flex-direction: row;
      align-items: stretch;
      background: ${theme.colors.background.secondary};
      box-shadow: ${elevated ? theme.shadows.z3 : theme.shadows.z1};
      margin-bottom: ${theme.spacing(bottomSpacing ?? 2)};
      margin-top: ${theme.spacing(topSpacing ?? 0)};

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: ${theme.colors.background.primary};
        z-index: -1;
      }
    `,
    icon: css`
      padding: ${theme.spacing(2, 3)};
      background: ${color.main};
      border-radius: ${borderRadius} 0 0 ${borderRadius};
      color: ${color.contrastText};
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    title: css`
      font-weight: ${theme.typography.fontWeightMedium};
      color: ${theme.colors.text.primary};
    `,
    body: css`
      color: ${theme.colors.text.secondary};
      padding: ${theme.spacing(2)};
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-wrap: break-word;
      word-break: break-word;
    `,
    content: css`
      color: ${theme.colors.text.secondary};
      padding-top: ${theme.spacing(1)};
      max-height: 50vh;
      overflow-y: auto;
    `,
    buttonWrapper: css`
      padding: ${theme.spacing(1)};
      background: none;
      display: flex;
      align-items: center;
    `,
    close: css`
      padding: ${theme.spacing(2, 1)};
      background: none;
      display: flex;
      align-items: center;
    `,
  };
};
