import { css, cx } from '@emotion/css';
import { useId, useState } from 'react';
import * as React from 'react';

import { GrafanaTheme2 } from '@grafana/data';

import { useStyles2 } from '../../themes/ThemeContext';
import { IconButton } from '../IconButton/IconButton';

const getStyles = (theme: GrafanaTheme2) => ({
  collapse: css({
    label: 'collapse',
    marginBottom: theme.spacing(1),
    backgroundColor: theme.colors.background.primary,
    border: `1px solid ${theme.colors.border.weak}`,
    position: 'relative',
    borderRadius: theme.shape.radius.default,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  }),
  collapseBody: css({
    label: 'collapse__body',
    padding: theme.spacing(theme.components.panel.padding),
    paddingTop: 0,
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }),
  bodyContentWrapper: css({
    label: 'bodyContentWrapper',
    flex: 1,
  }),
  loader: css({
    label: 'collapse__loader',
    height: '2px',
    position: 'relative',
    overflow: 'hidden',
    background: 'none',
    margin: theme.spacing(0.5),
  }),
  headerCollapsed: css({
    label: 'collapse__header--collapsed',
    padding: theme.spacing(1, 2, 1, 2),
  }),
  loaderActive: css({
    label: 'collapse__loader_active',
    '&:after': {
      content: "' '",
      display: 'block',
      width: '25%',
      top: 0,
      height: '250%',
      position: 'absolute',
      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        animation: 'loader 2s cubic-bezier(0.17, 0.67, 0.83, 0.67) 500ms',
        animationIterationCount: 100,
      },
      [theme.transitions.handleMotion('reduce')]: {
        animationDuration: '10s',
        animationIterationCount: 20,
      },
      left: '-25%',
      background: theme.colors.primary.main,
    },
    '@keyframes loader': {
      from: {
        left: '-25%',
        opacity: 0.1,
      },
      to: {
        left: '100%',
        opacity: 1,
      },
    },
  }),
  header: css({
    cursor: 'pointer',
    label: 'collapse__header',
    padding: theme.spacing(1),
    display: 'flex',
    gap: theme.spacing(1),
  }),
  button: css({
    marginRight: 0,
  }),
  headerLabel: css({
    label: 'collapse__header-label',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.size.md,
    display: 'flex',
    flex: 1,
  }),
});

export interface Props {
  /** Whether the collapse is collapsible */
  collapsible?: boolean;
  /** Expand or collapse te content */
  isOpen?: boolean;
  /** Element or text for the Collapse header */
  label: React.ReactNode;
  /** Indicates loading state of the content */
  loading?: boolean;
  /** Callback for the toggle functionality */
  onToggle?: (isOpen: boolean) => void;
  /** Additional class name for the root element */
  className?: string;
  // @Percona
  headerCustomClass?: string;
  bodyCustomClass?: string;
  headerLabelCustomClass?: string;
  disabled?: boolean;
}

export const ControlledCollapse = ({ isOpen, onToggle, ...otherProps }: React.PropsWithChildren<Props>) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <Collapse
      isOpen={open}
      collapsible
      {...otherProps}
      onToggle={() => {
        setOpen(!open);
        if (onToggle) {
          onToggle(!open);
        }
      }}
    />
  );
};

export const Collapse = ({
  isOpen,
  label,
  loading,
  // @Percona
  collapsible,
  onToggle,
  className,
  // @Percona
  headerCustomClass,
  headerLabelCustomClass,
  bodyCustomClass,
  disabled = false,
  children,
}: React.PropsWithChildren<Props>) => {
  const style = useStyles2(getStyles);
  const labelId = useId();
  const contentId = useId();

  const onClickToggle = () => {
    if (onToggle && collapsible && !disabled) {
      onToggle(!isOpen);
    }
  };
  const panelClass = cx([style.collapse, className]);
  const loaderClass = loading ? cx([style.loader, style.loaderActive]) : style.loader;
  const headerClass = collapsible ? cx([style.header]) : cx([style.headerCollapsed]);

  return (
    <div className={panelClass}>
      {/* the inner button handles keyboard a11y. this is a convenience for mouse users */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={style.header} onClick={onClickToggle}>
        <IconButton
          data-testid="collapse-clickable"
          className={cx(style.button, headerClass, headerCustomClass)}
          aria-describedby={labelId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-labelledby={labelId}
          name={isOpen ? 'angle-down' : 'angle-right'}
        />
        <div id={labelId} className={cx([style.headerLabel, headerLabelCustomClass])}>
          {label}
        </div>
      </div>
      {isOpen && (
        <div className={cx([style.collapseBody, bodyCustomClass])} id={contentId}>
          <div className={loaderClass} />
          <div className={style.bodyContentWrapper}>{children}</div>
        </div>
      )}
    </div>
  );
};

Collapse.displayName = 'Collapse';
