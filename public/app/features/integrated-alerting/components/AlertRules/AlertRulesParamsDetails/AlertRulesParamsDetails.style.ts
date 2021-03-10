import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  paramLabel: css`
    margin-right: ${spacing.sm};
    text-transform: capitalize;
  `,
});
