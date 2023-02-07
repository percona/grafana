import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  navActions: css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${spacing.sm};
    padding-bottom: ${spacing.xs};
  `,
});
