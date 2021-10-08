import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  apiErrorSection: css`
    margin-bottom: ${spacing.md};
  `,
});
