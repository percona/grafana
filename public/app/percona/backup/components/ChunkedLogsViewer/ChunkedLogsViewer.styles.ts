import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  btnHolder: css`
    text-align: center;
  `,
  olderBtn: css`
    margin-bottom: ${spacing.md};
  `,
  newerBtn: css`
    margin-top: ${spacing.md};
  `,
});
