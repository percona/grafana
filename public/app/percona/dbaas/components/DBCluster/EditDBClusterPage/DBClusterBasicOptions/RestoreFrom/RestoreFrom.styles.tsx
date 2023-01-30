import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  line: css`
    display: flex;
    gap: ${spacing.lg};
    > div {
      flex: 1 0;
    }
  `,

  hiddenField: css`
    visibility: hidden;
  `,

  field: css`
    width: 50%;
    flex-shrink: 1;
  `,
});
