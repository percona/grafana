import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors }: GrafanaTheme) => ({
  link: css`
    color: ${colors.linkExternal};
    &:hover {
      color: ${colors.textBlue};
    }
  `,
});
