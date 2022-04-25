import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing, palette } }: GrafanaTheme2) => ({
  spinner: css`
    display: flex;
    height: 10em;
    align-items: center;
    justify-content: center;
  `,
  row: css`
    cursor: pointer;
    &:hover {
      background: ${palette.gray15};
    }
  `,
  cell: css`
    background: transparent !important;
  `,
  contentWrapper: css`
    padding: ${spacing.sm};
  `,
});
