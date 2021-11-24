import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  form: css`
    display: flex;
  `,
  button: css`
    height: 37px;
    margin-left: ${spacing.md};
    margin-top: 19px;
  `,
});
