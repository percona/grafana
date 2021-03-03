import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  nameSpan: css`
    margin-right: ${spacing.md};
  `,
});
