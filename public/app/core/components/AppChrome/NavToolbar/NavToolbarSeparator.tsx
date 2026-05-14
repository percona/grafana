import { css, cx } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

export interface Props {
  className?: string;
  leftActionsSeparator?: boolean;
}

export function NavToolbarSeparator({ className, leftActionsSeparator }: Props) {
  const styles = useStyles2(getStyles);

  if (leftActionsSeparator) {
    return <div className={cx(className, styles.leftActionsSeparator)} />;
  }

  // @PERCONA: data-testid is used to select the separator so that it can be hidden by pmm-compat plugin
  return <div className={cx(className, styles.line)} data-testid="nav-toolbar-separator" />;
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    leftActionsSeparator: css({
      display: 'flex',
      flexGrow: 1,
    }),
    line: css({
      width: 1,
      backgroundColor: theme.colors.border.medium,
      height: 24,
      flexShrink: 0,
      flexGrow: 0,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    }),
  };
};
