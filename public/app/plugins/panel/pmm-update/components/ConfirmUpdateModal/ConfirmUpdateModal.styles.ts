import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  modal: css`
    max-width: 500px;
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
});
