import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, palette }: GrafanaTheme) => ({
  apiErrorSection: css`
    margin-bottom: ${spacing.md};
  `,
  errorText: css`
    color: ${palette.redBase};
  `,
});
