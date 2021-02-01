import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, colors }: GrafanaTheme) => ({
  integratedAlertingWrapper: css`
    margin: ${spacing.lg};
  `,
  link: css`
    color: ${colors.linkExternal};
  `,
});
