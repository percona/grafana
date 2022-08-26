import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  buttonWrapper: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
});
