import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, palette, colors }: GrafanaTheme) => ({
  apiErrorSection: css`
    margin-bottom: ${spacing.md};
  `,
  errorText: css`
    color: ${palette.redBase};
  `,
  readMore: css`
    color: ${colors.linkExternal};
  `,
});
