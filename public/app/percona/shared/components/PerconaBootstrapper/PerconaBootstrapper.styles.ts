import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing }, isLight }: GrafanaTheme2) => ({
  iconContainer: css`
    text-align: center;
    margin-bottom: ${spacing.md};
  `,
  svg: css`
    width: 100px;
    height: 100px;

    & path {
      fill: ${isLight ? 'black' : ''};
    }
  `,
  list: css`
    padding-left: ${spacing.lg};
    margin-bottom: ${spacing.lg};
  `,
  docsLink: css`
    text-decoration: underline;
  `,
});
