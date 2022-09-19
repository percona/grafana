import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ typography, v1 }: GrafanaTheme2) => ({
  status: css`
    background-color: ${v1.palette.gray1};
    border-radius: 20px;
    color: ${v1.palette.gray85};
    cursor: default;
    font-size: ${typography.size.sm};
    padding: 3px 15px;
    display: flex;
  `,

  badgeTextWrapper: css`
    display: flex;
    align-items: flex-start;
  `,

  versionAvailable: css`
    margin-left: ${v1.spacing.xs};
  `,
});
