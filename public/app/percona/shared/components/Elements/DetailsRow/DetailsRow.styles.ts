import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme2) => ({
  rowContentWrapper: css`
    display: flex;
    flex-direction: column;
  `,
  row: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing(4)};
  `,
});
