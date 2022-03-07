import { GrafanaTheme } from '@grafana/data';
import { css } from '@emotion/css';
import { palette } from '@grafana/data/src/themes/palette';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  pageWrapper: css`
    margin-bottom: ${spacing.md};
  `,
  rowProps: css`
    cursor: pointer;
    &:hover {
      background-color: ${palette.gray15};
    }
  `,
  cellProps: css`
    background-color: transparent !important;
  `,
});
