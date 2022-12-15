import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  Cell: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  Disabled: css`
    color: ${theme.colors.text.disabled};
  `,
});
