import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { colors: v1Colors } }: GrafanaTheme2) => ({
  link: css`
    color: ${v1Colors.linkExternal};
    &:hover {
      color: ${v1Colors.textBlue};
    }
  `,
  content: css`
    max-width: 80%;
  `,
});
