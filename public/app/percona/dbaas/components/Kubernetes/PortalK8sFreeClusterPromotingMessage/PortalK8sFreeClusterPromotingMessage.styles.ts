import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

export const getStyles = ({ v1: { spacing, palette } }: GrafanaTheme2) => ({
  link: css`
    color: ${palette.gray4};
    padding-top: ${spacing.sm};
    text-decoration: underline;
    &:hover {
      color: white;
      text-decoration: underline;
    }
  `,
  alertWrapper: css`
    margin-top: ${spacing.md};
  `,
});
