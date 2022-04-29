import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  widgetsWrapper: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${spacing.lg} ${spacing.xl};
  `,
});
