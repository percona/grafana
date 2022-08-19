import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  addWrapper: css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: ${spacing.sm};
  `,
  createdAtWrapper: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
});
