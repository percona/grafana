import { stylesFactory } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { css } from '@emotion/css';

export const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  diagnosticsWrapper: css`
    flex: 1;
  `,
  diagnosticsLabel: css`
    display: flex;
    i {
      margin-left: ${theme.spacing.xs};
    }
  `,
  diagnosticsButton: css`
    margin-top: ${theme.spacing.md};
    svg {
      margin-right: ${theme.spacing.sm};
    }
  `,
}));
