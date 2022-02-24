import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  rowsPerPage: css`
    margin-right: ${spacing.md};`,
  pageSize: css`
    display: inline-block;
    width: 70px;`,
});
