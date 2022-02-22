import { GrafanaTheme } from '@grafana/data';
import { css } from '@emotion/css';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  pageWrapper: css`
    margin-bottom: ${spacing.md};
  `,
});
