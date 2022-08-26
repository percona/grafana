import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  actionsWrapper: css`
    display: flex;
    justify-content: space-around;
    align-items: center;
  `,
  dropdownField: css`
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
  `,
});
