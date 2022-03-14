import { GrafanaTheme } from '@grafana/data';
import { css } from '@emotion/css';

export const getStyles = ({ spacing, palette }: GrafanaTheme) => ({
  labelWrapper: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
  `,
});
