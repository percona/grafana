import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  page: css`
    max-width: 350px;
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
});
